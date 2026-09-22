# Docker Local Production Deployment Guide

This document outlines the step-by-step instructions to build and run the **Robin Business Hub** production environment on a local server using Docker. This ensures that what you run locally perfectly matches the production environment behavior.

## Prerequisites
1. **Docker Desktop** (or Docker Engine) must be installed and running on your system.
2. Ensure you are in the root directory of the project in your terminal:
   `C:\Users\SVAAN TECH\Downloads\Robin_Business hub`

## Step 1: Prepare Environment Variables
The Docker container needs your environment variables (Database URLs, API Keys) to function correctly, exactly as they are configured on Vercel.

Ensure that you have a valid `.env` file in the root of your project directory containing all required keys:
* `DATABASE_URL`
* `GROQ_API_KEY`
* `SMTP_*` (Email settings)

*Note: Since your database is securely hosted remotely, the Docker container will automatically connect to it using the `DATABASE_URL` without needing a local database instance.*

---

## Step 2: Build the Docker Image
You need to package the Next.js application into a production-ready Docker image. This process installs dependencies, generates the Prisma client, and builds the Next.js optimized production bundle.

Open a terminal in the project folder and run:

```bash
docker build -t robin-platform:latest .
```

* This command reads your `Dockerfile`, pulls the base Node.js Alpine image, safely builds the source code, and tags the final image as `robin-platform:latest`.
* *Note: This step may take a few minutes as it compiles all pages and optimizes assets.*

---

## Step 3: Run the Production Container
Once the image is successfully built, use the following command to start the container. The `--env-file` flag ensures that your securely stored local `.env` file is injected into the container securely.

```bash
docker run -d -p 3000:3000 --env-file .env --name robin-live-app robin-platform:latest
```

**Command Breakdown:**
* `-d`: Runs the container in "detached" mode (background).
* `-p 3000:3000`: Maps port 3000 on your local machine to port 3000 inside the Docker container.
* `--env-file .env`: Automatically loads all API keys and database URLs.
* `--name robin-live-app`: Assigns an easy-to-remember name to the running container.

---

## Step 4: Access the Application
The application is now running locally exactly as it would on a production server. 

Open your web browser and navigate to:
[http://localhost:3000](http://localhost:3000)

*(Try testing features like the chatbot to ensure that the environment variables were accurately passed into the container).*

---

## Step 5: Managing the Container

### View Live Application Logs
To see the live server logs (useful if an error occurs or to verify the server started properly):
```bash
docker logs -f robin-live-app
```

### Stop the Application
When you are done testing and want to shut down the local server:
```bash
docker stop robin-live-app
```

### Start the Application Again (Without Rebuilding)
If you stopped the application and want to bring it back up later:
```bash
docker start robin-live-app
```

### Completely Remove the Container
If you want to delete the container to start fresh (e.g., after changing code and rebuilding the image):
```bash
docker rm -f robin-live-app
```
