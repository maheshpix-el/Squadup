# SquadUp — Database Design

**Document Version:** 1.0  
**Project:** SquadUp  
**Database Direction:** PostgreSQL  
**Purpose:** Define the database structure, relationships, constraints, and data model required for the SquadUp MVP and future expansion.

---

# 1. Database Goal

The SquadUp database must support the core product loop:

```text
User
 ↓
Profile
 ↓
Sports + Skill
 ↓
Location
 ↓
Discover Activities
 ↓
Join Activity
 ↓
Participant
 ↓
Play
 ↓
History / Rating
```

The database should be:

- Reliable
- Secure
- Scalable
- Easy to query
- Easy for the backend to maintain
- Suitable for location-based discovery
- Suitable for future chat, ratings, payments, and AI features

---

# 2. Recommended Database

Use:

**PostgreSQL**

Why:

- Strong relational structure
- Reliable transactions
- Excellent support for relationships
- Good indexing
- Good support for geospatial functionality through PostGIS
- Suitable for users, activities, participants, messages, notifications, and ratings

---

# 3. Recommended PostgreSQL Extensions

For the MVP:

```text
uuid-ossp
```

or preferably application-generated UUIDs.

For location-based search:

```text
PostGIS
```

PostGIS is recommended if the selected hosting provider supports it.

The exact provider can be decided later.

---

# 4. Database Naming Rules

Use:

- lowercase table names
- snake_case column names
- singular or plural naming consistently
- UUID primary keys
- foreign keys
- timestamps
- explicit status fields

Recommended style:

```text
users
user_profiles
sports
user_sports
activities
activity_participants
```

---

# 5. Core Tables

The MVP database contains these primary tables:

```text
users
user_profiles
sports
user_sports
locations
activities
activity_participants
```

Additional Phase 2 tables:

```text
bookmarks
notifications
messages
ratings
reports
blocks
```

Future tables may include:

```text
venues
bookings
payments
subscriptions
ai_recommendations
```

---

# 6. Entity Relationship Overview

```text
USERS
  |
  +------ USER_PROFILES
  |
  +------ USER_SPORTS ------ SPORTS
  |
  +------ ACTIVITIES
  |          |
  |          +------ LOCATIONS
  |          |
  |          +------ ACTIVITY_PARTICIPANTS ------ USERS
  |
  +------ BOOKMARKS ------ ACTIVITIES
  |
  +------ NOTIFICATIONS
  |
  +------ MESSAGES
  |
  +------ RATINGS
  |
  +------ REPORTS
  |
  +------ BLOCKS
```

---

# 7. USERS TABLE

The `users` table stores authentication and account-level information.

## Table

```text
users
```

## Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| email | VARCHAR | Yes | Unique email |
| phone | VARCHAR | Yes | Unique phone |
| password_hash | TEXT | Yes | Hashed password |
| is_email_verified | BOOLEAN | Yes | Email verification state |
| is_phone_verified | BOOLEAN | Yes | Phone verification state |
| status | VARCHAR | Yes | Account status |
| created_at | TIMESTAMP | Yes | Creation time |
| updated_at | TIMESTAMP | Yes | Last update |

---

# 8. USER STATUS

Possible values:

```text
ACTIVE
SUSPENDED
DELETED
```

Do not physically delete important records unless there is a clear data-retention requirement.

For normal account removal, a soft-delete approach can be considered.

---

# 9. USERS CONSTRAINTS

Required:

```text
PRIMARY KEY(id)

UNIQUE(email)

UNIQUE(phone)
```

Passwords must never be stored as plain text.

Only password hashes should be stored.

---

# 10. USER_PROFILES TABLE

Stores user-facing profile information.

## Table

```text
user_profiles
```

## Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| user_id | UUID | Yes | FK to users |
| full_name | VARCHAR | Yes | Display name |
| profile_image_url | TEXT | No | Profile image |
| bio | TEXT | No | Short biography |
| age | INTEGER | No | Age if required |
| preferred_location_id | UUID | No | Preferred discovery location |
| created_at | TIMESTAMP | Yes | Creation time |
| updated_at | TIMESTAMP | Yes | Last update |

---

# 11. USER PROFILE RELATIONSHIP

```text
users
  1
  |
  1
user_profiles
```

A user should normally have one profile.

Constraint:

```text
UNIQUE(user_id)
```

---

