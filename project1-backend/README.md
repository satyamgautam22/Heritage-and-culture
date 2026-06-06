# Monsta

A full-stack MERN application that allows users to create, manage, and showcase projects with secure authentication, image uploads, and payment integration.

## Features

- User Authentication (Clerk/JWT)
- Project Management
- Image Uploads via ImageKit
- Stripe Payment Integration
- Real-time Communication using Socket.IO
- Email Notifications using Nodemailer
- RESTful APIs
- Secure Backend with Helmet
- MongoDB Database

## Tech Stack

### Frontend
- React
- Vite
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.IO

### Third-Party Services
- ImageKit
- Stripe
- Clerk Authentication
- OpenAI API

## Project Structure

```bash
monsta/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
└── README.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/monsta.git
cd monsta
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

CLERK_SECRET_KEY=

STRIPE_SECRET_KEY=

IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

OPENAI_API_KEY=
```

Run backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
```

Run frontend:

```bash
npm run dev
```

## Environment Variables

| Variable | Description |
|-----------|------------|
| MONGO_URI | MongoDB Atlas URI |
| JWT_SECRET | JWT Secret |
| CLERK_SECRET_KEY | Clerk Secret |
| STRIPE_SECRET_KEY | Stripe Secret |
| IMAGEKIT_PUBLIC_KEY | ImageKit Public Key |
| IMAGEKIT_PRIVATE_KEY | ImageKit Private Key |
| IMAGEKIT_URL_ENDPOINT | ImageKit Endpoint |
| OPENAI_API_KEY | OpenAI API Key |

## API Features

- Authentication
- User Management
- Project Upload
- Image Upload
- Payment Processing
- Email Notifications
- Real-time Events

## Deployment

### Frontend
Deploy as a Static Site on Render.

### Backend
Deploy as a Web Service on Render.

### Database
MongoDB Atlas.

## Screenshots

Add screenshots here.

## Live Demo

Frontend:
https://your-frontend.onrender.com

Backend:
https://your-backend.onrender.com

## Future Improvements

- Project Analytics
- AI-powered Recommendations
- Advanced Dashboard
- Team Collaboration

## License

MIT License