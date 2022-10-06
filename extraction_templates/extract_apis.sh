#!/bin/bash

cd azure-api-management-devops-resource-kit/src/ARMTemplates && \
dotnet restore && \
dotnet run extract --extractorConfig ../../../apimExtract.json && \
cd -

cd ../service

# remove unused per-file parameters
echo "Removing unused parameter files..."
rm -rfv notused-parameters

# restore non-api related services
echo "Restoring changes to non-api related services..."
SERVICES=("api-management-service.template" "backends.template" "loggers.template" "master.template" "parameters")
for SERVICE in ${SERVICES[@]}; do
    echo 'Restoring apim-iati-dev-'$SERVICE'.json'
    git restore apim-iati-dev-$SERVICE.json
done
