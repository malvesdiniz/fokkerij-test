# Fokkerij Project

# Setup & Running Instructions
## Database Configuration (Secrets & Env)
We use Docker for the database and User Secrets for the application to keep credentials safe.

### Setup Docker Environment
Create a .env file in the src folder (next to docker-compose.yml) to set the database password for the container:

```Bash
## File: src/.env
DB_ROOT_PASSWORD=your_password
DB_NAME=FokkerijDb
```

### Setup .NET User Secrets
Configure the connection string locally so the API can talk to the Docker container.

```Bash
# Run from solution root
dotnet user-secrets init --project src/Fokkerij.Api
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Port=3306;Database=FokkerijDb;User=root;Password=your_password;" --project src/Fokkerij.Api
````

### Start the Database

```Bash

docker compose up -d --build
````


### Apply Migrations

```Bash
dotnet ef database update -p src/Fokkerij.Infrastructure -s src/Fokkerij.Api
```
### Run the API

```Bash
dotnet run --project src/Fokkerij.Api
````

URL: http://localhost:5222

Test Endpoint: POST /api/Horse