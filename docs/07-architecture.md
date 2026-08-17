# SquadUp — System Architecture

**Document Version:** 1.0  
**Project:** SquadUp  
**Architecture Style:** Full-stack web application  
**Frontend:** React + Vite  
**Backend:** Python + FastAPI  
**Database:** PostgreSQL + PostGIS

---

# 1. Architecture Goal

SquadUp is a location-based sports activity platform that helps users:

```text
Choose a sport
      ↓
Choose current/preferred location
      ↓
Set search radius
      ↓
Find nearby activities
      ↓
View activity details
      ↓
Join a squad
```

The architecture must be:

- Simple
- Modular
- Secure
- Responsive
- Easy to maintain
- Beginner-friendly
- Suitable for future scaling

---

# 2. High-Level Architecture

```text
                    USER
                      |
              Web Browser / Mobile
                      |
                      v
              React + Vite Frontend
                      |
                  HTTPS / REST
                      |
                      v
                FastAPI Backend
                      |
        +-------------+-------------+
        |             |             |
        v             v             v
 Authentication   Activities    Locations
        |             |             |
        +-------------+-------------+
                      |
                      v
              PostgreSQL + PostGIS
```

---

# 3. Frontend Architecture

The frontend is responsible for:

- User interface
- Navigation
- Forms
- Client-side validation
- Activity cards
- Search and filters
- Location permission
- Map display
- Loading states
- Empty states
- Error states
- Responsive layouts

The frontend must not be responsible for enforcing security-sensitive business rules.

---

# 4. Backend Architecture

FastAPI is the central application server.

Responsibilities:

- Authentication
- Authorization
- User management
- Sports
- Locations
- Activities
- Participants
- Business rules
- Validation
- Database access
- Error handling
- Future notifications

---

# 5. Database Architecture

Use:

```text
PostgreSQL
+
PostGIS
```

PostgreSQL stores the main application data.

PostGIS supports location-based queries such as:

```text
Find activities within 5 km
Find activities within 10 km
Find activities within 15 km
```

---

# 6. Main Data Relationships

```text
User
 |
 +---- User Profile
 |
 +---- User Sports
 |
 +---- Activities (as host)
 |
 +---- Activity Participants
 |
 +---- Preferred Location
```

Activities connect to:

```text
Sport
Location
Host
Participants
```

---

# 7. Main Application Modules

```text
Authentication
Users
Profiles
Sports
Locations
Activities
Participants
Search
Notifications
Moderation
```

Initial MVP:

```text
Authentication
Users
Profiles
Sports
Locations
Activities
Participants
Search
```

---

# 8. Frontend Folder Architecture

```text
frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── activity/
│   │   ├── location/
│   │   ├── profile/
│   │   └── layout/
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Explore.jsx
│   │   ├── ActivityDetails.jsx
│   │   ├── CreateActivity.jsx
│   │   ├── MyActivities.jsx
│   │   ├── Profile.jsx
│   │   └── Settings.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── .env
```

---

# 9. Backend Folder Architecture

```text
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── sports.py
│   │       ├── locations.py
│   │       └── activities.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── security.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── profile.py
│   │   ├── sport.py
│   │   ├── location.py
│   │   ├── activity.py
│   │   └── participant.py
│   │
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── sport.py
│   │   ├── location.py
│   │   └── activity.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── activity_service.py
│   │   └── location_service.py
│   │
│   └── repositories/
│
├── migrations/
├── tests/
├── requirements.txt
└── .env
```

---

# 10. Backend Layering

Use:

```text
API Route
   ↓
Schema Validation
   ↓
Service Layer
   ↓
Repository / ORM
   ↓
PostgreSQL
```

This prevents business logic from becoming mixed with route handlers.

---

# 11. Frontend-to-Backend Flow

Example:

```text
User clicks JOIN
      ↓
React component
      ↓
API service
      ↓
POST /api/v1/activities/{id}/join
      ↓
FastAPI route
      ↓
Authentication
      ↓
Validation
      ↓
Activity service
      ↓
Database
      ↓
Response
      ↓
React updates UI
```

---

# 12. Location Architecture

Location can come from:

```text
Current device location
OR
Preferred manually selected location
```

Flow:

