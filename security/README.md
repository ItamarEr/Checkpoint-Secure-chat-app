# Chat Security Module

## Description
This project is a Node.js application built with TypeScript and Express. It provides authentication functionality, including user login and registration, as well as URL scanning capabilities to detect and categorize potentially malicious links in chat messages.

## Project Structure
```
security
├── src
│   ├── app.ts
│   ├── server.ts
│   ├── config
│   │   ├── env.ts
│   │   ├── url.config.ts
│   │   └── index.ts
│   ├── middleware
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── routes
│   │   ├── auth.routes.ts
│   │   ├── url.routes.ts
│   │   └── index.ts
│   ├── controllers
│   │   ├── auth.controller.ts
│   │   ├── url.controller.ts
│   │   └── index.ts
│   ├── services
│   │   ├── auth.service.ts
│   │   ├── url.service.ts
│   │   └── index.ts
│   ├── schemas
│   │   ├── auth.schema.ts
│   │   └── index.ts
│   └── types
│       └── index.ts
├── .dockerignore
├── .gitignore
├── Dockerfile
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd security
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on the `.env.example` file and configure your environment variables, including the URLSCAN_API_KEY.
5. Start the application:
   ```
   npm run start
   ```

## Usage

### Authentication
- The application exposes authentication routes for user login and registration.
- Middleware is used for error handling and authentication checks.

### URL Security Scanning
- Scan URLs in messages for safety and categorization using the urlscan.io API
- Detect malicious URLs before they can cause harm
- Categorize websites (news, sports, etc.)

#### Testing URL Scanning

You can run a simple test to verify the URL scanner is working properly:

```bash
npm run test:url-scan
```

#### API Endpoints

##### Scan a URL
```
POST /security/url/scan
```

Request body:
```json
{
  "url": "https://example.com"
}
```

##### Process a message with URLs
```
POST /security/url/process-message
```

Request body:
```json
{
  "message": "Check out this website: https://example.com"
}
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.