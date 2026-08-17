# SquadUp — API Design

**Document Version:** 1.0  
**Project:** SquadUp  
**API Style:** REST  
**Backend:** FastAPI  
**Database:** PostgreSQL  
**Base URL:** `/api/v1`

---

# 1. API Purpose

The SquadUp API connects the frontend application with the backend services and database.

Core flow:

```text
React Frontend
      ↓
REST API
      ↓
FastAPI Backend
      ↓
Business Logic
      ↓
PostgreSQL
```

The API is responsible for:

- Authentication
- User profiles
- Sports
- Locations
- Activity discovery
- Activity creation
- Activity management
- Joining and leaving activities
- Participant management
- Bookmarks
- Notifications
- Future messaging
- Future ratings
- Reports and blocking

---

# 2. API Base Path

All application APIs should use:

```text
/api/v1
```

Example:

```text
GET /api/v1/activities
```

This allows future versions such as:

```text
/api/v2
```

without immediately breaking existing clients.

---

# 3. General API Rules

The API should:

- Use HTTPS in production
- Return JSON
- Validate all input on the backend
- Use authentication for protected endpoints
- Use authorization for user-specific actions
- Return appropriate HTTP status codes
- Never expose passwords or password hashes
- Never trust frontend business rules
- Use pagination for potentially large lists
- Return predictable response structures

---

# 4. API Response Convention

A consistent response format is recommended.

Successful response example:

```json
{
  "success": true,
  "data": {
    "id": "activity-uuid",
    "title": "Evening Football"
  }
}
```

Error response:

```json
{
  "success": false,
  "error": {
    "code": "ACTIVITY_FULL",
    "message": "This activity is already full."
  }
}
```

For list endpoints:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

The exact response envelope can be simplified if the FastAPI implementation benefits from standard HTTP responses, but the frontend and backend must use one consistent convention.

---

# 5. HTTP Methods

Use:

```text
GET
POST
PATCH
DELETE
```

General meaning:

```text
GET     → retrieve data
POST    → create/action
PATCH   → partially update
DELETE  → delete/remove
```

---

# 6. HTTP Status Codes

Use appropriate status codes:

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
429 Too Many Requests
500 Internal Server Error
```

---

# 7. Authentication API

Base path:

```text
/api/v1/auth
```

Endpoints:

```text
POST /register
POST /login
POST /logout
POST /forgot-password
POST /reset-password
GET  /verify-email
GET  /verify-phone
```

---

# 8. Register

Endpoint:

```text
POST /api/v1/auth/register
```

Request:

```json
{
  "full_name": "User Name",
  "email": "user@example.com",
  "phone": "+91XXXXXXXXXX",
  "password": "secure-password"
}
```

Backend should:

1. Validate input
2. Check duplicate email
3. Check duplicate phone
4. Hash password
5. Create user
6. Create profile
7. Return appropriate response

Success:

```text
201 Created
```

---

# 9. Registration Validation

Validate:

- Name is not empty
- Email format
- Phone format
- Password requirements
- Duplicate email
- Duplicate phone

Passwords must never be stored as plain text.

---

# 10. Login

Endpoint:

```text
POST /api/v1/auth/login
```

Request:

```json
{
  "email": "user@example.com",
  "password": "secure-password"
}
```

Response should provide the authentication mechanism selected by the backend.

Conceptual response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com"
    }
  }
}
```

The exact token/session structure should be implemented securely rather than hard-coded into the frontend specification.

---

# 11. Logout

Endpoint:

```text
POST /api/v1/auth/logout
```

Authentication:

```text
Required
```

The backend should invalidate the appropriate session/token mechanism if applicable.

---

# 12. Current User

Endpoint:

```text
GET /api/v1/users/me
```

Authentication:

```text
Required
```

Returns the currently authenticated user's information.

Example:

```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "full_name": "User Name",
    "status": "ACTIVE"
  }
}
```

---

# 13. Update Profile

Endpoint:

```text
PATCH /api/v1/users/me
```

