# Menu Backend

## Overview

This project is a backend service for managing categories, subcategories, and items in a menu system. It uses MongoDB for data storage and provides endpoints to create, retrieve, update, and delete categories, subcategories, and items.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Make sure Node.js is installed. You can download it from [nodejs.org](https://nodejs.org/).
- **MongoDB**: Make sure MongoDB is installed and running. You can download it from [mongodb.com](https://www.mongodb.com/try/download/community).

## Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ganeshdole/menu_backend.git
   cd menu_backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory and add the following environment variables:

   ```env
   MONGODB_URI=mongodb://localhost:27017/yourDatabaseName
   ```

4. **Run the Application**

   Start the server:

   ```bash
   npm start
   ```

## API Endpoints

### Categories

- **Create Category**: `POST /categories`
- **Get All Categories**: `GET /categories`
- **Get Category by ID**: `GET /categories/:id`
- **Update Category**: `PATCH /categories/:id`

### Subcategories

- **Create Subcategory**: `POST /subcategories`
- **Get All Subcategories**: `GET /subcategories`
- **Get Subcategories by Parent Category**: `GET /subcategories/by-category`
- **Get Subcategory by ID**: `GET /subcategories/:id`
- **Update Subcategory**: `PATCH /subcategories/:id`

### Items

- **Create Item**: `POST /items`
- **Get All Items**: `GET /items`
- **Get Item by ID**: `GET /items/:id`
- **Update Item**: `PATCH /items/:id`
