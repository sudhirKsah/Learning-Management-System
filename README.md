# Project Assignment Tracker

## Overview

Project Learning Management System is a full-stack web application designed to help teachers manage and track student projects efficiently. The application provides a comprehensive platform for project assignment, progress tracking, and performance evaluation.

## Features

### For Teachers/Managers
- Create and manage projects
- Assign projects to students
- Track student progress
- Evaluate student performance

### For Students/Candidates
- View assigned projects
- Update project progress
- Track individual task scores

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js (v14 or later)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone https://github.com/sudhirKsah/Learning-Management-System.git
cd project-assignment-tracker
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

## Running the Application

1. Start the backend server
```bash
cd backend
npm start
```

2. Start the frontend development server
```bash
cd frontend
npm start
```

## Deployment Considerations

- Configure environment variables for production
- Set up MongoDB Atlas or similar cloud database
- Use process managers like PM2 for Node.js
- Consider containerization with Docker

## Future Enhancements
- Real-time notifications
- Advanced analytics dashboard
- Improved task management
- Integration with external learning platforms

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is open-source and available under the MIT License.