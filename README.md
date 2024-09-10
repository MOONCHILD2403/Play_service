# Auth Service API Routes Documentation

This document outlines the available routes in the **Play Service** of the microservices-based application. This service allows users to add and manage their preferences and find similar profiles.


## Base Route

- **Base URL**: `/api/v1/play`

## Routes

### Preference Routes

- **`POST /preferences`**
  - Description: Adds or updates the user's preferences.
  - Request Body:
    ```json
    {
      "name": "John Doe",
      "hobbies": ["Sports", "Gardening"],
      "skills": ["Yoga", "Programming"],
      "dob": "1990-01-01",
      "teach": "Gardening",
      "learn": "Woodwork"
    }
    ```
  - Response:
    - Success: `201 Created`
    - Error: `400 Bad Request` if there are validation errors.

- **`GET /preferences`**
  - Description: Retrieves the preferences for the authenticated user.
  - Response:
    - Success: `200 OK` with user preferences
    - Error: `404 Not Found` if preferences are not available.

### Similar Profiles Routes

- **`GET /similar-profiles`**
  - Description: Fetches profiles similar to the authenticated user's preferences.
  - Request Body (optional):
    ```json
    {
      "email": "user@example.com"
    }
    ```
  - Response:
    - Success: `200 OK` with a list of similar profiles

    - Error: `404 Not Found` if no similar profiles are found.


## Database Schema

Below is the database schema for the Play Service:

![Database Schema](./prisma/db_schema.png)


# Environment Variables Setup

To run this **Auth Service**, you need to create a `.env` file in the root directory of your project. This file will store sensitive environment variables.

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MOONCHILD2403/Wallt_frontend.git
   cd play-app
<br>

2. **Create a `.env` File**
   - In the root directory of your project, create a new file named `.env`.

3. **Add Environment Variables**
   - Open the `.env` file in your text editor and add the following lines:

   ```plaintext
   DATABASE_URL="mysql://<db_user>:<db_password>@<db_host>:3306/<db_name>"
   JWT_SECRET=your_jwt_secret
<br>

5. **Install dependencies and run**:
   ```bash
   npm install
   npx prisma migrate dev --name init
   npm run start
<br>