```text
User
 ↓
Allow location?
 ├── Yes → Device coordinates
 └── No  → Manual location search
                ↓
          Selected coordinates
```

The application should continue working when location permission is denied.

---

# 13. Geospatial Architecture

The backend receives:

```text
latitude
longitude
radius
```

Then:

```text
FastAPI
   ↓
PostGIS
   ↓
Nearby activities
   ↓
Filters
   ↓
Sorted results
```

Maximum product radius:

```text
15 km
```

The backend must enforce this limit.

---

# 14. API Architecture

Base path:

```text
/api/v1
```

Main groups:

```text
/api/v1/auth
/api/v1/users
/api/v1/sports
/api/v1/locations
/api/v1/activities
```

---

# 15. Authentication Architecture

```text
Register
   ↓
Password Hashing
   ↓
Database
   ↓
Login
   ↓
Authentication
   ↓
Protected Requests
```

The exact session/token implementation is defined in `08-security.md`.

---

# 16. Activity Architecture

Activity lifecycle:

```text
DRAFT
  ↓
PUBLISHED
  ↓
FULL
  ↓
COMPLETED
```

Alternative path:

```text
PUBLISHED
  ↓
CANCELLED
```

The backend controls status transitions.

---

# 17. Join Architecture

```text
User
 ↓
Join request
 ↓
Authentication
 ↓
Activity exists?
 ↓
Activity joinable?
 ↓
Already joined?
 ↓
Capacity available?
 ↓
Database transaction
 ↓
Participant created
```

The capacity check must be handled safely at the database/transaction level.

---

# 18. External Services

Possible external services:

```text
Map / Geocoding Provider
Email Provider
SMS / Verification Provider
Hosting
Database Hosting
```

These should be accessed through backend services where appropriate.

Do not tightly couple core business logic to a single external provider.

---

# 19. AI Development Architecture

AI tools have different responsibilities.

```text
ChatGPT
   ↓
Planning / Architecture / Documentation

Antigravity
   ↓
Implementation / File Changes

Claude
   ↓
Review / Debugging / Security Review
```

Workflow:

```text
Plan
 ↓
Implement
 ↓
Run
 ↓
Test
 ↓
Review
 ↓
Fix
 ↓
Commit
```

---

# 20. Git Architecture

Repository:

```text
SquadUp
```

Primary branch:

```text
main
```

Optional feature branches:

```text
feature/auth
feature/activities
feature/location
feature/maps
```

Use meaningful commits.

---

# 21. Development Architecture

Local development:

```text
Browser
   |
   +---- React/Vite
   |       localhost:5173
   |
   +---- FastAPI
           localhost:8000
              |
              v
        PostgreSQL
```

---

# 22. Production Architecture

```text
Internet
   |
   v
Frontend Hosting
   |
   v
FastAPI Backend
   |
   +------ PostgreSQL + PostGIS
   |
   +------ External Services
```

HTTPS should be used in production.

---

# 23. Environment Architecture

Frontend environment:

```text
VITE_API_BASE_URL
VITE_MAP_API_KEY
```

Backend environment:

```text
DATABASE_URL
SECRET_KEY
ALLOWED_ORIGINS
```

Secrets must not be committed to Git.

---

# 24. Testing Architecture

Testing layers:

```text
Component Tests
      ↓
API Tests
      ↓
Database Tests
      ↓
End-to-End Tests
      ↓
Manual Responsive Testing
```

Critical MVP flows must be tested before deployment.

---

# 25. MVP Architecture Boundary

The first release should focus on:

```text
Authentication
      ↓
Profile
      ↓
Sports
      ↓
Location
      ↓
Activity Discovery
      ↓
Activity Details
      ↓
Join / Leave
      ↓
My Activities
```

Do not make advanced features a dependency of the MVP.

---

# 26. Future Architecture

Possible future modules:

```text
Real-time chat
Notifications
Ratings
Recommendations
Turf booking
Payments
Subscriptions
Advanced analytics
Admin dashboard
AI assistant
```

These should be added after the core architecture is stable.

---

# 27. Architecture Principle

Keep the system modular:

```text
Frontend
Backend
Database
External Services
```

Each major area should have a clear responsibility.

The goal is not to create the most complicated architecture.

The goal is to create the simplest architecture that reliably supports SquadUp.
