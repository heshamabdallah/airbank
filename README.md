# Airbank

## API setup
```
cd api
yarn install
cp .env.example .env
node index.js
```

### API database migration
```
sudo -i -u postgres
psql
DROP DATABASE IF EXISTS airbank
CREATE DATABASE airbank
npx prisma migrate dev --name init
npx prisma migrate reset --force
```

### Frontend setup
```
cd frontend
yarn install
cp .env.example .env
yarn serve
```
