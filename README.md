# Laravel with React Project

This project uses Laravel for the backend and React for the frontend.

## Prerequisites

- PHP 8.1 or newer
- Composer
- Node.js 14 or newer
- npm or yarn
- SQLite

## Installation

1. Clone the repository.

2. Install PHP dependencies:
   ```
   composer install
   ```

3. Install JavaScript dependencies:
   ```
   npm install
   # or
   yarn install
   ```

4. Copy the `.env.example` file to `.env` and configure the database settings:
   ```
   cp .env.example .env
   ```

5. Generate the application key:
   ```
   php artisan key:generate
   ```

6. Run database migrations:
   ```
   php artisan migrate
   ```

## Running the Project

1. Start the application:
   ```
   composer run dev
   ```

2. Open your browser and go to `http://127.0.0.1:8000`