Authentication:

```text
Required
```

Request example:

```json
{
  "full_name": "Updated Name",
  "bio": "Football and badminton player"
}
```

The backend must only update fields that are allowed.

---

# 14. Public User Profile

Endpoint:

```text
GET /api/v1/users/{user_id}
```

Authentication:

```text
Required
```

Only information intended for other users should be returned.

Never expose:

```text
password_hash
private authentication data
sensitive internal fields
```

---

# 15. Sports API

Base path:

```text
/api/v1/sports
```

---

# 16. Get Sports

Endpoint:

```text
GET /api/v1/sports
```

Purpose:

Return the list of active sports available on SquadUp.

Example response:

```json
{
  "success": true,
  "data": [
    {
      "id": "sport-uuid",
      "name": "Football",
      "slug": "football"
    },
    {
      "id": "sport-uuid",
      "name": "Cricket",
      "slug": "cricket"
    }
  ]
}
```

---

# 17. Get Single Sport

Endpoint:

```text
GET /api/v1/sports/{sport_id}
```

Returns:

- Sport ID
- Name
- Slug
- Active status

---

# 18. User Sports

Endpoint:

```text
GET /api/v1/users/me/sports
```

Authentication:

```text
Required
```

Returns the sports selected by the user.

---

# 19. Add User Sport

Endpoint:

```text
POST /api/v1/users/me/sports
```

Request:

```json
{
  "sport_id": "sport-uuid",
  "skill_level": "INTERMEDIATE"
}
```

---

# 20. Update User Sport

Endpoint:

```text
PATCH /api/v1/users/me/sports/{sport_id}
```

Request:

```json
{
  "skill_level": "ADVANCED"
}
```

---

# 21. Remove User Sport

Endpoint:

```text
DELETE /api/v1/users/me/sports/{sport_id}
```

Authentication:

```text
Required
```

---

# 22. Allowed Skill Levels

Initial values:

```text
BEGINNER
INTERMEDIATE
ADVANCED
```

The backend must reject invalid skill levels.

---

# 23. Location API

Base path:

```text
/api/v1/locations
```

Location features are important because SquadUp is a location-based sports discovery application.

---

# 24. Search Locations

Endpoint:

```text
GET /api/v1/locations/search
```

Query:

```text
?q=Ottapalam
```

Purpose:

Allow users to search for a preferred area.

---

# 25. Save Preferred Location

Endpoint:

```text
PATCH /api/v1/users/me/location
```

Request:

```json
{
  "label": "My Area",
  "city": "Ottapalam",
  "state": "Kerala",
  "country": "India",
  "latitude": 10.77,
  "longitude": 76.38
}
```

The backend should validate location values.

---

# 26. Current Location

The browser/mobile device can provide the user's current location.

Typical flow:

```text
Frontend
   ↓
Browser Geolocation API
   ↓
Latitude + Longitude
   ↓
Backend activity search
```

The backend should not require the user to permanently save their exact current location.

---

# 27. Search Radius

SquadUp supports an adjustable discovery radius up to:

```text
15 km
```

Recommended values:

```text
0.5 km
1 km
2 km
5 km
10 km
15 km
```

The backend must enforce:

```text
0 < radius <= 15
```

or an equivalent product rule.

---

# 28. Nearby Activities

Endpoint:

```text
GET /api/v1/activities/nearby
```

Required query parameters:

```text
latitude
longitude
radius
```

Example:

```text
GET /api/v1/activities/nearby?latitude=10.77&longitude=76.38&radius=5
```

Optional filters:

```text
sport_id
date
skill_level
min_price
max_price
start_time
available_only
```

---

# 29. Location Search Logic

Conceptually:

```text
User Coordinates
       ↓
Selected Radius
       ↓
PostGIS / Geospatial Query
       ↓
Activities within radius
       ↓
Apply Filters
       ↓
Sort Results
       ↓
Return Activities
```

---

# 30. Activities API

Base path:

```text
/api/v1/activities
```

---

