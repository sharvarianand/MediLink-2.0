# MediLink - Medical Appointment and Health Record System

## Overview
MediLink is a comprehensive medical appointment and health record management system that enables patients to book appointments with doctors and manage their medical records. The system features a modern web interface and mobile application, providing a seamless experience for both patients and healthcare providers.

## Features

### Core Features
- 🔐 User Authentication (Doctor & Patient roles)
- 📅 Appointment Booking and Management
- 📄 Medical Report Upload with OCR
- 👤 Profile Management
- 📱 Cross-platform Support (Web & Mobile)

### Technical Features
- RESTful API Architecture
- Real-time Status Updates
- Secure File Upload
- OCR-based Text Extraction
- Role-based Access Control

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Tesseract.js/OCR.space API

### Web Frontend
- React
- Next.js
- Material-UI/Tailwind CSS
- Axios

### Mobile Frontend
- Kotlin
- Jetpack Compose
- Retrofit
- Coroutines

## Project Structure
```
medilink/
├── backend/           # Node.js & Express backend
├── web/              # React & Next.js web application
├── mobile/           # Kotlin & Jetpack Compose mobile app
├── README.md         # Project documentation
└── .github/          # GitHub workflows and templates
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Android Studio (for mobile development)
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/medilink.git
cd medilink
```

2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

3. Web Frontend Setup
```bash
cd web
npm install
npm run dev
```

4. Mobile App Setup
- Open the `mobile` directory in Android Studio
- Sync Gradle files
- Run the app on an emulator or physical device

## API Documentation

### Authentication Endpoints
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login

### User Endpoints
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile

### Appointment Endpoints
- `POST /appointments` - Create new appointment
- `GET /appointments` - List appointments
- `PUT /appointments/:id/status` - Update appointment status

### Medical Reports Endpoints
- `POST /reports/upload` - Upload medical report
- `GET /reports/:userId` - Get user's medical reports

## Development Guidelines

### Git Workflow
- Use feature branches: `feature/<feature-name>`
- Use bugfix branches: `bugfix/<bug-name>`
- Create pull requests for code review
- Follow conventional commit messages

### Code Style
- Follow ESLint configuration for web
- Follow Kotlin style guide for mobile
- Use Prettier for code formatting

### Testing
- Write unit tests for critical functionality
- Perform end-to-end testing
- Test on multiple devices and browsers

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments
- Tesseract.js for OCR capabilities
- Material-UI for web components
- Jetpack Compose for mobile UI 