# SquadUp — Security Architecture

**Document Version:** 1.0  
**Project:** SquadUp  
**Security Goal:** Protect users, accounts, application data, and real-world activity interactions.

---

# 1. Security Goal

SquadUp connects people for real-world sports activities.

Security must protect:

- User accounts
- Passwords
- Authentication credentials
- Personal information
- Location information
- Activity data
- Participant information
- Administrative functions
- API access
- Database credentials

Security must be considered from the beginning, not added after deployment.

---

# 2. Security Principles

Follow:

```text
Never trust the client
Validate on the server
Use least privilege
Protect secrets
Minimize stored personal data
Use HTTPS
Log security events safely
Keep dependencies updated
```

---

# 3. Authentication

Authentication answers:

```text
Who is this user?
```

Required capabilities:

```text
Registration
Login
Logout
Password reset
Email/phone verification where implemented
Authenticated sessions
```

---

# 4. Password Security

Passwords must:

```text
Never be stored as plain text
Never be returned through an API
Never be logged
Never be stored in frontend local files
```

Use a strong password hashing algorithm supported by the backend security stack.

The application should use a well-tested authentication library rather than implementing password hashing manually.

---

# 5. Password Rules

The exact policy can be refined during implementation.

At minimum:

```text
Minimum length
Reasonable complexity
Password confirmation during registration
Password reset flow
```

Do not create unnecessarily complicated password rules that encourage users to write passwords down.

---

# 6. Authentication Tokens / Sessions

Use a secure authentication mechanism.

Requirements:

```text
Protected against theft
Short-lived access credentials where applicable
Secure refresh mechanism where applicable
Logout support
Expiration
Revocation strategy
```

The final mechanism should be selected during implementation based on the chosen FastAPI authentication architecture.

---

# 7. Browser Storage

Avoid storing sensitive authentication information in insecure browser storage without a clear security design.

For browser authentication, prefer a secure cookie-based strategy where appropriate.

If tokens are used, carefully evaluate:

```text
XSS
CSRF
Token theft
Expiration
Refresh
Revocation
```

---

# 8. Authorization

Authorization answers:

```text
Is this user allowed to perform this action?
```

Example:

```text
User A creates Activity A
       ↓
User A can edit Activity A
       ↓
User B cannot edit Activity A
```

Ownership must always be checked by the backend.

---

# 9. Never Trust Frontend Ownership

Never accept:

```json
{
  "host_id": "some-other-user"
}
```

as proof of ownership.

The backend should derive the authenticated user from the authentication context.

---

# 10. Activity Authorization

For edit/cancel:

```text
Authenticated?
     ↓
Activity exists?
     ↓
User is host?
     ↓
Allowed?
```

If not:

```text
403 Forbidden
```

---

# 11. Join Authorization

For joining:

```text
Authenticated?
     ↓
Activity exists?
     ↓
Activity is published?
     ↓
Activity hasn't started?
     ↓
User isn't already joined?
     ↓
Capacity available?
     ↓
Allow join
```

---

# 12. Activity Capacity Security

This is a critical rule.

Do not rely only on:

```text
Frontend participant count
```

The backend must verify capacity.

Use a database transaction/locking strategy to prevent race conditions where multiple users attempt to take the final available slot at the same time.

---

# 13. Input Validation

Validate all user-controlled data.

Examples:

```text
Name
Email
Phone
Password
Activity title
Description
Date
Time
Duration
Participant count
Price
Latitude
Longitude
Radius
Sport
Skill level
```

---

# 14. Radius Validation

SquadUp maximum search radius:

```text
15 km
```

The backend must reject or safely cap values outside the allowed range.

Example malicious request:

```text
radius=5000
```

must not cause an unrestricted location search.

---

# 15. Coordinate Validation

Validate:

```text
Latitude: -90 to +90
Longitude: -180 to +180
```

Reject invalid coordinates.

---

# 16. SQL Injection Protection

Never build SQL queries by directly concatenating user input.

Use:

```text
SQLAlchemy
Parameterized Queries
ORM Query APIs
```

Do not construct unsafe SQL strings from request parameters.

---

# 17. Cross-Site Scripting

Prevent XSS by:

```text
Escaping user-generated content
Avoiding unsafe HTML rendering
Sanitizing content where HTML is allowed
Using framework-safe rendering
```

User descriptions should be treated as untrusted input.

---

# 18. CSRF Protection

If cookie-based authentication is used, protect state-changing requests against CSRF.

Relevant methods:

```text
POST
PATCH
DELETE
```

Use an appropriate CSRF protection strategy for the selected authentication architecture.

---

