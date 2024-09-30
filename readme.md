# Task Management App - Backend

This is the backend for the Task Management App. It provides CRUD (Create, Read, Update, Delete) operations for Tasks, User authorization and authentication, Task Management, Real time update, Task assignment, Comments, CSV import/export files, Import Tasks from CSV, Filtering, Sorting, Pagination. The app uses **Node.js**, **Express.js**, and **MongoDB** (with **Mongoose** for schema definition).

## Features:
- User Authentication: Secure login and registration using JWT.
- Task Creation: Users can create Task.
- Tasks Fetch: Users can fetch or get Tasks.
- Task Update: Users can update Task.
- Task Delete: Users can delete Task.
- RTU: Real Time Update
- Task Assignments: Users can assign task to another user
- Comments: Users can comment on task
- CSV Import/Export: Users can import/export tasks from/to CSV files
- Filtering, Sorting, Pagination: User can filter, sort their data.

## Technologies Used:
- **Node.js**: JavaScript runtime for building the backend.
- **Express.js**: Web framework to handle routes and middleware.
- **MongoDB**: NoSQL database for storing Task data.
- **Mongoose**: ORM for MongoDB, used to define schemas and interact with the database.
- **Dotenv**: Manages environment variables.
- **JWT**: For creating and verifying tokens (JSON Web Tokens).
- **Bcrypt**: For storing hashed password in database.
- **CORS**: Resource sharing for 2 different servers.
- **CSV-Parser**: Parse the CSV format
- **CSV-Writer**: Write the data from CSV file
- **Fast-CSV**: Write the data to defined path
- **Multer**: Handle multipart/form-data, which is used for uploading files.
- **Socket.io**: Real time update data

## API Endpoints:

### User Routes:

| Method | Endpoint                         | Description                        |
|--------|----------------------------------|------------------------------------|
| **POST**    | `/user/login`                    | Login User                      |
| **POST**     | `/user/signup`                    | Register User                  |

### Task Routes:

| Method | Endpoint                         | Description                        |
|--------|----------------------------------|------------------------------------|
| **POST**    | `/task/create`                    | Create Task                      |
| **GET**     | `/task/`                    | Fetch all Tasks                  |
| **PATCH**   | `/task/update/:id`             | Update Task                      |
| **DELETE**  | `/task/delete/:id`             | Delete Task                      |
| **GET**  | `/task/admin`             | Admin manage task                      |
| **POST**  | `/task/:taskId/comment`             | Give comments on task                      |
| **POST**  | `/task/import`             | Import the CSV file and add on existing task |
| **GET**  | `/task/export`             | Export the CSV file of existing task |

*Note: If you getting error regarding routes so you can check api routes from routes folder

## Requirements:
To run this project locally, ensure you have the following installed:

- **Node.js** (v12+): [Install Node.js](https://nodejs.org/)
- **MongoDB**: Install MongoDB locally or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

## Installation:

1. **Clone the repository**: Download the project files to your local machine by cloning the repository.

2. **Install dependencies**: After navigating to the project directory, install all required Node.js dependencies by running the `npm install` command. This will download and set up all necessary libraries for the app.

3. **Ensure MongoDB is running**: If you're using a local MongoDB instance, make sure MongoDB is running on your system. Alternatively, if you're using a cloud-based MongoDB service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), ensure your connection string in `.env` is properly set.

4. **Run the server**: Start the application server by running the appropriate command for your setup:
- If using Node.js, simply run: `node app.js`.
- If using **nodemon** (a tool for automatically restarting the server), run: `nodemon app.js`.

Once the server is up and running, your API should be accessible for use.
