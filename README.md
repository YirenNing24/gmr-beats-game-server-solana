
# GMR Beats Game Server

## Overview
GMR Beats Game Server is a high-performance backend for real-time multiplayer rhythm games, built to scale and support innovative gameplay, social features, and secure asset management. Designed for grant programs and open collaboration, it leverages modern technologies for speed, reliability, and extensibility.

## Key Features
- ⚡ Fast, scalable multiplayer game logic
- 🎵 Real-time beat and rhythm processing
- 🗂️ Player profiles, inventory, rewards, and leaderboards
- 🤖 AI-powered chat and social interactions
- 🔒 Secure authentication and wallet integration
- 📊 Data storage with MongoDB, KeyDB, and Memgraph
- 🛠️ Modular service architecture for easy extension

## Technologies Used
- Bun (runtime)
- TypeScript
- MongoDB, KeyDB, Memgraph
- Docker & Compose
- WebSockets

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) v1.0.1 or later
- Docker (optional, for database services)

### Installation
```bash
bun install
```

### Running the Server
```bash
bun run src/index.ts
```

### Using Docker Compose (optional)
```bash
docker-compose up -d
```

## Project Structure
```
src/
	app.ts           # Main app entry
	index.ts         # Server bootstrap
	...              # Modular services (game, chat, profile, etc.)
```


## License
This project is open source under the MIT License.
