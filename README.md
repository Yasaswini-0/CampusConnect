# College Event Registration and Management System

A full-stack FSD project built with React, Express.js, Node.js and MongoDB.

## Features
- Public home page and upcoming events list
- Student event registration saved in MongoDB
- Separate organizer login using Express sessions
- Organizer dashboard: create, edit and delete events
- View registrations and registration counts
- REST APIs using GET, POST, PUT and DELETE
- MongoDB collections: `events`, `registrations`, `organizers`

## Requirements
- Node.js and npm
- MongoDB Community Server running locally, or a MongoDB Atlas connection string
- VS Code (recommended)

## 1. Extract and open
Extract the ZIP file. In VS Code, open the extracted `College-Event-System` folder.

## 2. Configure the backend
Open a terminal in VS Code (Terminal -> New Terminal), then run:

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and update the values if needed.

For local MongoDB, the default connection is:
`mongodb://127.0.0.1:27017/collegeEventDB`

For MongoDB Atlas, replace `MONGO_URI` in `server/.env` with your Atlas connection string.

Set a private session secret and organizer password in `.env`. Example:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/collegeEventDB
SESSION_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
ORGANIZER_USERNAME=organizer
ORGANIZER_PASSWORD=ChangeMe123!
```

Create the organizer account (this stores a hashed password in MongoDB):
```bash
npm run seed:organizer
```

## 3. Install and start the frontend
Open a second VS Code terminal (click the + button in the terminal panel):

```bash
cd client
npm install
npm run dev
```

Open the URL shown by Vite, usually `http://localhost:5173`.

## 4. Start the backend
In the first terminal, from the `server` folder:

```bash
npm run dev
```

The backend runs at `http://localhost:5000`.
Health check: `http://localhost:5000/api/health`

Both terminals must remain running while using the website.

## Organizer login
Use the username and password configured in `server/.env`.
Default example values above are for local development only. Change the password before using the project anywhere public.

## GitHub
The ZIP includes `.gitignore` files that exclude `server/.env`, `node_modules`, and build output. Do not upload your real `.env` file or database credentials to GitHub. Upload `.env.example` instead.

## MongoDB collections
The app creates collections automatically when records are first saved:
- `events`
- `registrations`
- `organizers`

## Troubleshooting
- **MongoDB connection refused:** Start MongoDB Community Server, or verify your Atlas URI and network access.
- **Organizer login fails:** Run `npm run seed:organizer` again after setting `ORGANIZER_USERNAME` and `ORGANIZER_PASSWORD` in `.env`.
- **Frontend cannot reach backend:** Ensure the backend is running on port 5000 and the frontend on port 5173.
- **Port already in use:** Change `PORT` in `server/.env` and update the API base URL in `client/src/api.js` if you change the backend port.
