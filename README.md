# Authify

A full-stack user authentication system built with **Next.js**, **MongoDB**, and **Tailwind CSS**. It covers the complete account lifecycle: sign up, email verification, login, logout, a protected profile page, and a secure forgot/reset password flow.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

> A learning project focused on building authentication the right way: hashed passwords, httpOnly cookies, expiring one-time tokens, and clean, responsive UI.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Authentication Flows](#authentication-flows)
- [Security](#security)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Sign up** with username, email, and password, with server-side validation
- **Email verification** using a one-time link that expires after 1 hour
- **Login** with JWT stored in a secure `httpOnly` cookie
- **Logout** that clears the session
- **Profile pages** at `/profile` and `/profile/[id]`
- **Forgot and reset password** via an emailed, single-use link
- **Responsive UI** with a split-screen layout on desktop, mobile-first on small screens
- **Dark mode** that follows the system preference
- **Accessible forms** with labels, focus rings, `autocomplete` attributes, and a show/hide password toggle
- **Toast notifications** for success and error feedback

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js (App Router) with TypeScript |
| Styling | Tailwind CSS |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| Email | Nodemailer with Mailtrap (development) |
| HTTP client | Axios |
| Notifications | react-hot-toast |

## Screenshots

| Login |
| --- |
| <img width="1907" height="865" alt="image" src="https://github.com/user-attachments/assets/c07669ef-1b15-4316-b3eb-f243ed371c45" />| 

| Sign up |
| --- |
|<img width="1910" height="865" alt="image" src="https://github.com/user-attachments/assets/dfecd47b-08ff-4a60-9867-f84efcb7c5db" />|

| Profile |
| --- |
|<img width="1906" height="866" alt="image" src="https://github.com/user-attachments/assets/dce865b7-2693-4adc-afa4-4ec59e8a6ee0" />|

| Reset password |
| --- |
| <img width="1911" height="868" alt="image" src="https://github.com/user-attachments/assets/6cec2e02-0346-415e-b618-58b535286d27" />|

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- A [MongoDB](https://www.mongodb.com/) database (local, or a free [Atlas](https://www.mongodb.com/atlas) cluster)
- A [Mailtrap](https://mailtrap.io/) account for testing emails in development

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Nishit-soni-01/authify-nextjs.git
cd <your-repo>

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# then fill in the values (see "Environment Variables" below)

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Tip:** use `localhost`, not your network IP address. Next.js blocks dev-server resources from other origins by default, which can leave pages without working JavaScript. If you need to open the app from another device, add that address to `allowedDevOrigins` in `next.config.ts`.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Environment Variables

Create a `.env` file in the project root:

```env
# Database
MONGO_URI=mongodb://localhost:27017/authify

# Auth
TOKEN_SECRET=replace-with-a-long-random-string

# App URL (include http:// or https://)
DOMAIN=http://localhost:3000

# Mailtrap (email testing)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your-mailtrap-username
MAILTRAP_PASS=your-mailtrap-password
```

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `TOKEN_SECRET` | Secret used to sign JWTs. Use a long, random value |
| `DOMAIN` | Base URL used to build links in emails |
| `MAILTRAP_*` | SMTP credentials from your Mailtrap inbox |

Generate a strong `TOKEN_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> Never commit your `.env` file. Commit a `.env.example` with placeholder values instead.

## Project Structure

```
src/
├── app/
│   ├── api/users/
│   │   ├── signup/route.ts
│   │   ├── login/route.ts
│   │   ├── logout/route.ts
│   │   ├── me/route.ts
│   │   ├── verifyemail/route.ts
│   │   ├── forgotpassword/route.ts
│   │   └── resetpassword/route.ts
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── profile/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── verifyemail/page.tsx
│   ├── forgotpassword/page.tsx
│   ├── resetpassword/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── dbConfig/
│   └── dbConfig.ts          # MongoDB connection
├── helpers/
│   └── mailer.ts            # Sends verification and reset emails
└── models/
    └── userModel.js         # Mongoose user schema
```

## API Reference

All endpoints live under `/api/users` and exchange JSON.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/signup` | Create an account and send a verification email |
| `POST` | `/verifyemail` | Verify an email address using the emailed token |
| `POST` | `/login` | Authenticate and set the `token` cookie |
| `GET` | `/logout` | Clear the `token` cookie |
| `GET` | `/me` | Return the current user's details |
| `POST` | `/forgotpassword` | Email a password reset link |
| `POST` | `/resetpassword` | Set a new password using the emailed token |

### Example: sign up

```http
POST /api/users/signup
Content-Type: application/json

{
  "username": "jane",
  "email": "jane@example.com",
  "password": "a-strong-password"
}
```

**Responses**

| Status | Meaning |
| --- | --- |
| `201` | Account created |
| `400` | Validation failed, or the email/username is already taken |
| `500` | Unexpected server error |

## Authentication Flows

**Sign up and verify**

1. User submits the sign-up form.
2. The server hashes the password, saves the user, and emails a verification link.
3. The user opens `/verifyemail?token=...`, and the account is marked verified.

**Login**

1. User submits email and password.
2. The server checks the credentials and sets a signed JWT in an `httpOnly` cookie valid for 1 day.
3. The user is redirected to `/profile`.

**Forgot and reset password**

1. User enters their email on `/forgotpassword`.
2. The server emails a link to `/resetpassword?token=...` that is valid for 1 hour.
3. User sets a new password. The token is cleared so the link cannot be reused.

## Security

- Passwords are hashed with **bcrypt** and never stored or logged in plain text.
- Sessions use a JWT in an **`httpOnly`** cookie with `sameSite: "lax"`, and `secure` in production.
- Verification and reset tokens are **random, single-use, and expire after 1 hour**. Only a **SHA-256 hash** is stored in the database.
- Login and forgot-password responses are **generic**, so they do not reveal which emails have accounts.
- API responses never include password hashes or tokens.
- Unexpected server errors return a generic message; details are logged server-side only.

## Roadmap

- [ ] Resend verification email
- [ ] Require verified email before login
- [ ] Route protection with Next.js middleware
- [ ] Rate limiting on login and password reset
- [ ] Edit profile and change password
- [ ] Automated tests

## Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

## Author

**Your Name**
GitHub: [@your-username](https://github.com/your-username)
>>>>>>> de2055bfcf3d556e383d959859c234f99259a2e6
