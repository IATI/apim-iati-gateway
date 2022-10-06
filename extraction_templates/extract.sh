#!/bin/bash

cd azure-api-management-devops-resource-kit/src/ARMTemplates && \
dotnet restore && \
dotnet run extract --extractorConfig ../../../apimExtract.json && \
cd -

# remove unused per-file parameters
rm -rf ../service/notused-parameters