# 12. SPORTS TABLE

Stores supported sports.

## Table

```text
sports
```

## Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| name | VARCHAR | Yes | Sport name |
| slug | VARCHAR | Yes | URL/API-friendly name |
| is_active | BOOLEAN | Yes | Whether sport is available |
| created_at | TIMESTAMP | Yes | Creation time |

---

# 13. SPORTS EXAMPLES

Initial records can include:

```text
Football
Cricket
Badminton
Basketball
Volleyball
Running
Cycling
Gym
Trekking
```

The exact initial list can be changed without changing the database architecture.

---

# 14. USER_SPORTS TABLE

Users can play multiple sports.

Therefore:

```text
users
  many
   |
   |
user_sports
   |
   |
sports
  many
```

This is a many-to-many relationship.

## Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| user_id | UUID | Yes | FK to users |
| sport_id | UUID | Yes | FK to sports |
| skill_level | VARCHAR | Yes | Skill level |
| created_at | TIMESTAMP | Yes | Creation time |

---

# 15. SKILL LEVEL

Initial values:

```text
BEGINNER
INTERMEDIATE
ADVANCED
```

A database check constraint or application validation should restrict invalid values.

---

# 16. USER_SPORTS CONSTRAINT

A user should not have the same sport preference twice.

```text
UNIQUE(user_id, sport_id)
```

---

# 17. LOCATIONS TABLE

Stores reusable location information.

## Table

```text
locations
```

## Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| label | VARCHAR | No | User-friendly name |
| address | TEXT | No | Address |
| city | VARCHAR | No | City |
| state | VARCHAR | No | State |
| country | VARCHAR | Yes | Country |
| latitude | DECIMAL | Yes | Latitude |
| longitude | DECIMAL | Yes | Longitude |
| created_at | TIMESTAMP | Yes | Creation time |

---

# 18. LOCATION PRIVACY

Do not use this table to expose a user's exact private home location.

A preferred location should normally represent an area used for discovery.

Activity locations can represent actual public activity venues.

---

# 19. ACTIVITIES TABLE

This is one of the most important tables in SquadUp.

## Table

```text
activities
```

## Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| host_id | UUID | Yes | FK to users |
| sport_id | UUID | Yes | FK to sports |
| location_id | UUID | Yes | FK to locations |
| title | VARCHAR | Yes | Activity title |
| description | TEXT | No | Activity description |
| rules | TEXT | No | Activity rules |
| activity_date | DATE | Yes | Activity date |
| start_time | TIME | Yes | Start time |
| duration_minutes | INTEGER | Yes | Duration |
| max_participants | INTEGER | Yes | Maximum participants |
| price | DECIMAL | Yes | Price per participant |
| skill_level | VARCHAR | No | Required skill |
| status | VARCHAR | Yes | Activity status |
| created_at | TIMESTAMP | Yes | Creation time |
| updated_at | TIMESTAMP | Yes | Last update |

---

# 20. ACTIVITY HOST RELATIONSHIP

Each activity has one host.

```text
users
  1
  |
  +----< activities
```

One user can host many activities.

---

# 21. ACTIVITY SPORT RELATIONSHIP

Each activity belongs to one sport.

```text
sports
  1
  |
  +----< activities
```

Example:

```text
Football
   |
   +--- Activity 1
   +--- Activity 2
   +--- Activity 3
```

---

# 22. ACTIVITY LOCATION RELATIONSHIP

Each activity has a location.

```text
locations
   1
   |
   +----< activities
```

---

# 23. ACTIVITY STATUS

Initial statuses:

```text
DRAFT
PUBLISHED
FULL
STARTED
COMPLETED
CANCELLED
```

The backend should control status transitions.

---

# 24. ACTIVITY PARTICIPANTS TABLE

This table represents users joining activities.

## Table

```text
activity_participants
```

## Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| activity_id | UUID | Yes | FK to activities |
| user_id | UUID | Yes | FK to users |
| status | VARCHAR | Yes | Participation status |
| joined_at | TIMESTAMP | Yes | Join time |
| left_at | TIMESTAMP | No | Leave time |
| attendance_status | VARCHAR | No | Attendance state |

---

# 25. PARTICIPATION STATUS

Initial values:

```text
JOINED
LEFT
CANCELLED
```

A simpler implementation can remove unnecessary states until they are required.

---

# 26. ATTENDANCE STATUS

