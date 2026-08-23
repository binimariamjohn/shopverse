# KadaPlatz

KadaPlatz is a full-stack marketplace application built with React and Spring Boot. Users can create, view, edit, delete, search, sort, and browse products.

## Features

- Create products
- View product list
- View product details
- Edit products
- Delete products
- Search products by name
- Sort products
- Pagination
- Product categories
- Category validation
- PostgreSQL database
- Docker Compose for local database setup

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router

### Backend

- Java 21
- Spring Boot
- Spring Data JPA
- Hibernate
- Gradle

### Database

- PostgreSQL

### Development

- Docker
- Docker Compose

## How to Run

### Prerequisites

Make sure you have the following installed:

- Java 21
- Node.js
- Docker Desktop

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd kadaplatz
```

### 2. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

Check that the database container is running:

```bash
docker compose ps
```

To stop the database:

```bash
docker compose down
```

### 3. Start the backend

Open a terminal and go to the server directory:

```bash
cd server
```

Windows:

```bash
gradlew.bat bootRun
```

macOS/Linux:

```bash
./gradlew bootRun
```

The backend will start on:

```text
http://localhost:8080
```

You can test it by opening:

```text
http://localhost:8080/products
```

### 4. Start the frontend

Open another terminal and go to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will start on:

```text
http://localhost:5173
```

Open the application in your browser.

## Running the Application

Start the services in this order:

1. PostgreSQL using Docker
2. Spring Boot backend
3. React frontend

Then open:

```text
http://localhost:5173
```

The application currently supports the core product marketplace workflow:

1. Create
2. View
3. Search / Sort
4. Edit
5. Delete

More marketplace features will be added as the project develops.