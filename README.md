🚗 UniRide – Secure Student Carpooling Platform

A full-stack web application that helps students find, offer and safely manage shared campus rides.

📖 About the Project

UniRide is an MCA mini project developed to make student travel more convenient, affordable and organized. Passengers can search and book rides, drivers can publish and manage rides, and administrators can review student and driver verification requests.

The project uses separate interfaces for Passenger, Driver and Administrator roles.

🎬 Project Demo

▶️ Watch the 49-second UniRide demonstration

The demo presents the landing page, passenger dashboard, ride search, driver dashboard, verification workflow, active-ride tracking and administrator verification screen.

Place UniRide_Demo_49s.mp4 and UniRide_Demo_Storyboard.jpg inside docs/demo/ so these links work on GitHub.

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

🔄 Basic Working Flow

A user creates a Passenger or Driver account.

Login returns an authentication token and opens the correct role dashboard.

A driver registers a vehicle and submits verification documents.

An administrator reviews and approves or rejects the documents.

An approved driver publishes a ride.

A passenger searches for the ride and requests a seat.

The driver accepts or rejects the request.

Both users receive relevant status notifications.

The driver updates the ride until it is completed.

📁 Project Structure

Mini_Project/
├── backend/
│   ├── config/             # Database configuration
│   ├── controllers/        # Application and API logic
│   ├── middleware/         # Authentication and file-upload middleware
│   ├── routes/             # Express API routes
│   ├── scripts/            # Administrator setup scripts
│   ├── uploads/            # Local uploaded documents (Git ignored)
│   ├── .env                # Local secrets (Git ignored)
│   └── server.js           # Backend entry point
├── database/
│   └── SQL_Database.sql    # MySQL schema
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── types/
│       └── utils/
├── docs/
│   └── demo/               # Demo video and storyboard
├── .gitignore
└── README.md

✅ Prerequisites

Install these tools before running UniRide:

Node.js and npm

MySQL Server

MySQL Workbench

Git

VS Code or another code editor

🚀 Installation and Setup

1. Clone the repository

git clone https://github.com/twinklesingh12/UniRide.git
cd UniRide

2. Create the MySQL database

Open MySQL Workbench.

Open database/SQL_Database.sql.

Execute the complete script.

Refresh the Schemas panel and confirm that uniride_db and its tables exist.

3. Configure and run the backend

cd backend
npm install

Create backend/.env and add your own values:

PORT=5001
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=uniride_db
JWT_SECRET=replace_with_a_long_random_secret

Start the backend:

npm run dev

If no development script is configured, use:

npm start

4. Configure and run the frontend

Open another terminal:

cd frontend
npm install

Create frontend/.env:

VITE_API_URL=http://127.0.0.1:5001

Start the frontend:

npm run dev

Open http://localhost:5173 in your browser.

🩺 API Health Check

After starting the backend, open:

http://localhost:5001/api/health

A successful response confirms that the Express server is running and reachable.

🌐 Development URLs

Service

URL

Frontend

http://localhost:5173

Backend API

http://localhost:5001

Health Check

http://localhost:5001/api/health

🔒 Security Practices

Passwords are hashed instead of being stored as plain text.

JWT authentication protects private API routes.

Role authorization separates Passenger, Driver and Administrator access.

Multer validates and handles uploaded verification documents.

Database credentials and JWT secrets remain in .env files.

.env, node_modules and uploaded documents should remain excluded through .gitignore.

Demo media must not show passwords, secrets or personal documents.

🧪 Testing Checklist

Register and log in as a Passenger.

Register and log in as a Driver.

Confirm that new users are stored in the MySQL users table.

Submit student and driver verification documents.

Approve or reject a submission through the Administrator panel.

Add a vehicle and publish a ride.

Search and book the ride as a Passenger.

Accept the booking as the Driver.

Test Passenger booking cancellation and Driver ride cancellation.

Check notification links and ride-status changes.

📌 Project Status

UniRide is an MCA academic project under active development. The main authentication, profile, ride, booking, vehicle, driver-verification, student-verification, notification and administrator-verification workflows have been implemented and tested in stages.

Areas still receiving improvement include complete notification redirection, messaging, emergency-contact workflows, broader administrator management, validation, automated testing and deployment.

⚠️ Current Limitations

The project currently runs locally and has not yet been deployed publicly.

Uploaded documents are stored locally during development.

Live location sharing depends on browser location permission.

Real-time chat and notifications may require WebSocket integration for production use.

Production deployment requires stronger file storage, logging, rate limiting and security configuration.

🔮 Future Enhancements

Real-time chat and WebSocket notifications

Map-based route matching and navigation

Cloud storage for verification documents

Email or SMS alerts

Ratings and feedback

Smarter ride recommendations

Automated tests and CI/CD deployment

👩‍💻 Author

Twinkle Singh
MCA Student
🔗 GitHub Profile

⭐ If you find UniRide useful, consider starring the repository.