# 19. CORS

Configure CORS explicitly.

Development may allow:

```text
http://localhost:5173
```

Production should allow only the actual frontend origin(s).

Avoid:

```text
Allow all origins
```

when credentials or sensitive APIs are involved.

---

# 20. HTTPS

Production must use:

```text
HTTPS
```

Never transmit passwords or authentication credentials over plain HTTP in production.

---

# 21. Environment Variables

Sensitive values must be stored in environment configuration.

Examples:

```text
DATABASE_URL
SECRET_KEY
MAP_API_KEY
EMAIL_PROVIDER_KEY
SMS_PROVIDER_KEY
```

Never commit secrets to GitHub.

---

# 22. .gitignore Security

Ensure:

```text
.env
.env.*
```

are ignored when they contain secrets.

Commit an example file instead:

```text
.env.example
```

Example:

```text
DATABASE_URL=
SECRET_KEY=
ALLOWED_ORIGINS=
```

Do not put real credentials in `.env.example`.

---

# 23. API Security

Every protected endpoint must verify authentication.

Example:

```text
GET /api/v1/users/me
```

requires authentication.

Example:

```text
POST /api/v1/activities
```

requires authentication.

---

# 24. Sensitive API Responses

Never return:

```text
password
password_hash
secret keys
authentication secrets
internal database credentials
private tokens
```

Only return data required by the client.

---

# 25. Personal Data Minimization

Only collect information that SquadUp actually needs.

Potential user data:

```text
Name
Email
Phone
Profile information
Sports
Skill levels
Location preferences
Activity participation
```

Avoid collecting unnecessary sensitive information.

---

# 26. Location Privacy

Location is particularly important because SquadUp is location-based.

The system should distinguish:

```text
Current discovery location
Preferred location
Activity location
```

Do not unnecessarily store a user's continuous real-time location.

---

# 27. Current Location

If the user allows browser location:

```text
Device
 ↓
Current coordinates
 ↓
Nearby search
```

Use the coordinates for the requested feature.

Do not automatically create a permanent location history unless a future feature explicitly requires it and the privacy design supports it.

---

# 28. Preferred Location

A user may save a preferred search location.

Allow the user to:

```text
View
Change
Remove
```

their preferred location.

---

# 29. Activity Location Privacy

Activity locations may be public or semi-public depending on product rules.

The application should decide whether:

```text
Exact location
Approximate location
Venue name
```

is displayed before joining.

This should be finalized before production.

---

# 30. User Profile Privacy

Only expose profile information intended for other users.

Possible public information:

```text
Display name
Profile image
Selected sports
Skill level
```

Private information:

```text
Email
Phone
Authentication data
```

should not be publicly exposed.

---

# 31. Rate Limiting

Rate-limit sensitive endpoints.

Especially:

```text
Login
Registration
Password reset
Location search
Activity creation
Reports
Messages
```

This helps reduce abuse and automated attacks.

---

# 32. Brute Force Protection

Login protection can include:

```text
Rate limiting
Temporary delays
Account security monitoring
```

Do not reveal whether an email exists through overly specific error messages where that would create an account-enumeration risk.

---

# 33. Account Enumeration

Avoid responses such as:

```text
This email is registered.
```

for sensitive recovery flows when that would expose account existence.

Use neutral responses where appropriate.

---

# 34. Authentication Errors

Prefer:

```text
Invalid email or password.
```

instead of revealing which specific credential failed.

---

# 35. Database Security

Database credentials must:

```text
Never be committed
Never be exposed to frontend
Use least privilege
Use encrypted connections when required
```

The frontend must never connect directly to PostgreSQL.

Correct:

```text
React
 ↓
FastAPI
 ↓
PostgreSQL
```

Incorrect:

```text
React
 ↓
PostgreSQL
```

---

# 36. Database Constraints

Use database constraints for important integrity rules.

Examples:

```text
Unique email
Unique phone where applicable
Valid foreign keys
Participant uniqueness
Valid activity relationships
```

---

# 37. Duplicate Join Protection

The database should prevent duplicate participant records for the same user/activity.

Conceptually:

```text
UNIQUE(activity_id, user_id)
```

This should complement backend validation.

---

# 38. Data Integrity

Use:

```text
Foreign keys
Transactions
Constraints
Validation
```

for critical relationships.

---

# 39. Race Conditions

Potential race condition:

```text
2 users
   ↓
Both see 1 available slot
   ↓
Both click Join
```

The backend/database must guarantee that capacity cannot be exceeded.

---

# 40. File Upload Security

If profile images or other uploads are added:

Validate:

```text
File type
File size
File extension
Content type
Image dimensions
```

