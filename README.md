# Vacation Planner Backend

## Table of Contents

- [Usage](#usage)
  - [Start the Server](#1-start-the-server)
  - [Interacting with the API](#2-interacting-with-the-api)
  - [Environment Variables](#3-environment-variables)

## Usage

## 1.  **Start the Server:**
   - Run `npm install` to install dependencies.
   - Create a `.env` file and configure necessary environment variables.
   - Run `npm start` to start the server.

## 2. **Interacting with the API:**
   - Use Postman or any other API testing tool to interact with the backend API.
   - Ensure to include a Bearer token in the header for authorization for all vacation-related APIs.

   - **User Authentication:**
     - **POST Request - Register:**
       - Endpoint: `POST /api/v1/auth/register`
       - Body: JSON object containing user registration details (e.g., email, password, firstName, lastName).
       - Description: Registers a new user account.

     - **POST Request - Login:**
       - Endpoint: `POST /api/v1/auth/login`
       - Body: JSON object containing user login credentials (e.g., email, password).
       - Description: Logs in an existing user and returns an authentication token.

   - **Vacation Management:**
     - **GET Request - Retrieve a Specific Vacation by ID:**
       - Endpoint: `GET /api/v1/vacations/get/:id`
       - Description: Retrieves details of a specific vacation by its ID.

     - **GET Request - Retrieve Vacations by Page:**
       - Endpoint: `GET /api/v1/vacations/byPage`
       - Description: Retrieves vacations based on pagination and optional query parameters.
       - Query Parameters:
         - `pageIndex`: Specifies the page index for pagination.
         - `isFollowed`: Filters vacations based on whether they are followed or not.
         - `isCheckInNotStarted`: Filters vacations based on whether the check-in process has not started yet.
         - `isActiveVacation`: Filters vacations based on whether they are currently active.

     - **POST Request - Toggle Follow Status of a Vacation:**
       - Endpoint: `POST /api/v1/vacations/follow/:id`
       - Description: Toggles the follow status of a specific vacation identified by its ID.

     - **POST Request - Add a New Vacation:**
       - Endpoint: `POST /api/v1/vacations/add`
       - Description: Adds a new vacation entry to the database.
       - Parameters:
         - `destination`: Destination of the vacation.
         - `description`: Description of the vacation.
         - `checkIn`: Date of check-in for the vacation (format: MM/DD/YYYY).
         - `checkOut`: Date of check-out for the vacation (format: MM/DD/YYYY).
         - `price`: Price of the vacation.
         - `image`: Image file of the vacation.

     - **PATCH Request - Edit an Existing Vacation:**
       - Endpoint: `PATCH /api/v1/vacations/edit/:id`
       - Description: Edits an existing vacation entry identified by its ID.
       - Parameters:
         - `destination`: Updated destination of the vacation.
         - `description`: Updated description of the vacation.
         - `checkIn`: Updated date of check-in for the vacation (format: MM/DD/YYYY).
         - `checkOut`: Updated date of check-out for the vacation (format: MM/DD/YYYY).
         - `price`: Updated price of the vacation.
         - `image`: Updated image file of the vacation.

     - **DELETE Request - Delete a Vacation:**
       - Endpoint: `DELETE /api/v1/vacations/delete/:id`
       - Description: Deletes the vacation entry with the specified ID from the database.

## 3. **Environment Variables:**
   - Ensure you have set up the necessary environment variables in the `.env` file. Example variables include:
     - `MONGO_URI`: MongoDB connection URI.
     - `JWT_SECRET`: Secret key for JWT token generation.
     - `JWT_LIFETIME`: Lifetime of JWT tokens.
     - `IMAGE_UPLOAD_PATH`: Path for uploading images.
     - `PORT`: Port number for the server to listen on.
