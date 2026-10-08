## DOCKER RELATED COMMANDS
### `docker compose up -d ` -> to build(when pulling image from hub) / up conatiner
### `docker exec -it expenseiq_db psql -U expenseiq_user -d expenseiq_db` => to get inside the psql terminal in pg docker container

## LOCALHOST / WEB-VIEW Urls
### `http://localhost:5050/` => to open pgadmin panel / web view , credentials - admin@expenseiq.com, adminpassword

### Django Admin panel login Credentials -
- email = admin@example.com
- pass = admin
### PGADMIN Login Credentials -
- email - admin@expenseiq.com
- pass - adminpassword
### Test User Credentials
{
    "email": "test@example.com",
    "password": "testpassword123",
    "first_name": "Test",
    "last_name": "User"
}

## Django Utility Command
### `Python manage.py check` => it scans for bugs, system compatibility, potential mistakes and settings errors.