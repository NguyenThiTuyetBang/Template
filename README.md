# AI-Agent Full-Stack Project

This is a full-stack web application built with a React (TypeScript, Vite) frontend, a Node.js backend, and a MongoDB database.

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (recommended for running the full stack including the database)
- **MongoDB** (if running locally without Docker)

## Getting Started

You can run this project locally using Docker (easiest way) or through your local Node.js environment.

### Option 1: Running with Docker (Recommended)

Docker handles building both the frontend and backend, and sets up a MongoDB container automatically.

1. Ensure Docker Desktop or the Docker daemon is running.
2. In the root directory, run the following command to build and start the containers in detached mode:
   ```bash
   docker-compose up --build -d
   ```
3. The application will be accessible at:
   - **Frontend:** http://localhost:80
   - **Backend API:** internally accessible by the frontend, but generally exposes ports according to the Dockerfile.

To stop the running containers:

```bash
docker-compose down
```

### Option 2: Running Locally for Development

If you'd like to work on the code locally with hot-reloading:

1. **Database Setup:**
   Ensure you have a local MongoDB instance running.
2. **Environment Variables:**
   Make sure you have a `.env` file inside the `backend` directory with the necessary environment variables (e.g., `MONGO_URI=mongodb://localhost:27017/my_database`).

3. **Install Dependencies:**
   Install dependencies for both frontend and backend by running the following command in the root directory:

   ```bash
   npm run install:all
   ```

4. **Start the Development Servers:**
   Launch both the React frontend and Node.js backend concurrently:
   ```bash
   npm run dev
   ```
   The backend will typically start on port 3000 (check your backend configuration), and the React frontend will provide a local URL (e.g., `http://localhost:5173/`).

## Project Structure

- `/frontend` - React single-page application built with Vite, TypeScript, and styled with Vanilla CSS/Tailwind.
- `/backend` - Node.js REST API with Mongoose for MongoDB data modeling.
- `/docker-compose.yml` - Configuration for container orchestration.
