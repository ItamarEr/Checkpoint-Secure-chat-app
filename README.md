# Checkpoint Chat

A secure, Dockerized chat application with modular microservices for backend, frontend, security gateway, and QA. Built with Node.js, TypeScript, React, Express, and VirusTotal integration for real-time DLP and URL threat detection.
I was the backend developer as part of a team in the "Exellenteam in academy" program in collaboration with Check Point.

## Features
- **Modern Chat App**: Real-time messaging, authentication, and room management
- **Security Gateway**: DLP (Data Loss Prevention) for baking recipes, URL/domain scanning with VirusTotal
- **Frontend**: React + Vite, protected routes, context-based auth
- **Backend**: Express, MongoDB, REST API, WebSocket support
- **QA Service**: Automated scenario testing
- **Dockerized**: Easy local or cloud deployment with Docker Compose

## Architecture
```
[frontend] <-> [security gateway] <-> [backend] <-> [mongodb]
                        |
                    [VirusTotal]
```
- All client traffic passes through the security gateway for DLP and threat checks.

## Quick Start
1. **Clone the repo**
   ```sh
   git clone <repo-url>
   cd checkpoint-chat-team_one-docker-ready
   ```
2. **Set up environment variables**
   - Copy `.env.example` to `.env` in the root and `security/` folders.
   - Add your VirusTotal API key to `security/.env`:
     ```
     VIRUSTOTAL_API_KEY=your-key-here
     ```
3. **Build and run all services**
   ```sh
   docker-compose up --build
   ```
4. **Access the app**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Security Gateway: http://localhost:4000

## Development
- Edit code in `frontend/`, `backend/`, or `security/` and restart the relevant service.
- Run tests in QA or backend with `npm test`.

## Security Gateway
- DLP blocks baking recipes and scans all URLs/domains in messages.
- Integrates with VirusTotal for real-time threat intelligence.
- See logs in the security container for DLP and scan results.

## API Endpoints
- `POST /messages/validate` — Validate message for DLP and malicious URLs
- `POST /messages` — Send message (after validation)
- `POST /url/scan` — Scan a URL or domain directly
