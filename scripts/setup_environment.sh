
#!/bin/sh
# setup_environment.sh

mkdir 'setup_environment'
cd 'setup_environment'

curl -H "Authorization:token $RDCC_TOKEN" -H "Accept:application/vnd.github.v3.raw" -O -L $RDCC_DEPLOYED'.env'
curl -H "Authorization:token $RDCC_TOKEN" -H "Accept:application/vnd.github.v3.raw" -O -L $RDCC_DEPLOYED'environment.ts'
curl -H "Authorization:token $RDCC_TOKEN" -H "Accept:application/vnd.github.v3.raw" -O -L $RDCC_DEPLOYED'environment.prod.ts'
curl -H "Authorization:token $RDCC_TOKEN" -H "Accept:application/vnd.github.v3.raw" -O -L $RDCC_DEPLOYED'cypress.json'

rm -rf ../src/environments/environment.ts
rm -rf ../src/environments/environment.prod.ts
rm -rf ../cypress.json

cp environment.ts ../src/environments/environment.ts
cp environment.prod.ts ../src/environments/environment.prod.ts
cp .env ../functions/.env
cp cypress.json ../cypress.json

cd ..
rm -rf 'setup_environment'
