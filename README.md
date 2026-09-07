# KadaPlatz

KadaPlatz is a full-stack marketplace application built with React and Spring Boot. Users can browse, search, sort, and buy products, with role-based access for sellers and admins.

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
- JWT authentication
- Role-based access (buyer, seller, admin)
- Shopping cart (add, update quantity, remove items)
- Checkout with mock payment
- Order confirmation
- Order history
- PostgreSQL database
- Docker Compose for local database setup

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Auth context + Cart context with protected routes

### Backend

- Java 21
- Spring Boot
- Spring Data JPA
- Hibernate
- Spring Security
- jjwt
- Gradle

### Database

- PostgreSQL

### Development

- Docker
- Docker Compose
- GitHub Actions CI

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

The application supports the following workflow:

1. Register or log in
2. Browse, search and sort products
3. Add items to your cart
4. Checkout with a shipping address and mock card
5. View your order confirmation and order history

Role-based behavior:

1. Public users can browse and view products.
2. Sellers and admins can create and edit products.
3. Only admins can delete products.

Default admin account (auto-seeded on startup):

- Email: `admin@kadaplatz.dev`
- Password: `Admin123!`

## CI

GitHub Actions runs on every push to `main` and on every pull request.

It currently checks:

- `client`: `npm ci`, `npm run lint`, `npm run build`
- `server`: `./gradlew test classes`