# 31. List Activities

Endpoint:

```text
GET /api/v1/activities
```

Possible query parameters:

```text
sport_id
latitude
longitude
radius
date
start_time
skill_level
min_price
max_price
available_only
sort
page
limit
```

Example:

```text
GET /api/v1/activities?sport_id=football&radius=5&page=1&limit=20
```

---

# 32. Activity Sorting

Initial options:

```text
distance
date
start_time
created_at
price
```

Default sorting should prioritize useful upcoming nearby activities.

The exact ranking can be refined after usability testing.

---

# 33. Activity Pagination

Recommended defaults:

```text
page = 1
limit = 20
```

Maximum:

```text
limit = 100
```

The backend must enforce a reasonable maximum.

---

# 34. Get Activity

Endpoint:

```text
GET /api/v1/activities/{activity_id}
```

Returns:

- Activity details
- Host information
- Sport
- Location
- Date
- Time
- Duration
- Price
- Skill level
- Participant count
- Maximum participants
- Availability
- Status

---

# 35. Create Activity

Endpoint:

```text
POST /api/v1/activities
```

Authentication:

```text
Required
```

Request:

```json
{
  "sport_id": "sport-uuid",
  "location_id": "location-uuid",
  "title": "Evening Football",
  "description": "Friendly football game",
  "activity_date": "2026-08-20",
  "start_time": "18:30",
  "duration_minutes": 90,
  "max_participants": 10,
  "price": 150,
  "skill_level": "INTERMEDIATE"
}
```

---

# 36. Create Activity Validation

Backend validates:

- Sport exists
- Location exists
- Title
- Date
- Time
- Duration
- Maximum participants
- Price
- Skill level
- Host authentication

The backend should reject invalid or past activity times according to the product rules.

---

# 37. Activity Ownership

The authenticated user becomes:

```text
host_id
```

The frontend must not be allowed to arbitrarily choose another user as the host.

The backend takes the host identity from authentication.

---

# 38. Update Activity

Endpoint:

```text
PATCH /api/v1/activities/{activity_id}
```

Authentication:

```text
Required
```

Authorization:

```text
Host only
```

Example:

```json
{
  "title": "Updated Football Match",
  "max_participants": 12
}
```

---

# 39. Delete Activity

Endpoint:

```text
DELETE /api/v1/activities/{activity_id}
```

Authentication:

```text
Required
```

Authorization:

```text
Host only
```

For activities with participants, cancellation is generally preferable to destructive deletion.

---

# 40. Cancel Activity

Endpoint:

```text
POST /api/v1/activities/{activity_id}/cancel
```

Authentication:

```text
Required
```

Authorization:

```text
Host only
```

Expected behavior:

```text
Activity status
      ↓
CANCELLED
      ↓
Participants notified
```

---

# 41. Publish Activity

If the application supports drafts:

```text
POST /api/v1/activities/{activity_id}/publish
```

Authorization:

```text
Host only
```

An activity should only become discoverable when its status is:

```text
PUBLISHED
```

---

# 42. Join Activity

Endpoint:

```text
POST /api/v1/activities/{activity_id}/join
```

Authentication:

```text
Required
```

Backend flow:

```text
Authenticate
     ↓
Find activity
     ↓
Check activity status
     ↓
Check activity time
     ↓
Check participant capacity
     ↓
Check duplicate participation
     ↓
Create participant
     ↓
Commit transaction
     ↓
Return updated activity
```

---

# 43. Join Activity Success

Example:

```json
{
  "success": true,
  "data": {
    "activity_id": "activity-uuid",
    "status": "JOINED",
    "participants_count": 8,
    "max_participants": 10
  }
}
```

---

# 44. Join Activity Errors

Possible errors:

```text
ACTIVITY_NOT_FOUND
ACTIVITY_CANCELLED
ACTIVITY_STARTED
ACTIVITY_FULL
ALREADY_JOINED
USER_NOT_ALLOWED
```

Example:

```text
409 Conflict
```

for:

