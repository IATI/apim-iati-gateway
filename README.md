# apim-iati-gateway

## Prequisities

### For extractor tool

- Clone this repo `git clone <repo> --recurse-submodules`
  - Make sure to bring in submodule for extractor tool
- [Azure CLI](https://docs.microsoft.com/en-us/dotnet/azure/install-azure-cli)
- [.NET 3.1.0](https://docs.microsoft.com/en-us/dotnet/core/install/)

## Extracting

Install Extractor Tool as CLI

```bash
cd extraction_templates/azure-api-management-devops-resource-kit/src/APIM_ARMTemplate/apimtemplate
dotnet restore
dotnet run extract --extractorConfig ../../../../apimExtract.json
```

Update the Extractor Tool

- Update the submodule to the latest commit, then do the above

### Updating an Existing API Definition

- Make your changes on the `dev` APIM instance in the Portal as neccessary
- Run the extractor tool
- Diff the changes made to `service/apim-iati-dev-apis.template.json` and include only your changes
  - Remove the last object that has `"type": "Microsoft.ApiManagement/service/diagnostics"`, this is managed elsewhere.
- Also look at `service/policies` for your related policy changes and add proper ones to your git index
- Create a feature branch and commit your changes to `service/apim-iati-dev-apis.template.json` and `service/policies` ONLY
- Remove changes made to other ARM templates by the extractor `git reset --hard HEAD`
- Create a PR so that the ARM validation workflow runs
- If the validation workflow errors with "NoEffect" this is OK
- Merge the PR, the deployment to `dev` workflow will run
- Check in Portal and do testing to ensure the configuration has deployed successfully

### Adding a new API definition and/or backend

- If adding a new API definition with a new backend, you'll also need to get the backend configuration and paramterise it
  - Just make sure you don't wipe out the other backend paramterisation with the extractor tool
- See the `apim-iati-dev-backends.template.json` for and example of how this is done for existing APIs

## Making a Production Release

- Create a PR to merge `develop` -> `main`
- Merge the PR
- Create a Release in GitHub from `main`, increment the tag appropriately with semver standard
- Publish the Release, the `prod` deployment workflow will run
- Check Portal/test that all your config made it there from `dev`

## Developer Portal

The developer portal look and feel customisation cannot be managed with ARM templates in source control.

It can be synced from Dev to PROD using a node script that utilises the Management API behind the scenes.

This is set up in a GitHub Actions Workflow that can be run manually from GitHub

[Workflow On GitHub](https://github.com/IATI/apim-iati-gateway/actions/workflows/apim-developer-portal-sync.yml) > Run Workflow

You can then check that the Developer Portal has been Published in the Portal [here](https://portal.azure.com/#@iatitech.onmicrosoft.com/resource/subscriptions/bcaf7a00-7a14-4932-ac41-7bb0dee0d2a9/resourceGroups/rg-apim-PROD/providers/Microsoft.ApiManagement/service/apim-iati-PROD/apim-portal)

The PROD_AZURE_CREDENTIALS Service Principal has been given Contributor role on both the Dev and Prod Resources so that it can move the resources between them.

## Backup

The APIM instance can be manually backed up by running the `apim-backup.yml` GitHub Actions workflow from GitHub. It is also set to backup the dev and prod instances nightly.

The backup is stored in a blob storage account in the same resource group as the APIM instance that it's backing up.

## Restore

Budget approximately 2-3hrs to complete a restore to a NEW Apim instance.

A backup can be [restored](https://docs.microsoft.com/en-us/powershell/module/az.apimanagement/restore-azapimanagement?view=azps-6.2.1) to a NEW apim instance with the following steps:

- [Install Azure Powershell](https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-6.2.1)
- Create a new APIM instance, e.g. `apim-iati-dr` in the appropriate resource group `rg-apim-dr`
  - The SKU of the service being restored into must match the SKU of the backed-up service being restored.
  - Timing: ~45min
- Create KeyVault Access Policies for the new APIM instance, so it can access `kv-iati-PROD`
- Use the below PowerShell commands to restore from the appropriate backup:
  - Example below: source backup is in a storage account `stapimiatibackupprod` in resource group `rg-apim-prod`, target apim instance is `apim-iati-dr` in resource group `rg-apim-dr`
- Change the CNAME records (`developer.iatistandard.org` and `api.iatistandard.org`) in Cloudflare to point to the new APIM instance URL
- Add the Custom Domain in the Azure Portal (doesn't seem to be copied with the backup)
  - Restore operation doesn't change custom hostname configuration of the target service.
  - Timing: ~20min
- Copy the Developer Portal content from `dev` to your new instance (modify TARGET_ENV in `apim-developer-portal-sync.yml`)

If just restoring to the existing `apim-iati-prod` instance, then only the PowerShell restore command would likely be neccessary.

```pwsh
PS >$storageKey = (Get-AzStorageAccountKey -ResourceGroupName "rg-apim-prod" -StorageAccountName "stapimiatibackupprod")[0].Value

PS >$storageContext = New-AzStorageContext -StorageAccountName "stapimiatibackupprod" -StorageAccountKey $storageKey

PS >Restore-AzApiManagement -ResourceGroupName "rg-apim-dr" -Name "apim-iati-dr" -StorageContext $StorageContext -SourceContainerName "backup" -SourceBlobName "backup_29_07_2021_1535"
```

Take note of considerations [here](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-disaster-recovery-backup-restore#constraints-when-making-backup-or-restore-request)

- Restore is a long running operation that may take up to 30 or more minutes to complete.
- [Constraints](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-disaster-recovery-backup-restore#constraints-when-making-backup-or-restore-request)
- [What is not backed up](https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-disaster-recovery-backup-restore#what-is-not-backed-up)

# Resources

- [Azure/azure-api-management-devops-resource-kit](https://github.com/Azure/azure-api-management-devops-resource-kit)
- [Example Apim Devops](https://github.com/RvLabsMSFT/rvlabs-apim-devops)
