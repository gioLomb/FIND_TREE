# FIND_TREE 🌳

**FIND_TREE** is a field tool for **geolocating and navigating to trees** (or any outdoor points of interest). It runs as a local Node.js server on a Windows machine and exposes a web interface accessible from any device — including smartphones in the field — via an ngrok public tunnel.

---

## What it does

From the browser interface the user can:

- **View a satellite map** (Esri World Imagery via Leaflet) centered on the current GPS position
- **Add a tree**: enter a name, capture the current GPS position, and save it to the database — a marker is placed on the map immediately
- **Navigate to a tree**: select a saved tree from the dropdown list and draw a red line on the map from the current position to the tree's coordinates
- **Delete a tree**: remove a saved tree from the database and update the map
- **Trigger a danger alert**: press a button that calls the server, which plays `alert.wav` on the host machine via PowerShell

The interface auto-refreshes markers and the select list after every add/delete operation. A loading spinner is shown while the GPS fix is being acquired.

---

## Architecture

```
┌─────────────────────────────────────────┐
│              Host machine (Windows)     │
│                                         │
│  Node.js / Express  ──►  MongoDB        │
│       :8080                             │
│         │                               │
│      ngrok tunnel (Basic Auth)          │
└──────────────┬──────────────────────────┘
               │  public HTTPS URL
               ▼
      Any browser / smartphone
         (Leaflet map UI)
```

- The server runs on port **8080** and detects the local Wi-Fi IP automatically (`getIp.js`)
- ngrok forwards port 8080 to a public HTTPS URL protected by **HTTP Basic Auth**
- MongoDB runs locally on `mongodb://localhost:27017/`, database `find_tree`, collection `trees`
- Each tree document stores: `{ tree: string, lat: number, lng: number }`

---

## Project structure

```
FIND_TREE/
├── server/
│   ├── index.js          # Express app, routes, server startup
│   ├── db.js             # MongoDB connection and CRUD operations
│   ├── ngrokTunnel.js    # ngrok tunnel setup with Basic Auth
│   └── getIp.js          # Reads local Wi-Fi IP from OS interfaces
│
├── public/
│   ├── DUX.HTML          # Main UI: Leaflet map + forms
│   ├── feature.js        # User actions: add, reach, delete tree, alert
│   ├── show_function.js  # Map markers and select list rendering
│   └── style.css         # Layout, spinner, form styles
│
├── alert.wav             # Sound played on danger alert
├── package.json
├── .env                  # Environment variables (git-ignored)
└── .gitignore
```

---

## API endpoints

| Method | Route            | Description                                       |
|--------|------------------|---------------------------------------------------|
| GET    | `/`              | Serves the main HTML interface                    |
| GET    | `/get_all_trees` | Returns all trees as a JSON array                 |
| GET    | `/get_tree?id=`  | Returns a single tree by MongoDB ObjectId         |
| POST   | `/add_tree`      | Inserts a tree `{ tree, lat, lng }` into the DB   |
| POST   | `/delete_tree`   | Deletes a tree by `{ idTree }` (MongoDB ObjectId) |
| GET    | `/danger_alert`  | Plays `alert.wav` on the host machine via PowerShell |

---

## Requirements

- **Windows** (the sound alert uses PowerShell's `Media.SoundPlayer`)
- **Node.js** >= 18
- **MongoDB** running locally on port 27017
- A valid [ngrok](https://ngrok.com/) account and auth token
- A browser with **Geolocation** support (required for adding trees and navigation)

---

## Installation

```bash
git clone <repo-url>
cd find_tree
npm install
```

Create a `.env` file in the project root:

```env
NGROK_AUTHTOKEN=your_ngrok_token
NGROK_USER=your_username
NGROK_PASS=your_password
```

---

## Usage

```bash
node server/index.js
```

On startup:
1. The Express server starts on port 8080
2. The local Wi-Fi IP is printed to the console
3. A public ngrok URL is printed — share it with any device in the field
4. Open the URL in a browser, accept the Basic Auth prompt, and start mapping trees

---

## Dependencies

| Package        | Purpose                                                               |
|----------------|-----------------------------------------------------------------------|
| `express`      | HTTP server and routing                                               |
| `@ngrok/ngrok` | Programmatic ngrok tunnel with Basic Auth                             |
| `mongodb`      | MongoDB Node.js driver for CRUD operations                            |
| `dotenv`       | Loads environment variables from `.env`                               |
| `body-parser`  | Parses incoming JSON request bodies                                   |

Frontend uses **Leaflet.js** (CDN) with the Esri satellite tile layer — no build step required.