```text
ACTIVITY_FULL
ALREADY_JOINED
```

---

# 45. Leave Activity

Endpoint:

```text
POST /api/v1/activities/{activity_id}/leave
```

Authentication:

```text
Required
```

The backend should verify that the user is currently participating.

---

# 46. Leave Activity Response

Example:

```json
{
  "success": true,
  "data": {
    "activity_id": "activity-uuid",
    "status": "LEFT"
  }
}
```

---

# 47. Participant List

Endpoint:

```text
GET /api/v1/activities/{activity_id}/participants
```

Authentication:

```text
Required
```

The response can include public participant information.

Example:

```json
{
  "success": true,
  "data": [
    {
      "user_id": "user-uuid",
      "full_name": "User Name",
      "profile_image_url": null,
      "status": "JOINED"
    }
  ]
}
```

---

# 48. My Activities

Endpoint:

```text
GET /api/v1/users/me/activities
```

Query options:

```text
status
role
page
limit
```

Possible role filters:

```text
hosted
joined
```

---

# 49. Hosted Activities

Example:

```text
GET /api/v1/users/me/activities?role=hosted
```

Returns activities created by the authenticated user.

---

# 50. Joined Activities

Example:

```text
GET /api/v1/users/me/activities?role=joined
```

Returns activities in which the authenticated user participates.

---

# 51. Bookmarks API

Phase 2.

Base path:

```text
/api/v1/bookmarks
```

Endpoints:

```text
GET /api/v1/bookmarks
POST /api/v1/activities/{activity_id}/bookmark
DELETE /api/v1/activities/{activity_id}/bookmark
```

---

# 52. Notifications API

Phase 2.

Endpoints:

```text
GET /api/v1/notifications
PATCH /api/v1/notifications/{notification_id}/read
POST /api/v1/notifications/read-all
```

---

# 53. Activity Chat API

Phase 2.

Endpoints:

```text
GET /api/v1/activities/{activity_id}/messages
POST /api/v1/activities/{activity_id}/messages
```

Only authorized activity users should be able to access activity chat.

---

# 54. Ratings API

Phase 2.

Endpoints:

```text
POST /api/v1/activities/{activity_id}/ratings
GET /api/v1/users/{user_id}/ratings
```

Rating validation:

```text
1 <= rating <= 5
```

Eligibility must be checked by the backend.

---

# 55. Reports API

Phase 2.

Endpoint:

```text
POST /api/v1/reports
```

Request example:

```json
{
  "reported_user_id": "user-uuid",
  "activity_id": "activity-uuid",
  "reason": "INAPPROPRIATE_BEHAVIOR",
  "description": "Report details"
}
```

---

# 56. Blocks API

Phase 2.

Endpoints:

```text
POST /api/v1/users/{user_id}/block
DELETE /api/v1/users/{user_id}/block
GET /api/v1/users/me/blocks
```

---

# 57. Authentication Requirement Matrix

| Endpoint Group | Authentication |
|---|---|
| Register | No |
| Login | No |
| Public sports list | No/Optional |
| Current user | Yes |
| Profile update | Yes |
| Activity discovery | Optional/Recommended |
| Activity details | Optional/Recommended |
| Create activity | Yes |
| Edit activity | Yes + Host |
| Cancel activity | Yes + Host |
| Join activity | Yes |
| Leave activity | Yes |
| Participants | Yes |
| Bookmarks | Yes |
| Notifications | Yes |
| Messages | Yes |
| Ratings | Yes |
| Reports | Yes |
| Admin endpoints | Yes + Admin |

---

# 58. Authorization Rules

## User

Can:

```text
View activities
Create activities
Edit own activities
Cancel own activities
Join activities
Leave joined activities
Edit own profile
Manage own sports
```

Cannot:

```text
Edit another user's activity
Cancel another user's activity
Modify another user's profile
Access private backend data
```

---

# 59. Host Rules

The activity host can:

```text
Create activity
Edit activity
Cancel activity
View participant information
Manage activity-specific functionality
```