Do not trust the filename or MIME type supplied by the client.

---

# 41. Image Upload Limits

Set reasonable maximum sizes.

Example policy can be defined during implementation.

Also:

```text
Resize images
Optimize images
Strip unnecessary metadata where appropriate
```

---

# 42. Error Handling

Production errors should not reveal:

```text
Database queries
Stack traces
File paths
Secrets
Internal architecture details
```

Users should receive simple messages.

Developers can receive detailed logs through secure server logging.

---

# 43. Logging

Log useful security events:

```text
Login failures
Successful login
Password reset requests
Account changes
Activity cancellation
Reports
Authorization failures
Unexpected server errors
```

Never log:

```text
Passwords
Tokens
Secret keys
Sensitive personal data
```

---

# 44. Logging Privacy

Logs can contain personal information.

Therefore:

```text
Collect only necessary information
Restrict log access
Set retention policies
Avoid sensitive data
```

---

# 45. Dependency Security

Keep dependencies updated:

```text
React packages
Python packages
FastAPI
SQLAlchemy
Database drivers
```

Review security advisories before upgrading major versions.

Do not blindly install unknown packages.

---

# 46. API Documentation Security

FastAPI documentation such as:

```text
/docs
/redoc
```

is useful during development.

For production, decide whether public access is appropriate.

If protected, restrict access appropriately.

---

# 47. Admin Security

Admin functionality must be separate from normal user functionality.

Admin users should have explicit roles/permissions.

Example:

```text
USER
HOST
MODERATOR
ADMIN
```

Do not identify admins only by a frontend flag.

---

# 48. Reports and Moderation

Future reporting system:

```text
User
 ↓
Report
 ↓
Backend
 ↓
Moderation
 ↓
Admin/Moderator
```

Users should not be able to manipulate moderation outcomes through frontend requests.

---

# 49. Block System

Future block feature should prevent inappropriate interactions where applicable.

The backend should enforce block rules rather than relying only on UI hiding.

---

# 50. Session Security

Authentication sessions should have:

```text
Expiration
Secure handling
Logout
Revocation strategy
```

Do not create sessions that remain valid indefinitely without a security reason.

---

# 51. Security Headers

Production deployment should consider appropriate security headers, such as:

```text
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Strict-Transport-Security
```

Exact configuration depends on the hosting and frontend architecture.

---

# 52. Frontend Security

Do not expose:

```text
DATABASE_URL
SECRET_KEY
Private API credentials
Server secrets
```

Frontend environment variables should be treated as public if they are bundled into browser code.

---

# 53. Public API Keys

Some browser-side services may require public/restricted keys.

If used:

```text
Restrict domains
Restrict APIs
Use provider quotas
Monitor usage
```

Never assume a browser-exposed key is secret.

---

# 54. Secure Development Workflow

For every feature:

```text
Plan
 ↓
Identify user input
 ↓
Identify authorization
 ↓
Implement validation
 ↓
Implement backend protection
 ↓
Test abuse cases
 ↓
Review
 ↓
Commit
```

---

# 55. AI Security Review

When using Claude, ChatGPT, or another AI for review, ask specifically for:

```text
Authentication vulnerabilities
Authorization problems
Input validation issues
SQL injection
XSS
CSRF
CORS
Secret exposure
Race conditions
Rate limiting
Sensitive data exposure
```

AI review should supplement, not replace, actual testing and security practices.

---

# 56. Security Testing Checklist

Before MVP deployment:

```text
[ ] Registration protected
[ ] Login protected
[ ] Passwords hashed
[ ] Protected endpoints require authentication
[ ] Ownership checks work
[ ] Non-host cannot edit activity
[ ] Non-host cannot cancel activity
[ ] Duplicate joins prevented
[ ] Activity capacity cannot be exceeded
[ ] Radius limited to 15 km
[ ] Coordinates validated
[ ] SQL injection protections present
[ ] XSS protections present
[ ] CORS configured
[ ] Secrets not committed
[ ] HTTPS enabled in production
[ ] Error messages do not leak internals
[ ] Rate limiting considered
```

---

# 57. Security Principle for SquadUp

The most important rule is:

```text
The frontend is not trusted.
```

Anything important must be verified by FastAPI and/or PostgreSQL.

---

# 58. Final Security Flow

```text
User Request
     ↓
HTTPS
     ↓
FastAPI
     ↓
Authentication
     ↓
Authorization
     ↓
Input Validation
     ↓
Business Rules
     ↓
Database Constraints / Transaction
     ↓
Safe Response
```

This security flow should be used for all critical SquadUp operations.
