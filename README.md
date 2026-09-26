🚗 UniRide – Secure Student Carpooling Platform

A full-stack web application that helps students find, offer and safely manage shared campus rides.

📖 About the Project

UniRide is an MCA mini project developed to make student travel more convenient, affordable and organized. Passengers can search and book rides, drivers can publish and manage rides, and administrators can review student and driver verification requests.

The project uses separate interfaces for Passenger, Driver and Administrator roles.

🎬 Project Demo

▶️ Watch the 49-second UniRide demonstration

The demo presents the landing page, passenger dashboard, ride search, driver dashboard, verification workflow, active-ride tracking and administrator verification screen.

✨ Main Features

🔐 Authentication and User Management

Passenger and driver registration

Login and logout

Secure password hashing with bcrypt

JWT-based authentication

Role-protected routes

User profile and account-status management

🎒 Passenger Module

Search available rides

View route, driver and fare details

Request a seat and view booking status

Cancel eligible bookings

View active and previous bookings

Submit a college ID for student verification

Manage emergency contacts

View messages and notifications

🚘 Driver Module

Add, edit and remove vehicles

Upload vehicle-registration documents

Submit driving licence and government ID documents

Publish and manage rides

Accept or reject booking requests

Cancel eligible rides

Update active-ride stages

Share location during an active ride

View messages and notifications

🛡️ Administrator Module

View the administrator dashboard

Review student-verification submissions

Review driver documents and vehicle information

Approve or reject verification requests

View users, drivers, rides and bookings

Access reports and reported-issue sections

🆘 Safety and Communication

Emergency-contact management

SOS interface

Trip-sharing interface

Passenger and driver messages

Booking, ride and verification notifications

👥 User Roles

Role

Main Responsibilities

🎒 Passenger

Search rides, request seats, manage bookings, track active rides and submit student verification

🚘 Driver

Manage vehicles, submit verification, offer rides, process requests and control ride progress

🛡️ Administrator

Review verifications and monitor users, rides, bookings, reports and issues

🛠️ Technology Stack

Layer

Technologies

🎨 Frontend

React, TypeScript, Vite, React Router, Tailwind CSS

⚙️ Backend

Node.js, Express.js

🗄️ Database

MySQL and mysql2

🔐 Authentication

JSON Web Token and bcrypt

✅ Validation

express-validator

📁 File Upload

Multer

🗺️ Interface Libraries

Leaflet, React Leaflet, Lucide React, Recharts, Sonner and date-fns

🧰 Development Tools

Git, GitHub, VS Code, Postman and MySQL Workbench


👥 User Roles

Passenger: Searches and books rides.

Driver: Publishes rides and manages requests.

Administrator: Reviews verification documents and monitors the platform.

🚀 Quick Setup

1. Clone the project

git clone https://github.com/twinklesingh12/UniRide.git
cd UniRide

2. Set up the database

Run database/SQL_Database.sql in MySQL Workbench.

3. Start the backend

cd backend
npm install
npm run dev

Create backend/.env with:

PORT=5001
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=uniride_db
JWT_SECRET=your_secure_secret

4. Start the frontend

cd frontend
npm install
npm run dev

Open: http://localhost:5173

👩‍💻 Author

Twinkle Singh
MCA Student
🔗 GitHub Profile

⭐ If you find UniRide useful, consider starring the repository.