The exact host permissions should be reviewed before implementing advanced moderation features.

---

# 60. Admin Rules

Admin endpoints should be separated and protected.

Potential future endpoints:

```text
/api/v1/admin/users
/api/v1/admin/activities
/api/v1/admin/reports
```

Do not expose admin functions to normal users.

---

# 61. Error Code Convention

Use readable machine-friendly codes.

Examples:

```text
INVALID_INPUT
UNAUTHORIZED
FORBIDDEN
USER_NOT_FOUND
SPORT_NOT_FOUND
LOCATION_NOT_FOUND
ACTIVITY_NOT_FOUND
ACTIVITY_FULL
ACTIVITY_CANCELLED
ACTIVITY_STARTED
ALREADY_JOINED
NOT_A_PARTICIPANT
NOT_ACTIVITY_HOST
DUPLICATE_EMAIL
DUPLICATE_PHONE
```

---

# 62. Validation Error Example

Request:

```json
{
  "max_participants": -5
}
```

Response:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Maximum participants must be greater than zero."
  }
}
```

---

# 63. Unauthorized Example

If a user is not logged in:

```text
401 Unauthorized
```

Response:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication is required."
  }
}
```

---

# 64. Forbidden Example

If a user tries to edit someone else's activity:

```text
403 Forbidden
```

Response:

```json
{
  "success": false,
  "error": {
    "code": "NOT_ACTIVITY_HOST",
    "message": "You are not allowed to modify this activity."
  }
}
```

---

# 65. Not Found Example

If an activity does not exist:

```text
404 Not Found
```

Response:

```json
{
  "success": false,
  "error": {
    "code": "ACTIVITY_NOT_FOUND",
    "message": "Activity not found."
  }
}
```

---

# 66. Conflict Example

If the activity is full:

```text
409 Conflict
```

Response:

```json
{
  "success": false,
  "error": {
    "code": "ACTIVITY_FULL",
    "message": "This activity is already full."
  }
}
```

---

# 67. Rate Limiting

Rate limiting should be considered for:

```text
Login
Register
Password reset
Location search
Activity creation
Reports
Messages
```

The exact limits can be defined during deployment.

---

# 68. API Security Rules

Never:

```text
Trust user_id from frontend for ownership
Trust participant count from frontend
Trust activity host ID from frontend
Store plain passwords
Expose database credentials
Expose secret API keys in public code
Return password hashes
```

Instead:

```text
Use authenticated identity
Calculate participant count from database
Validate ownership on backend
Hash passwords
Use environment variables
Restrict secrets
Return only safe data
```

---

# 69. Activity Capacity Protection

This is a critical API rule.

The join endpoint must be safe when multiple users attempt to join simultaneously.

Conceptually:

```text
BEGIN TRANSACTION
       ↓
Lock/check activity capacity
       ↓
Check participant
       ↓
Insert participant
       ↓
COMMIT
```

The exact implementation should use PostgreSQL transaction/locking techniques appropriate to the ORM.

---

# 70. Nearby Search API Example

Request:

```text
GET /api/v1/activities/nearby
    ?latitude=10.77
    &longitude=76.38
    &radius=5
    &sport_id=football
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "activity-uuid",
      "title": "Evening Football",
      "distance_km": 2.4,
      "available_slots": 3
    }
  ]
}
```

---

# 71. Discovery API Flow

```text
User opens Explore
        ↓
Frontend gets current/preferred location
        ↓
Frontend sends coordinates + radius
        ↓
GET /activities/nearby
        ↓
Backend validates radius
        ↓
PostGIS searches nearby activities
        ↓
Filters applied
        ↓
Results sorted
        ↓
JSON response
        ↓
Activity cards displayed
```

---

# 72. Create Activity API Flow

```text
User fills Create Activity
        ↓
Frontend validates basic fields
        ↓
POST /activities
        ↓
Backend authentication
        ↓
Backend validation
        ↓
Database transaction
        ↓
Activity created
        ↓
201 Created
        ↓
Frontend opens activity details
```

