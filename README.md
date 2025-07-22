# 🏓 Transcendence

A modern full-stack web application featuring a real-time Pong game with advanced features, built as the final project of the Common Core curriculum at École 42.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Game Features](#game-features)
- [Security](#security)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

Transcendence is a comprehensive web application that recreates the classic Pong game with modern web technologies. This project demonstrates proficiency in full-stack development, real-time communication, user authentication, and responsive design. It serves as the culminating project of the 42 School Common Core, integrating multiple advanced concepts into a single cohesive application.

The application features a complete gaming ecosystem with user management, real-time multiplayer gameplay, tournament systems, and social features, all wrapped in a modern, responsive user interface.

## ✨ Features

### Core Features
- **Real-time Pong Game**: Classic Pong gameplay with modern graphics and smooth animations
- **User Authentication**: Secure registration and login system with session management
- **User Profiles**: Customizable user profiles with avatars and statistics
- **Friends System**: Add friends, view their status, and invite them to games
- **Chat System**: Real-time messaging with private messages and chat rooms
- **Game History**: Complete match history with statistics and replay capabilities
- **Tournament Mode**: Organize and participate in competitive tournaments
- **Leaderboards**: Global and friend rankings based on game performance

### Advanced Features
- **Two-Factor Authentication (2FA)**: Enhanced security with TOTP support
- **OAuth Integration**: Login with external providers (42, Google, GitHub)
- **Real-time Notifications**: Instant notifications for game invites, messages, and system events
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Progressive Web App (PWA)**: Installable web application with offline capabilities
- **Internationalization (i18n)**: Multi-language support
- **Dark/Light Theme**: User preference-based theme switching

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit / Zustand
- **Styling**: Tailwind CSS / Material-UI
- **Real-time Communication**: Socket.IO Client
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library
- **PWA**: Workbox for service workers

### Backend
- **Runtime**: Node.js with Express.js / NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **Real-time**: Socket.IO
- **File Upload**: Multer with cloud storage
- **Validation**: Joi / class-validator
- **Testing**: Jest + Supertest

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Process Management**: PM2
- **Environment**: Environment variables with dotenv
- **Database Migration**: Prisma Migrate
- **Logging**: Winston / Pino

### Security
- **HTTPS**: SSL/TLS encryption
- **CORS**: Cross-Origin Resource Sharing protection
- **Rate Limiting**: Request throttling
- **Input Sanitization**: XSS and injection prevention
- **Helmet.js**: Security headers
- **bcrypt**: Password hashing

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn**
- **Docker** (v20.0.0 or higher)
- **Docker Compose** (v2.0.0 or higher)
- **PostgreSQL** (v14.0.0 or higher) - if running without Docker

## 🎮 Usage

### Getting Started

1. **Create an Account**
   - Visit the application homepage
   - Click "Register" and fill in your details
   - Verify your email (if email verification is enabled)
   - Set up your profile with an avatar and display name

2. **Play Your First Game**
   - Navigate to the "Play" section
   - Choose between "Quick Match" or "Play with Friends"
   - Use arrow keys or WASD to control your paddle
   - First to reach the score limit wins!

3. **Explore Social Features**
   - Add friends by searching for usernames
   - Join chat rooms or create private conversations
   - Check the leaderboards to see top players
   - View your game history and statistics

### Game Controls

- **Player 1**: `W` (up) / `S` (down) or `↑` / `↓` arrow keys
- **Player 2**: `↑` / `↓` arrow keys (local multiplayer)
- **Pause**: `Spacebar` or `P`
- **Menu**: `Escape` or `M`

## 🏓 Game Features

### Game Modes
- **Classic Pong**: Traditional 1v1 Pong gameplay
- **Power-ups**: Special abilities that affect gameplay
- **Custom Rules**: Adjustable ball speed, paddle size, and score limits
- **Spectator Mode**: Watch ongoing games with real-time updates

### Tournament System
- **Single Elimination**: Traditional bracket-style tournaments
- **Round Robin**: Everyone plays everyone format
- **Custom Tournaments**: Create tournaments with specific rules
- **Tournament Chat**: Dedicated chat for tournament participants

### Statistics Tracking
- **Win/Loss Ratio**: Overall performance metrics
- **Average Game Duration**: Time analysis
- **Streak Tracking**: Winning and losing streaks
- **Historical Data**: Complete match history with detailed stats

## 🔒 Security

This application implements multiple security measures:

- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Validation**: Input sanitization and validation
- **Rate Limiting**: API endpoint protection against abuse
- **HTTPS**: Encrypted communication
- **CORS**: Proper cross-origin resource sharing configuration
- **SQL Injection Protection**: Parameterized queries and ORM usage
- **XSS Prevention**: Content Security Policy and input escaping

### Development Guidelines

- Follow the existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting
- Use conventional commit messages

## 📄 License

This project is part of the École 42 curriculum and is for educational purposes. All rights reserved.

---

## ⚠️ Project Status

**Note**: This project is currently in the planning phase. The code has not been implemented yet, and this README serves as a comprehensive overview and specification of what the Transcendence project will include. This documentation outlines the expected features, technologies, and structure that will be developed as part of the 42 School Common Core requirements.

The actual implementation will follow the guidelines and requirements specified in this document.

---