Future/Phase 2:

```text
UNKNOWN
ATTENDED
MISSED
```

---

# 27. ACTIVITY PARTICIPANT CONSTRAINT

A user should not join the same activity more than once.

Recommended:

```text
UNIQUE(activity_id, user_id)
```

If historical rejoining is required later, this can be replaced with a more advanced participation model.

---

# 28. ACTIVITY CAPACITY

The database must support:

```text
current participants
maximum participants
```

The backend should calculate current active participants rather than trusting a frontend-provided number.

Example:

```text
Maximum = 10

Joined = 7

Available = 3
```

---

# 29. OVERBOOKING PROTECTION

Joining must be handled transactionally.

The backend must prevent:

```text
9 / 10

User A joins
User B joins
```

from incorrectly becoming:

```text
11 / 10
```

Concurrency protection must be implemented at the backend/database layer.

---

# 30. BOOKMARKS TABLE

Phase 2.

## Table

```text
bookmarks
```

## Fields

| Field | Type | Required |
|---|---|---:|
| id | UUID | Yes |
| user_id | UUID | Yes |
| activity_id | UUID | Yes |
| created_at | TIMESTAMP | Yes |

Constraint:

```text
UNIQUE(user_id, activity_id)
```

---

# 31. NOTIFICATIONS TABLE

Phase 2.

## Table

```text
notifications
```

## Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| user_id | UUID | Yes | Recipient |
| type | VARCHAR | Yes | Notification type |
| title | VARCHAR | Yes | Notification title |
| message | TEXT | Yes | Notification text |
| activity_id | UUID | No | Related activity |
| is_read | BOOLEAN | Yes | Read state |
| created_at | TIMESTAMP | Yes | Creation time |

---

# 32. NOTIFICATION TYPES

Examples:

```text
ACTIVITY_JOINED
ACTIVITY_LEFT
ACTIVITY_CANCELLED
ACTIVITY_REMINDER
NEW_MESSAGE
RATING_AVAILABLE
```

---

# 33. MESSAGES TABLE

Phase 2.

## Table

```text
messages
```

## Fields

| Field | Type | Required |
|---|---|---:|
| id | UUID | Yes |
| activity_id | UUID | Yes |
| sender_id | UUID | Yes |
| message_text | TEXT | Yes |
| created_at | TIMESTAMP | Yes |
| updated_at | TIMESTAMP | No |

Messages belong to an activity chat.

---

# 34. CHAT AUTHORIZATION

A user should only be allowed to read or send messages for an activity when authorized.

Possible authorization:

```text
Host
OR
Joined Participant
```

The backend must enforce this.

---

# 35. RATINGS TABLE

Phase 2.

## Table

```text
ratings
```

## Fields

| Field | Type | Required |
|---|---|---:|
| id | UUID | Yes |
| activity_id | UUID | Yes |
| reviewer_id | UUID | Yes |
| reviewed_user_id | UUID | Yes |
| rating | INTEGER | Yes |
| comment | TEXT | No |
| created_at | TIMESTAMP | Yes |

---

# 36. RATING VALIDATION

Rating must be within:

```text
1 to 5
```

The reviewer must have been an eligible participant in the activity.

The exact rating rules should be finalized before implementation.

---

# 37. REPORTS TABLE

Phase 2.

## Table

```text
reports
```

## Fields

| Field | Type | Required |
|---|---|---:|
| id | UUID | Yes |
| reporter_id | UUID | Yes |
| reported_user_id | UUID | No |
| activity_id | UUID | No |
| reason | VARCHAR | Yes |
| description | TEXT | No |
| status | VARCHAR | Yes |
| created_at | TIMESTAMP | Yes |
| reviewed_at | TIMESTAMP | No |

---

# 38. REPORT STATUS

Possible values:

```text
OPEN
UNDER_REVIEW
RESOLVED
DISMISSED
```

---

# 39. BLOCKS TABLE

Phase 2.

## Table

```text
blocks
```

## Fields

| Field | Type | Required |
|---|---|---:|
| id | UUID | Yes |
| blocker_id | UUID | Yes |
| blocked_user_id | UUID | Yes |
| created_at | TIMESTAMP | Yes |

Constraint:

```text
UNIQUE(blocker_id, blocked_user_id)
```

A user should not be able to block themselves.

---

# 40. ADMIN USERS

The application should distinguish normal users and administrators.