---

# 73. Join API Flow

```text
User taps Join
        ↓
POST /activities/{id}/join
        ↓
Authentication
        ↓
Authorization
        ↓
Activity validation
        ↓
Capacity check
        ↓
Duplicate check
        ↓
Transaction
        ↓
Participant created
        ↓
Updated activity returned
```

---

# 74. API-to-Database Mapping

```text
POST /auth/register
        ↓
users
user_profiles

POST /users/me/sports
        ↓
user_sports

POST /activities
        ↓
activities

POST /activities/{id}/join
        ↓
activity_participants

GET /activities/nearby
        ↓
activities
locations
sports
activity_participants
```

---

# 75. API Documentation

FastAPI should expose development documentation through:

```text
/docs
```

and:

```text
/redoc
```

Use these to inspect:

- Routes
- Parameters
- Schemas
- Responses
- Authentication requirements

---

# 76. OpenAPI

FastAPI automatically generates an OpenAPI specification.

This can later be used to:

- Generate API clients
- Share API contracts
- Review endpoints
- Test APIs
- Help AI coding tools understand the backend

---

# 77. API Development Order

Build APIs in this order:

```text
1. Authentication
2. Current user
3. Profile
4. Sports
5. User sports
6. Locations
7. Create activity
8. Activity details
9. Activity discovery
10. Join
11. Leave
12. My activities
```

Then:

```text
13. Bookmarks
14. Notifications
15. Messages
16. Ratings
17. Reports
18. Blocks
```

---

# 78. MVP API Minimum

The MVP only needs these core API groups:

```text
/auth
/users
/sports
/locations
/activities
```

Core activity actions:

```text
Create
View
Discover
Join
Leave
Edit
Cancel
```

---

# 79. Frontend API Integration

Create one API service layer:

```text
frontend/src/services/api.js
```

Example conceptual usage:

```javascript
api.get("/activities");
api.get("/activities/nearby");
api.post("/activities");
api.post(`/activities/${id}/join`);
api.post(`/activities/${id}/leave`);
```

Components should call the service layer instead of duplicating request configuration.

---

# 80. API Contract Rule

Before implementing a frontend feature:

```text
Define API
    ↓
Define request schema
    ↓
Define response schema
    ↓
Implement backend
    ↓
Test API
    ↓
Connect frontend
```

Do not build frontend and backend with different assumptions.

---

# 81. AI Development Rule

When using Antigravity or Claude for API implementation, provide:

```text
Read:
docs/01-product-requirements.md
docs/02-user-flows.md
docs/03-features.md
docs/04-database-design.md
docs/05-api-design.md
```

Then specify exactly which endpoint(s) should be implemented.

Example instruction:

```text
Implement POST /api/v1/activities/{activity_id}/join.

Follow docs/05-api-design.md and docs/04-database-design.md.

Requirements:
- Require authentication
- Verify activity exists
- Verify activity is joinable
- Prevent duplicate participation
- Prevent overbooking
- Use a database transaction
- Return consistent JSON
- Add tests
- Do not modify unrelated features
```

---

# 82. API Testing

Every endpoint should be tested before frontend integration.

Recommended tools:

```text
FastAPI /docs
Postman
Insomnia
curl
Automated API tests
```

For the MVP, FastAPI's interactive documentation plus automated backend tests may be sufficient.

---

# 83. API Testing Sequence

For activities:

```text
Create
 ↓
Get
 ↓
List
 ↓
Nearby search
 ↓
Join
 ↓
Participants
 ↓
Leave
 ↓
Edit
 ↓
Cancel
```

---

# 84. API Edge Cases

Test:

```text
Invalid activity ID
Invalid sport ID
Invalid location
Past activity
Cancelled activity
Full activity
Duplicate join
Leaving without joining
Non-host editing
Non-host cancelling
Radius above 15 km
Negative radius
Invalid coordinates
Invalid skill level
Invalid price
Invalid participant count
Unauthenticated requests
Suspended users
```

