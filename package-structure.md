# Package Structure Reference

## Server `package.json`

```json
{
  "name": "server",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "build": "tsc",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "bcrypt": "^6.0.0",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "kafkajs": "^2.2.4",
    "mongoose": "^9.6.1",
    "nodemailer": "^8.0.7",
    "razorpay": "^2.9.2",
    "socket.io": "^4.8.3",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@types/bcrypt": "^6.0.0",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/node": "^25.6.0",
    "@types/nodemailer": "^8.0.0",
    "ts-node": "^10.9.2",
    "tsx": "^4.21.0",
    "typescript": "^6.0.3"
  }
}
```

## Client `package.json`

```json
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@shadcn/ui": "^0.0.4",
    "autoprefixer": "^10.4.20",
    "chart.js": "^4.4.7",
    "clsx": "^2.1.1",
    "lucide-react": "^1.14.0",
    "next": "^15.1.0",
    "next-themes": "^0.4.6",
    "nodemailer": "^8.0.7",
    "plotly.js": "^2.35.2",
    "postcss": "^8.4.49",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-icons": "^5.6.0",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.3.5",
    "@next/eslint-plugin-next": "^15.5.16",
    "@tailwindcss/postcss": "^4.0.0",
    "@types/node": "^20.17.10",
    "@types/nodemailer": "^8.0.0",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "eslint": "^9.17.0",
    "eslint-config-next": "^15.1.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.2"
  }
}
```

## Notes

- Use `client` for the Next.js front-end app.
- Use `server` for your Node/Express back-end API and service logic.
- Keep `client/app` for Next.js routes, `client/components` for UI, and `client/lib` for helpers.
- Keep `server/src` for back-end source code, with subfolders for config, middleware, models, routes, schemas, services, and types.


## high level prompt structure

Act as a Senior Application Security Engineer. Generate a production-ready authentication system featuring both Signup and Login interfaces. 

### Core Tech Stack:
- Next.js (App Router), TypeScript, Tailwind CSS.
- Security: JWT (JSON Web Tokens), HttpOnly Secure Cookies, Database Sessions, and Refresh Tokens.

### Exact Requirements to Cover in One Response:
1. File Structure: Provide a clean directory layout for the auth components, API routes, middleware, and database utility files.
2. Security Scenarios to Implement:
   - Access tokens stored in-memory; Refresh tokens stored in HttpOnly, SameSite=Strict, Secure cookies.
   - Database-backed session validation matching the active Refresh Token (to allow remote logout/revocation).
   - Automatic token rotation (sliding sessions) on the server side when the access token expires.
   - CSRF protection and basic rate-limiting structure for the API routes.
3. Code Deliverables: Write the core Next.js Middleware for route protection, the Login API route (`/api/auth/login`), and the primary Frontend Login Form Component using Tailwind.

DO NOT use agent tools, look up external repositories, or run terminal commands. Generate the complete structural overview and core files directly in this single chat output.

