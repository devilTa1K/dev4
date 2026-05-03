# Full-Stack eCommerce Web Application

A production-ready eCommerce application using React, Node.js, Express, MongoDB, Docker, and Jenkins CI/CD.

## Tech Stack
- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Containerization**: Docker + Docker Compose

## Ports Allocated
- **MongoDB**: 27020
- **Backend API**: 5003
- **Frontend**: 3003

## Setup & Running

To run this project:
1. Ensure Docker Desktop is running.
2. Run the following command from the root directory:
   ```bash
   docker compose up -d --build
   ```
3. Once running, seed the database with initial products:
   ```bash
   docker compose exec server node seed.js
   ```

## Services
- Access Frontend: `http://localhost:3003`
- Access Backend API: `http://localhost:5003`

## CI/CD
The repository includes a Windows-compatible `Jenkinsfile` for CI/CD, which stops the old containers and builds/starts the updated containers automatically.
