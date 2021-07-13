# apim-iati-gateway

## Prequisities

### For extractor tool

- [Azure CLI](https://docs.microsoft.com/en-us/dotnet/azure/install-azure-cli)
- [.NET 3.1.0](https://docs.microsoft.com/en-us/dotnet/core/install/)
- [Azure/azure-api-management-devops-resource-kit](https://github.com/Azure/azure-api-management-devops-resource-kit)
- [Example Apim Devops](https://github.com/RvLabsMSFT/rvlabs-apim-devops)

## Extracting

```bash
git clone git@github.com:Azure/azure-api-management-devops-resource-kit.git
cd azure-api-management-devops-resource-kit/src/APIM_ARMTemplate/apimtemplate
dotnet run extract --extractorConfig /Users/nosvalds/Projects/apim-iati-gateway/extraction_templates/devToRepo.json
```
