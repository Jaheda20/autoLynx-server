# AutoLynx API
Overview

AutoLynx API is a Node.js and Express-based server that provides endpoints to manage and retrieve information about cars. It uses MongoDB for data storage and retrieval, with the MongoDB Node.js driver for database interactions.

# Features

Retrieve a list of all cars
Paginate, search, and filter cars
Retrieve details of a single car

# Installation
Prerequisites

Ensure you have the following installed:

    Node.js (v14.x or later)
    npm (v6.x or later) or yarn (v1.x or later)
    MongoDB database

# Usage

The server will start on the port specified in the .env file (default is 8000).
Use a tool like Postman or your browser to interact with the endpoints.

# Environment Variables

    DB_USER: Your MongoDB username.
    DB_PASSWORD: Your MongoDB password.
    PORT: The port on which the server will run (default is 8000)