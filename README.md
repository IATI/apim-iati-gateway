# apim-iati-gateway

## Prequisities

### For extractor tool

- [Azure CLI](https://docs.microsoft.com/en-us/dotnet/azure/install-azure-cli)
- [.NET 3.1.0](https://docs.microsoft.com/en-us/dotnet/core/install/)
- [Azure/azure-api-management-devops-resource-kit](https://github.com/Azure/azure-api-management-devops-resource-kit)
- [Example Apim Devops](https://github.com/RvLabsMSFT/rvlabs-apim-devops)

## Extracting

Install Extractor Tool as CLI

```bash
git clone git@github.com:Azure/azure-api-management-devops-resource-kit.git
cd {path_to_folder}/src/APIM_ARMTemplate/apimtemplate
dotnet pack -c Release
dotnet tool install -g --add-source .\bin\Release apimtemplate
# follow instuctions to save in PATH
```

Run extractor w/ config

```bash
apim-templates extract --extractorConfig extraction_templates/apimExtract.json
```

## Developer Portal

The developer portal look and feel customisation cannot be managed with ARM templates in source control.

It can be synced from Dev to PROD using a node script that utilises the Management API behind the scenes.

This is set up in a GitHub Actions Workflow that can be run manually from GitHub

[Workflow On GitHub](https://github.com/IATI/apim-iati-gateway/actions/workflows/apim-developer-portal-sync.yml) > Run Workflow

You can then check that the Developer Portal has been Published in the Portal [here](https://portal.azure.com/#@iatitech.onmicrosoft.com/resource/subscriptions/bcaf7a00-7a14-4932-ac41-7bb0dee0d2a9/resourceGroups/rg-apim-PROD/providers/Microsoft.ApiManagement/service/apim-iati-PROD/apim-portal)
