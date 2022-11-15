#!/bin/bash

cd azure-api-management-devops-resource-kit/src/ArmTemplates && \
dotnet restore && \
dotnet run extract --extractorConfig ../../../apimExtract.json && \
cd -

cd ../service

# remove unused per-file parameters
echo "Removing unused parameter files..."
rm -rfv notused-parameters

# restore non-api related services
echo "Restoring changes to non-api related services..."
SERVICES=("api-management-service.template" "backends.template" "loggers.template" "master.template")
for SERVICE in ${SERVICES[@]}; do
    echo 'Restoring apim-iati-dev-'$SERVICE'.json'
    git restore apim-iati-dev-$SERVICE.json
done

# Temp XML encoding bugifx: https://github.com/Azure/azure-api-management-devops-resource-kit/issues/825
# Different syntax for sed between MacOS and Linux
if [[ $OSTYPE == 'darwin'* ]]; then
    for filename in policies/* ; do
        echo $filename
        sed -i '' -e 's/&gt;/>/g' $filename
        sed -i '' -e 's/&lt;/</g' $filename
        sed -i '' -e 's/&quot;/"/g' $filename
        sed -i '' -e 's/amp;//g' $filename
    done
else
    for filename in policies/* ; do
        echo $filename
        sed -i -e 's/&gt;/>/g' $filename
        sed -i -e 's/&lt;/</g' $filename
        sed -i -e 's/&quot;/"/g' $filename
        sed -i -e 's/amp;//g' $filename
    done
fi