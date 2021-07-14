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
