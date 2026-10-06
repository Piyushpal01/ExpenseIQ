# ExpenseIQ

ExpenseIQ is a Smart Financial Analytics and Budgeting Platform built with Django REST Framework and PostgreSQL.

## Tech Stack

- Python
- Django
- Django REST Framework
- PostgreSQL
- Docker
- Docker Compose
- JWT Authentication
- django-filter

## Current Features

### Authentication
- User registration
- JWT login
- JWT token refresh
- JWT logout
- Refresh-token blacklisting
- Protected APIs

### Financial Management
- Account CRUD
- Category CRUD
- Income CRUD
- Expense CRUD
- Automatic account balance updates

### API Features
- User-specific data isolation
- Validation
- Search
- Filtering
- Ordering
- Pagination
- Dashboard analytics

### Backend Engineering
- PostgreSQL
- Docker
- Atomic database transactions
- Concurrency-safe balance updates
- Database aggregation
- Optimized related-object queries

## Project Structure

```text
ExpenseIQ/
├── accounts/
├── categories/
├── dashboard/
├── expense/
├── income/
├── users/
├── config/
├── manage.py
├── docker-compose.yml
├── requirements.txt
├── .env.example
└── README.md
```

## Setup
Follow these step-by-step instructions to get **ExpenseIQ** running locally on your machine. 

### Prerequisites
Make sure you have the following installed on your system:
* [Docker & Docker Compose](https://docker.com)
* [uv](https://github.com) (A fast Python package installer and resolver)

---

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd ExpenseIQ
```

#### 2. Initialize Virtual Environment
```bash
uv venv
```

#### 3. Install Project Dependencies
```bash
uv pip install -r requirements.txt
```

#### 4. Configure Environment Variables
Copy .env.example to .env and provide your local configuration.
```bash
cp .env.example .env
```
> 💡 *Note: Open the newly created `.env` file and populate it with your local secrets, database credentials, and secret keys.*

#### 5. Launch PostgreSQL Database
Spin up the isolated PostgreSQL database container running in detached mode via Docker:
```bash
docker compose up -d
```

#### 6. Apply Database Migrations
```bash
uv run python manage.py migrate
```

#### 7. Start Django Development Server
```bash
uv run python manage.py runserver
```