A simple initial model can use:

```text
users.role
```

Possible values:

```text
USER
ADMIN
```

For larger systems, a separate roles/permissions model can be introduced later.

---

# 41. USER ROLE

If added to `users`:

```text
role VARCHAR NOT NULL DEFAULT 'USER'
```

Possible values:

```text
USER
ADMIN
```

Never rely only on frontend role checks.

Admin authorization must be enforced by the backend.

---

# 42. FUTURE VENUES TABLE

Future feature.

```text
venues
```

Possible fields:

```text
id
name
description
address
city
state
country
latitude
longitude
owner_id
phone
status
created_at
updated_at
```

---

# 43. FUTURE BOOKINGS TABLE

For turf/venue booking:

```text
bookings
```

Possible fields:

```text
id
user_id
venue_id
booking_date
start_time
end_time
status
total_amount
created_at
updated_at
```

---

# 44. FUTURE PAYMENTS TABLE

Possible structure:

```text
payments
```

Fields:

```text
id
user_id
booking_id
amount
currency
payment_provider
payment_reference
status
created_at
updated_at
```

Payment implementation should be designed separately when required.

---

# 45. FUTURE AI RECOMMENDATIONS TABLE

Only when AI recommendations are implemented.

Possible structure:

```text
ai_recommendations
```

Fields could include:

```text
id
user_id
activity_id
score
reason
created_at
```

The recommendation engine should not become a core dependency of the MVP.

---

# 46. DATABASE RELATIONSHIP MAP

```text
                         USERS
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
   USER_PROFILES       USER_SPORTS       ACTIVITIES
                           |                |
                           v                |
                         SPORTS             |
                                            |
                         +------------------+----------------+
                         |                  |                |
                         v                  v                v
                     LOCATIONS       PARTICIPANTS        STATUS
                                            |
                                            v
                                          USERS
```

Additional relationships:

```text
USERS
 ├── BOOKMARKS ─── ACTIVITIES
 ├── NOTIFICATIONS
 ├── MESSAGES
 ├── RATINGS
 ├── REPORTS
 └── BLOCKS
```

---

# 47. Foreign Key Map

Recommended relationships:

```text
user_profiles.user_id
    → users.id

user_profiles.preferred_location_id
    → locations.id

user_sports.user_id
    → users.id

user_sports.sport_id
    → sports.id

activities.host_id
    → users.id

activities.sport_id
    → sports.id

activities.location_id
    → locations.id

activity_participants.activity_id
    → activities.id

activity_participants.user_id
    → users.id

bookmarks.user_id
    → users.id

bookmarks.activity_id
    → activities.id

notifications.user_id
    → users.id

notifications.activity_id
    → activities.id

messages.activity_id
    → activities.id

messages.sender_id
    → users.id

ratings.activity_id
    → activities.id

ratings.reviewer_id
    → users.id

ratings.reviewed_user_id
    → users.id

reports.reporter_id
    → users.id

reports.reported_user_id
    → users.id

reports.activity_id
    → activities.id

blocks.blocker_id
    → users.id

blocks.blocked_user_id
    → users.id
```

---

# 48. Indexing Strategy

Indexes are important for SquadUp because discovery will be location and time based.

Recommended indexes:

```text
users.email
users.phone

user_sports.user_id
user_sports.sport_id

activities.host_id
activities.sport_id
activities.location_id
activities.activity_date
activities.status

activity_participants.activity_id
activity_participants.user_id

notifications.user_id
messages.activity_id
```

---

# 49. Location Index

If PostGIS is used, location should use an appropriate spatial type.

Example conceptual model:

```text
location_point
```

containing:

```text
latitude
longitude
```

with a spatial index.

This allows efficient:

```text
Find activities within 5 km
```

queries.

---

# 50. Date/Time Index

Activity discovery frequently depends on upcoming activities.

An index involving:

```text
activity_date
status
```

can improve upcoming activity queries.

---

# 51. Composite Index Examples

Potential indexes:

```text
activities(status, activity_date)

activities(sport_id, status, activity_date)

activity_participants(activity_id, user_id)
```

The exact indexes should be confirmed after observing real query patterns.

---

# 52. Soft Delete Strategy

For important entities, consider using:

```text
deleted_at
```

instead of immediately deleting records.

This can preserve:

- Activity history
- Ratings
- Reports
- Audit information