---

# 85. API Performance

The first version should prioritize correctness.

Later optimize:

```text
Database indexes
Pagination
Geospatial queries
Caching
Connection pooling
Query optimization
```

Do not prematurely add complex caching.

---

# 86. API Logging

Backend should log important events and errors without exposing sensitive information.

Examples:

```text
Authentication failure
Activity creation
Activity cancellation
Join conflict
Unexpected server error
```

Never log:

```text
Passwords
Authentication secrets
Sensitive personal information
```

---

# 87. API Monitoring

Before production, consider monitoring:

```text
Error rate
Response time
Database errors
Authentication failures
API availability
```

The exact monitoring provider can be selected later.

---

# 88. Versioning Strategy

Initial:

```text
/api/v1
```

If a breaking change is required:

```text
/api/v2
```

Do not introduce breaking changes to `/v1` without a migration strategy.

---

# 89. Final MVP Endpoint List

```text
AUTH
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password

USERS
GET    /api/v1/users/me
PATCH  /api/v1/users/me
GET    /api/v1/users/{user_id}

USER SPORTS
GET    /api/v1/users/me/sports
POST   /api/v1/users/me/sports
PATCH  /api/v1/users/me/sports/{sport_id}
DELETE /api/v1/users/me/sports/{sport_id}

SPORTS
GET    /api/v1/sports
GET    /api/v1/sports/{sport_id}

LOCATIONS
GET    /api/v1/locations/search
PATCH  /api/v1/users/me/location

ACTIVITIES
GET    /api/v1/activities
GET    /api/v1/activities/nearby
POST   /api/v1/activities
GET    /api/v1/activities/{activity_id}
PATCH  /api/v1/activities/{activity_id}
DELETE /api/v1/activities/{activity_id}
POST   /api/v1/activities/{activity_id}/publish
POST   /api/v1/activities/{activity_id}/cancel
POST   /api/v1/activities/{activity_id}/join
POST   /api/v1/activities/{activity_id}/leave
GET    /api/v1/activities/{activity_id}/participants

MY ACTIVITIES
GET    /api/v1/users/me/activities
```

---

# 90. Phase 2 Endpoint List

```text
BOOKMARKS
GET    /api/v1/bookmarks
POST   /api/v1/activities/{activity_id}/bookmark
DELETE /api/v1/activities/{activity_id}/bookmark

NOTIFICATIONS
GET    /api/v1/notifications
PATCH  /api/v1/notifications/{notification_id}/read
POST   /api/v1/notifications/read-all

MESSAGES
GET    /api/v1/activities/{activity_id}/messages
POST   /api/v1/activities/{activity_id}/messages

RATINGS
POST   /api/v1/activities/{activity_id}/ratings
GET    /api/v1/users/{user_id}/ratings

REPORTS
POST   /api/v1/reports

BLOCKS
POST   /api/v1/users/{user_id}/block
DELETE /api/v1/users/{user_id}/block
GET    /api/v1/users/me/blocks
```

---

# 91. Final API Architecture

```text
                       REACT
                         |
                         |
                    REST / JSON
                         |
                         v
                  ┌─────────────┐
                  │   FASTAPI   │
                  └──────┬──────┘
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
       AUTH          ACTIVITIES      LOCATION
          |              |              |
          +--------------+--------------+
                         |
                         v
                    POSTGRESQL
                         |
                       POSTGIS
```

---

# 92. Core API Principle

The API must make the central SquadUp experience reliable:

```text
User
 ↓
Location
 ↓
Nearby Activities
 ↓
Activity Details
 ↓
Join
 ↓
Participant
```

If these APIs work correctly, the frontend can provide the core SquadUp experience.

---

# 93. Final Rule

Every API should have:

```text
Clear endpoint
Clear request
Clear response
Clear validation
Clear authorization
Clear error codes
Clear database relationship
Clear tests
```

Build the MVP APIs first. Add advanced APIs only after the core activity-discovery-and-joining flow is stable.
