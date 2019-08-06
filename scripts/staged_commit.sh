
#!/bin/sh
# staged_commit.sh

mkdir 'staged_commit'
cd 'staged_commit'

curl -H "Authorization:token $RDCC_TOKEN" -H "Accept:application/vnd.github.v3.raw" -O -L $RDCC_EMPTY'.env'
curl -H "Authorization:token $RDCC_TOKEN" -H "Accept:application/vnd.github.v3.raw" -O -L $RDCC_EMPTY'environment.ts'
curl -H "Authorization:token $RDCC_TOKEN" -H "Accept:application/vnd.github.v3.raw" -O -L $RDCC_EMPTY'environment.prod.ts'
curl -H "Authorization:token $RDCC_TOKEN" -H "Accept:application/vnd.github.v3.raw" -O -L $RDCC_EMPTY'cypress.json'
curl -H "Authorization:token $RDCC_TOKEN" -H "Accept:application/vnd.github.v3.raw" -O -L $RDCC_EMPTY'permissions.json'

rm -rf ../src/environments/environment.ts
rm -rf ../src/environments/environment.prod.ts
rm -rf ../cypress.json
rm -rf ../functions/permissions.json

cp environment.ts ../src/environments/environment.ts
cp environment.prod.ts ../src/environments/environment.prod.ts
cp .env ../functions/.env
cp cypress.json ../cypress.json
cp permissions.json ../functions/permissions.json

cd ..
rm -rf 'staged_commit'