The final retention strategy must comply with applicable requirements.

---

# 53. Timestamp Strategy

Use UTC timestamps in the backend/database where possible.

Recommended fields:

```text
created_at
updated_at
```

For activity scheduling, store the correct timezone context.

Because SquadUp initially targets India, the application should consistently handle:

```text
Asia/Kolkata
```

for user-facing activity times.

The exact implementation should be decided in backend architecture.

---

# 54. Currency Strategy

For the initial India-focused version:

```text
Currency = INR
```

Database monetary values should use a suitable exact numeric type rather than floating point.

Example:

```text
DECIMAL(10,2)
```

---

# 55. India Scope

The initial application scope is:

```text
Country = India
```

The database should still store country information so international expansion is possible later.

---

# 56. Data Validation

Validation should exist at multiple layers:

```text
Frontend
   ↓
Backend
   ↓
Database
```

Frontend validation improves user experience.

Backend validation provides security.

Database constraints provide data integrity.

---

# 57. Required Backend Validation

Backend must validate:

- User authentication
- User authorization
- Activity ownership
- Activity capacity
- Activity status
- Activity timing
- Sport existence
- Location validity
- Duplicate participation
- Rating eligibility
- Report validity
- Block restrictions

---

# 58. Transaction Requirements

Transactions should be used for operations where multiple records must remain consistent.

Important examples:

## Joining an activity

```text
Check capacity
+
Create participant
+
Update activity state if necessary
```

## Leaving an activity

```text
Remove/deactivate participant
+
Update activity state if necessary
```

## Cancelling an activity

```text
Change activity status
+
Create participant notifications
```

The implementation can vary, but data consistency must be preserved.

---

# 59. Database Security

Never expose database credentials to the frontend.

Use environment variables:

```text
DATABASE_URL
```

Do not commit secrets to Git.

Use:

```text
.env
```

and ensure it is included in:

```text
.gitignore
```

---

# 60. API vs Database Responsibility

The frontend should never directly control database business rules.

Correct architecture:

```text
Frontend
   ↓
Backend API
   ↓
Business Logic
   ↓
Database
```

Not:

```text
Frontend
   ↓
Database
```

---

# 61. Suggested MVP Database Order

Build database entities in this order:

```text
1. users
2. user_profiles
3. sports
4. user_sports
5. locations
6. activities
7. activity_participants
```

Then:

```text
8. bookmarks
9. notifications
10. messages
11. ratings
12. reports
13. blocks
```

---

# 62. MVP Database Minimum

The absolute minimum functional database is:

```text
users
user_profiles
sports
user_sports
locations
activities
activity_participants
```

If these seven entities work correctly, the main SquadUp product loop can function.

---

# 63. Example User Record

Conceptually:

```text
users
--------------------------------
id: UUID
email: user@example.com
phone: +91XXXXXXXXXX
password_hash: HASH
is_email_verified: true
is_phone_verified: true
status: ACTIVE
role: USER
```

---

# 64. Example Profile Record

```text
user_profiles
--------------------------------
id: UUID
user_id: USER_UUID
full_name: Mahesh
profile_image_url: /uploads/profile.jpg
bio: Sports enthusiast
preferred_location_id: LOCATION_UUID
```

---

# 65. Example User Sport Record

```text
user_sports
--------------------------------
user_id: USER_UUID
sport_id: FOOTBALL_UUID
skill_level: INTERMEDIATE
```

---

# 66. Example Activity Record

```text
activities
--------------------------------
id: ACTIVITY_UUID
host_id: USER_UUID
sport_id: FOOTBALL_UUID
location_id: LOCATION_UUID
title: Evening Football
activity_date: YYYY-MM-DD
start_time: 18:30
duration_minutes: 90
max_participants: 10
price: 150.00
skill_level: INTERMEDIATE
status: PUBLISHED
```

---

# 67. Example Participant Record

```text
activity_participants
--------------------------------
activity_id: ACTIVITY_UUID
user_id: USER_UUID
status: JOINED
joined_at: TIMESTAMP
```

---

# 68. Database Migration Strategy

Database structure should be managed through migrations.

Do not manually change production tables without a migration process.

Migration example:

```text
001_create_users
002_create_profiles
003_create_sports
004_create_user_sports
005_create_locations
006_create_activities
007_create_activity_participants
```

Future:

```text
008_create_bookmarks
009_create_notifications
010_create_messages
011_create_ratings
012_create_reports
013_create_blocks
```

---

# 69. Seed Data

Development should include seed data for:

- Sports
- Test users
- Test locations
- Test activities

Seed data should never contain real user passwords or sensitive information.

---

# 70. Development Database

Use a separate development database.

Recommended environments:

```text
Development
Testing
Production
```

Do not use production data while experimenting.

---

# 71. Backup Strategy

Before production:

- Automated database backups
- Recovery testing
- Retention policy
- Secure backup storage

The exact backup provider depends on the final hosting platform.

---

# 72. Database Testing

Test:

## User

```text
Create user
Login
Update profile
```

## Sports

```text
Add sport
Select sport
Set skill
```

## Activities

```text
Create
Publish
Edit
Cancel
```

## Participants

```text
Join
Duplicate join
Leave
Full activity
```

## Location

```text
Nearby search
Radius
Invalid location
```

---

# 73. Important Database Edge Cases

The implementation must handle:

```text
Two users joining the last available slot
User joining twice
User leaving twice
Host cancelling an activity with participants
Activity starting while a join request is processed
Deleted/suspended user
Deleted/cancelled activity
Invalid sport
Invalid location
Invalid rating
Unauthorized activity edit
```

---

# 74. Data Flow Example — Joining

```text
Frontend
   ↓
POST /activities/:id/join
   ↓
Authentication
   ↓
Authorization
   ↓
Check activity
   ↓
Check status
   ↓
Check time
   ↓
Check capacity
   ↓
Check duplicate participation
   ↓
Create participant
   ↓
Commit transaction
   ↓
Return updated activity state
   ↓
Frontend updates UI
```

---

# 75. Data Flow Example — Discovery

```text
Frontend
   ↓
GET /activities
   ↓
Location
   ↓
Radius
   ↓
Sport
   ↓
Date
   ↓
Time
   ↓
Skill
   ↓
Price
   ↓
Database Query
   ↓
Sorted Results
   ↓
Frontend
```

---

# 76. Data Flow Example — Create Activity

```text
Frontend
   ↓
POST /activities
   ↓
Authentication
   ↓
Validate Host
   ↓
Validate Sport
   ↓
Validate Location
   ↓
Validate Date/Time
   ↓
Validate Capacity
   ↓
Validate Price
   ↓
Create Activity
   ↓
Return Activity
```

---

# 77. Database Design Principles

The database must follow:

### Principle 1

Keep authentication data separate from profile data.

### Principle 2

Avoid duplicated information.

### Principle 3

Use foreign keys.

### Principle 4

Use database constraints.

### Principle 5

Use transactions for critical operations.

### Principle 6

Protect personal information.

### Principle 7

Index real query patterns.

### Principle 8

Keep the MVP schema simple.

### Principle 9

Design for future expansion without overengineering.

### Principle 10

The backend remains responsible for business logic.

---

# 78. Final MVP ER Structure

```text
                         ┌───────────────┐
                         │     USERS     │
                         └───────┬───────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │USER_PROFILES │ │ USER_SPORTS  │ │ ACTIVITIES   │
        └──────────────┘ └──────┬───────┘ └──────┬───────┘
                                │                │
                                ▼                ▼
                         ┌──────────────┐ ┌──────────────┐
                         │    SPORTS    │ │  LOCATIONS   │
                         └──────────────┘ └──────────────┘
                                                 │
                                                 │
                                         ┌───────▼──────────┐
                                         │ACTIVITY_         │
                                         │PARTICIPANTS      │
                                         └────────┬─────────┘
                                                  │
                                                  ▼
                                               USERS
```

---

# 79. Final Database Scope

### MVP

```text
users
user_profiles
sports
user_sports
locations
activities
activity_participants
```

### Phase 2

```text
bookmarks
notifications
messages
ratings
reports
blocks
```

### Future

```text
venues
bookings
payments
subscriptions
ai_recommendations
advanced analytics
```

---

# 80. Final Database Principle

The database should support the simplest possible version of the SquadUp idea:

```text
A real person
     ↓
has a sports profile
     ↓
has a discovery location
     ↓
finds a nearby activity
     ↓
joins the activity
     ↓
becomes a participant
     ↓
plays with other people
```

Everything else should be built around this core relationship.

**SquadUp database = Users + Sports + Location + Activities + Participants.**
