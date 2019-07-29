
#!/bin/sh
# staged-commit.sh

mkdir 'staged-commit'
cd 'staged-commit'

curl -H "Authorization:token $RDCC_TOKEN" -H "Accept:application/vnd.github.v3.raw" -O -L $RDCC_EMPTY'.env'
curl -H "Authorization:token $RDCC_TOKEN" -H "Accept:application/vnd.github.v3.raw" -O -L $RDCC_EMPTY'environment.ts'
curl -H "Authorization:token $RDCC_TOKEN" -H "Accept:application/vnd.github.v3.raw" -O -L $RDCC_EMPTY'environment.prod.ts'

rm -rf ../src/environments/environment.ts
rm -rf ../src/environments/environment.prod.ts
# rm -rf cypress.json

cp environment.ts ../src/environments/environment.ts
cp environment.prod.ts ../src/environments/environment.prod.ts
cp .env ../functions/.env

cd ..

rm -rf 'staged-commit'
