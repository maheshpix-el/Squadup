# SquadUp — User Flows

**Document Version:** 1.0
**Project:** SquadUp
**Purpose:** Define the complete user journeys and screen-to-screen flows for the SquadUp sports activity platform.

---

# 1. Document Purpose

This document defines how users move through SquadUp.

It describes:

- Entry into the application
- Registration
- Login
- Profile setup
- Location selection
- Sport selection
- Activity discovery
- Searching and filtering
- Viewing activity details
- Joining activities
- Leaving activities
- Creating activities
- Managing hosted activities
- Communication
- Notifications
- Ratings
- Bookmarks
- Reports
- Blocking
- Settings
- Logout

This document will be used as a foundation for:

- UI design
- Frontend development
- Backend API design
- Database design
- Testing
- Antigravity implementation

---

# 2. Global User Flow

The primary SquadUp experience is:

```text
Open App
    ↓
Landing / Home
    ↓
Login or Register
    ↓
Profile Setup
    ↓
Select Sports
    ↓
Choose Location
    ↓
Set Search Radius
    ↓
Explore Activities
    ↓
Search / Filter
    ↓
Activity Details
    ↓
Join Activity
    ↓
My Activities
    ↓
Activity Communication
    ↓
Attend Activity
    ↓
Activity Completed
    ↓
Rate / Review
```

A user can also become a host at any point:

```text
User
 ↓
Create Activity
 ↓
Publish
 ↓
Players Join
 ↓
Manage Activity
 ↓
Activity Starts
 ↓
Activity Completes
```

---

# 3. User States

A user can exist in several states.

```text
Visitor
  ↓
Registered User
  ↓
Verified User
  ↓
Profile Completed
  ↓
Active User
  ↓
Player / Host
```

A user does not need a separate host account.

Every active user can:

- Join activities
- Create activities
- Manage their own activities

---

# 4. Application Entry Flow

## 4.1 First Visit

```text
User opens SquadUp
        ↓
Landing / Home Page
        ↓
User chooses:
        ├── Login
        └── Register
```

If the user is already authenticated:

```text
Open SquadUp
      ↓
Check authentication
      ↓
Authenticated
      ↓
Home / Explore
```

---

# 5. Landing Page Flow

The landing page should explain the product quickly.

Possible content:

- SquadUp logo
- Short tagline
- Short explanation
- Explore button
- Create Activity button
- Login button
- Register button

Primary message:

**Find your squad. Play your game.**

Primary actions:

```text
[ EXPLORE ]
[ CREATE ACTIVITY ]
```

Unauthenticated users attempting protected actions should be redirected to authentication.

---

# 6. Registration Flow

## 6.1 Registration Journey

```text
Landing Page
     ↓
Register
     ↓
Registration Form
     ↓
Enter Name
     ↓
Enter Email
     ↓
Enter Phone
     ↓
Create Password
     ↓
Confirm Password
     ↓
Submit
     ↓
Validate
     ↓
Verification
     ↓
Account Created
     ↓
Profile Setup
```

---

# 7. Registration Validation Flow

When the user submits registration:

```text
Submit Registration
       ↓
Validate Required Fields
       ↓
Validate Email
       ↓
Validate Phone
       ↓
Validate Password
       ↓
Check Existing Account
       ↓
Valid?
   ├── No → Show Error
   └── Yes
          ↓
       Create Account
          ↓
       Verification
```

Errors should be displayed close to the relevant fields.

---

# 8. Email / Phone Verification Flow

```text
Account Created
      ↓
Verification Required
      ↓
User receives verification method
      ↓
Enter verification code / complete verification
      ↓
Verification successful?
      ├── No → Show error / retry
      └── Yes
             ↓
        Account Verified
```

The final verification mechanism will be defined during technical architecture planning.

---

# 9. Login Flow

```text
Landing Page
     ↓
Login
     ↓
Enter Email / Phone
     ↓
Enter Password
     ↓
Submit
     ↓
Validate Credentials
     ↓
Valid?
 ├── No → Show Error
 └── Yes
       ↓
    Create Session
       ↓
    Home / Explore
```

---

# 10. Forgot Password Flow

```text
Login
  ↓
Forgot Password
  ↓
Enter Email / Phone
  ↓
Submit
  ↓
Verification
  ↓
Set New Password
  ↓
Confirm New Password
  ↓
Password Updated
  ↓
Login
```

---

# 11. First-Time User Flow

After successful registration:

```text
Account Created
      ↓
Profile Setup
      ↓
Add Profile Photo
      ↓
Add Bio
      ↓
Select Sports
      ↓
Select Skill Levels
      ↓
Choose Location
      ↓
Set Search Radius
      ↓
Complete Setup
      ↓
Explore
```

The user should be allowed to skip non-essential profile information where appropriate.

---

# 12. Profile Setup Flow

```text
Profile Setup
      ↓
Name
      ↓
Profile Photo
      ↓
Bio
      ↓
Age
      ↓
Sports
      ↓
Skill Level
      ↓
Location
      ↓
Save
      ↓
Profile Complete
```

---

# 13. Sport Selection Flow

The user can select one or more sports.

```text
Select Sports
      ↓
Choose Sport
      ↓
Choose Skill Level
      ↓
Add Another Sport?
   ├── Yes → Choose Another Sport
   └── No
         ↓
      Continue
```

Example:

```text
Football
Intermediate

Cricket
Advanced

Badminton
Beginner
```

---

# 14. Location Permission Flow

The application should explain why location is useful.

```text
Location Setup
      ↓
Use Current Location?
   ├── Allow
   │    ↓
   │  Request Permission
   │    ↓
   │  Permission Granted
   │    ↓
   │  Get Current Location
   │
   └── Deny
        ↓
      Select Preferred Location
```

The user should not be blocked from using the application simply because they denied location access.

---

# 15. Preferred Location Flow

```text
Choose Preferred Location
        ↓
Search Location
        ↓
Select Location
        ↓
Confirm
        ↓
Save Preferred Location
```

The preferred location becomes available as a discovery center.

---

# 16. Location Mode Flow

Users can switch between:

```text
Current Location
        OR
Preferred Location
```

Flow:

```text
Explore
  ↓
Location Selector
  ↓
Choose Location Mode
  ↓
Current Location / Preferred Location
  ↓
Update Activity Results
```

---

# 17. Search Radius Flow

```text
Location Selected
      ↓
Search Radius
      ↓
Select:
500 m
1 km
2 km
5 km
10 km
15 km
      ↓
Confirm
      ↓
Refresh Activity Results
```

The selected radius should remain available until the user changes it.

---

# 18. Home Flow

After login, the user can reach the main application.

Suggested structure:

```text
Home
 ├── Nearby Activities
 ├── Recommended Activities
 ├── Popular Sports
 ├── Upcoming Activities
 └── Quick Actions
```

Quick actions:

```text
[ FIND A GAME ]
[ CREATE ACTIVITY ]
```

---

# 19. Explore Flow

Explore is the primary discovery flow.

```text
Explore
   ↓
Select Location
   ↓
Select Radius
   ↓
Select Sport
   ↓
Select Date / Time
   ↓
Apply Filters
   ↓
View Activities
```

Results can be shown as:

- List
- Map
- Optional combined view

---

# 20. Activity Search Flow

```text
Explore
   ↓
Search Bar
   ↓
Enter Search
   ↓
Search Activities
   ↓
Display Matching Results
```

Search may consider:

- Activity title
- Sport
- Venue
- Location

The final search behavior will be defined in the feature specification.

---

# 21. Filter Flow

```text
Explore
   ↓
Filters
   ↓
Select Sport
   ↓
Select Distance
   ↓
Select Date
   ↓
Select Time
   ↓
Select Skill
   ↓
Select Price
   ↓
Apply
   ↓
Filtered Results
```

The user should be able to clear filters.

```text
[ CLEAR ALL ]
```

---

# 22. Sort Flow

Possible sorting options:

- Nearest
- Soonest
- Most available slots
- Lowest price

Flow:

```text
Explore
   ↓
Sort
   ↓
Select Option
   ↓
Update Results
```

The final sorting rules will be defined in the feature specification.

---

# 23. Activity List Flow

```text
Explore
   ↓
Activity Results
   ↓
Select Activity Card
   ↓
Activity Details
```

Each card should provide enough information for the user to decide whether to open it.

---

# 24. Activity Details Flow

```text
Activity Card
      ↓
Activity Details
      ↓
View:
- Sport
- Title
- Host
- Date
- Time
- Duration
- Venue
- Location
- Distance
- Map
- Players
- Available Slots
- Skill
- Price
- Description
- Rules
      ↓
Join Activity
```

---

# 25. Join Activity Flow

```text
Activity Details
      ↓
JOIN ACTIVITY
      ↓
Backend Validation
      ↓
Is User Authenticated?
   ├── No → Login
   └── Yes
          ↓
Is Activity Available?
   ├── No → Show unavailable message
   └── Yes
          ↓
Is Activity Full?
   ├── Yes → Show FULL
   └── No
          ↓
Already Joined?
   ├── Yes → Show Joined State
   └── No
          ↓
Add Participant
          ↓
Update Participant Count
          ↓
Update Available Slots
          ↓
Show Success
          ↓
Add Activity to My Activities
```

---

# 26. Join Failure States

The join operation may fail.

Possible reasons:

```text
Activity Full
Activity Cancelled
Activity Already Started
User Already Joined
User Blocked
Authentication Required
Server Error
```

The user should receive a clear message.

Example:

```text
Sorry, this activity is now full.
```

---

# 27. Successful Join Flow

After joining:

```text
Activity Details
      ↓
Joined Successfully
      ↓
Button changes to:
LEAVE ACTIVITY
      ↓
Activity appears in:
My Activities
      ↓
User can access:
Activity Chat
Activity Location
Activity Details
```

---

# 28. My Activities Flow

My Activities should contain relevant activities.

Possible categories:

```text
My Activities
 ├── Joined
 ├── Hosted
 ├── Upcoming
 ├── Completed
 └── Cancelled
```

The exact categorization will be finalized during UI design.

---

# 29. Upcoming Joined Activity Flow

```text
My Activities
      ↓
Upcoming
      ↓
Select Activity
      ↓
Activity Details
      ↓
View:
- Time
- Venue
- Map
- Participants
- Chat
      ↓
Attend Activity
```

---

# 30. Leave Activity Flow

```text
My Activities
      ↓
Open Joined Activity
      ↓
LEAVE ACTIVITY
      ↓
Confirmation Dialog
      ↓
Confirm Leave?
   ├── No → Return to Details
   └── Yes
         ↓
      Backend Validation
         ↓
      Remove Participant
         ↓
      Update Count
         ↓
      Increase Available Slot
         ↓
      Notify Host
         ↓
      Remove from Joined Activities
         ↓
      Show Success
```

---

# 31. Host Activity Flow

Every user can create an activity.

```text
Home / Explore
      ↓
CREATE ACTIVITY
      ↓
Activity Creation Form
      ↓
Select Sport
      ↓
Enter Title
      ↓
Select Date
      ↓
Select Time
      ↓
Set Duration
      ↓
Select Location
      ↓
Set Player Limit
      ↓
Set Skill Level
      ↓
Set Price
      ↓
Add Description
      ↓
Add Rules
      ↓
Review
      ↓
Publish
```

---

# 32. Create Activity Validation Flow

```text
Create Activity
      ↓
Submit
      ↓
Validate Fields
      ↓
Validate Date / Time
      ↓
Validate Location
      ↓
Validate Player Limit
      ↓
Validate Price
      ↓
Valid?
   ├── No → Show Errors
   └── Yes
         ↓
      Create Activity
         ↓
      Publish
```

---

# 33. Activity Review Before Publishing

Before publishing, the host should be able to review:

```text
Sport
Title
Date
Time
Duration
Venue
Location
Player Limit
Skill Level
Price
Description
Rules
```

Actions:

```text
[ EDIT ]
[ PUBLISH ]
```

---

# 34. Activity Published Flow

```text
Publish
   ↓
Activity Created
   ↓
Activity Status = PUBLISHED
   ↓
Activity appears in Explore
   ↓
Nearby users can discover it
   ↓
Players join
```

---

# 35. Hosted Activity Management

A host should have access to:

```text
My Activities
      ↓
Hosted
      ↓
Select Activity
      ↓
Manage Activity
```

Possible actions:

- Edit
- View participants
- Chat
- Cancel
- View activity details

---

# 36. Edit Activity Flow

```text
Hosted Activity
      ↓
EDIT
      ↓
Update Allowed Information
      ↓
Validate
      ↓
Save Changes
      ↓
Update Activity
      ↓
Notify Participants if required
```

The final rules for editing after participants have joined will be defined later.

---

# 37. Cancel Activity Flow

```text
Hosted Activity
      ↓
CANCEL ACTIVITY
      ↓
Confirmation
      ↓
Confirm?
   ├── No → Return
   └── Yes
         ↓
      Update Status
         ↓
      CANCELLED
         ↓
      Notify Participants
         ↓
      Remove from Active Discovery
```

---

# 38. Participant Management Flow

Host opens:

```text
My Activities
      ↓
Hosted
      ↓
Activity
      ↓
Participants
```

Host can view:

- Participant names
- Profile information allowed by privacy rules
- Verification status
- Attendance/reputation indicators where available

Future versions may allow advanced participant management.

---

# 39. Activity Chat Flow

```text
Joined / Hosted Activity
       ↓
CHAT
       ↓
Activity Chat
       ↓
View Messages
       ↓
Type Message
       ↓
Send
       ↓
Message Appears
```

Chat access should be restricted to authorized activity participants.

---

# 40. Activity Completion Flow

When the activity time has passed:

```text
Activity Starts
      ↓
Activity In Progress
      ↓
Activity Time Ends
      ↓
Activity Completed
      ↓
Participant Records Updated
      ↓
Rating / Feedback Available
```

The exact automatic status transition will be defined in the technical design.

---

# 41. Attendance Flow

After activity completion:

```text
Activity Completed
      ↓
Attendance Processing
      ↓
Determine Attendance
      ↓
Update User History
      ↓
Update Reputation Data
```

The initial implementation may use a simple attendance model.

---

# 42. Rating Flow

```text
Activity Completed
      ↓
Rating Prompt
      ↓
Did You Attend?
      ↓
Yes
      ↓
Rate Host / Experience
      ↓
Submit
      ↓
Rating Saved
```

The system should prevent duplicate ratings for the same activity where appropriate.

---

# 43. Bookmark Flow

From Activity Details:

```text
Activity Details
      ↓
Bookmark
      ↓
Activity Saved
      ↓
My Bookmarks
```

To remove:

```text
Bookmarked Activity
      ↓
Unbookmark
      ↓
Activity Removed
```

---

# 44. Notifications Flow

```text
Event Occurs
      ↓
Notification Generated
      ↓
Notification Center
      ↓
User Opens Notification
      ↓
Relevant Screen
```

Examples:

```text
Someone joined your activity
Someone left your activity
Your activity was cancelled
Your activity starts soon
New activity message
Rating available
```

---

# 45. Notification Center

The notification center should show:

- New notifications
- Read notifications
- Notification time
- Relevant activity

The user should be able to mark notifications as read.

---

# 46. Profile Flow

```text
Profile
   ↓
View Profile
   ↓
Edit Profile
```

Profile sections:

```text
Personal Information
Sports
Skill Levels
Location Preferences
Verification
Activity History
Ratings
Attendance
```

---

# 47. Edit Profile Flow

```text
Profile
   ↓
Edit Profile
   ↓
Change Information
   ↓
Save
   ↓
Validate
   ↓
Update Profile
   ↓
Show Success
```

---

# 48. Location Settings Flow

```text
Profile / Settings
      ↓
Location
      ↓
Current Location
Preferred Location
Search Radius
      ↓
Update
      ↓
Save
```

---

# 49. Sports Preference Flow

```text
Profile
   ↓
Sports
   ↓
Add / Remove Sport
   ↓
Set Skill Level
   ↓
Save
```

---

# 50. Report User Flow

```text
User Profile
      ↓
Report
      ↓
Select Reason
      ↓
Optional Description
      ↓
Submit
      ↓
Report Created
      ↓
Confirmation
```

---

# 51. Report Activity Flow

```text
Activity Details
      ↓
Report
      ↓
Select Reason
      ↓
Optional Description
      ↓
Submit
      ↓
Report Created
      ↓
Confirmation
```

---

# 52. Block User Flow

```text
User Profile
      ↓
Block User
      ↓
Confirmation
      ↓
Confirm
      ↓
User Blocked
      ↓
Apply Blocking Rules
```

The exact consequences of blocking will be defined in the feature and security specifications.

---

# 53. Settings Flow

Settings may contain:

```text
Settings
 ├── Account
 ├── Privacy
 ├── Location
 ├── Notifications
 ├── Security
 ├── Help
 ├── Community Guidelines
 └── Logout
```

---

# 54. Privacy Flow

Users should be able to manage privacy-related settings where supported.

Potential settings:

- Profile visibility
- Location privacy
- Notification preferences
- Communication preferences

The exact options will be defined later.

---

# 55. Logout Flow

```text
Settings
   ↓
Logout
   ↓
Confirmation
   ↓
Confirm
   ↓
Clear Session
   ↓
Landing / Login
```

---

# 56. Authentication Guard Flow

Protected screens should check authentication.

```text
User opens protected page
        ↓
Authentication Check
        ↓
Authenticated?
   ├── No → Redirect to Login
   └── Yes → Show Page
```

Examples:

- My Activities
- Create Activity
- Bookmarks
- Profile editing
- Chat
- Notifications

---

# 57. Error Handling Flow

Every important action should have a defined failure state.

General pattern:

```text
User Action
    ↓
Request
    ↓
Success?
 ├── Yes → Update UI
 └── No
       ↓
    Identify Error
       ↓
    Show User-Friendly Message
       ↓
    Allow Retry
```

The application should not expose technical errors directly to users.

---

# 58. Network Error Flow

```text
User Action
      ↓
API Request
      ↓
Network Error
      ↓
Show:
"Unable to connect. Please try again."
      ↓
Retry
```

---

# 59. Empty State Flow

Every major list should have an empty state.

Example:

```text
No activities found.

Try:
- Increasing your search radius
- Choosing another sport
- Changing the date
- Changing the location
```

Actions:

```text
[ CHANGE FILTERS ]
```

---

# 60. Location Unavailable Flow

If current location cannot be obtained:

```text
Current Location
      ↓
Location Unavailable
      ↓
Show Explanation
      ↓
Use Preferred Location?
   ├── Yes → Preferred Location
   └── No → Select Location
```

---

# 61. Activity Full Flow

```text
User opens activity
      ↓
Activity Full
      ↓
Display FULL
      ↓
Disable Join
```

Future version:

```text
FULL
 ↓
Join Waitlist
```

Waitlist is not part of the initial MVP.

---

# 62. Activity Cancelled Flow

If a user opens a cancelled activity:

```text
Activity Details
      ↓
Status = CANCELLED
      ↓
Display cancellation message
      ↓
Disable Join
```

---

# 63. Activity Already Started Flow

If a user tries to join after the activity has started:

```text
Join Activity
      ↓
Activity Started
      ↓
Reject Join
      ↓
Show:
"This activity has already started."
```

---

# 64. Duplicate Join Flow

```text
Join Activity
      ↓
Already Participant
      ↓
Reject Duplicate Join
      ↓
Show Joined State
```

---

# 65. Unauthorized Action Flow

If a user tries to perform an action they are not allowed to perform:

```text
Action
 ↓
Authorization Check
 ↓
Authorized?
 ├── Yes → Continue
 └── No → Reject
          ↓
       Show message
```

Example:

A user must not be able to edit another user's activity.

---

# 66. Responsive User Flow

The same core flows must work across:

```text
Desktop
Tablet
Mobile
```

The navigation may change depending on screen size, but the underlying user journey must remain consistent.

---

# 67. Mobile Navigation Flow

Suggested mobile navigation:

```text
Home
Explore
Create
Activities
Profile
```

Additional features may be accessed through:

- Menu
- Profile
- Notifications
- Activity pages

---

# 68. Desktop Navigation Flow

Suggested desktop navigation:

```text
Logo
Home
Explore
Create Activity
My Activities
Bookmarks
Notifications
Profile
```

The exact design will be finalized in the UI document.

---

# 69. Map View Flow

```text
Explore
      ↓
Map View
      ↓
Activity Markers
      ↓
Select Marker
      ↓
Activity Preview
      ↓
View Activity
```

The map should not expose unnecessary private user locations.

---

# 70. Location-Based Discovery Flow

```text
User Location
      ↓
Search Radius
      ↓
Backend Location Query
      ↓
Activities Within Radius
      ↓
Apply Filters
      ↓
Sort Results
      ↓
Display Activities
```

The final distance calculation and database query strategy will be defined in the architecture and API documents.

---

# 71. Complete Player Journey

```text
Open SquadUp
      ↓
Register
      ↓
Verify
      ↓
Complete Profile
      ↓
Select Sports
      ↓
Choose Location
      ↓
Set Radius
      ↓
Explore
      ↓
Filter
      ↓
Select Activity
      ↓
View Details
      ↓
Join
      ↓
My Activities
      ↓
Chat
      ↓
View Map
      ↓
Attend
      ↓
Activity Completed
      ↓
Rate
      ↓
View History
      ↓
Find Another Activity
```

---

# 72. Complete Host Journey

```text
Open SquadUp
      ↓
Login
      ↓
Create Activity
      ↓
Select Sport
      ↓
Set Date / Time
      ↓
Set Location
      ↓
Set Player Limit
      ↓
Set Skill
      ↓
Set Price
      ↓
Add Description
      ↓
Review
      ↓
Publish
      ↓
Players Discover
      ↓
Players Join
      ↓
Host Manages Participants
      ↓
Chat
      ↓
Activity Starts
      ↓
Activity Completes
      ↓
Ratings
      ↓
Activity History
```

---

# 73. Complete Application Flow

```text
                         SQUADUP
                            |
             +--------------+--------------+
             |                             |
          Visitor                       User
             |                             |
      +------+-------+              +------+------+
      |              |              |             |
    Login         Register        Explore       Profile
      |              |              |             |
      |        Profile Setup       Search       Settings
      |              |              |             |
      +--------------+--------------+-------------+
                            |
                       Location
                            |
                    Current / Preferred
                            |
                         Radius
                            |
                        Explore
                            |
                     +------+------+
                     |             |
                  Activity      Create
                   Search      Activity
                     |             |
                  Details       Publish
                     |             |
                    Join        Players
                     |             |
                My Activities   Manage
                     |             |
                    Chat        Complete
                     |             |
                  Attend       Ratings
                     |
                 Complete
                     |
                   Rating
```

---

# 74. Critical MVP User Flows

The following flows are mandatory for the first working MVP:

## Flow A — Registration

```text
Register
→ Create Account
→ Verification
→ Profile Setup
→ Explore
```

## Flow B — Location Setup

```text
Location
→ Current / Preferred
→ Select Radius
→ Explore
```

## Flow C — Discover Activity

```text
Explore
→ Select Sport
→ Filter
→ Activity Results
→ Activity Details
```

## Flow D — Join Activity

```text
Activity Details
→ Join
→ Backend Validation
→ Participant Added
→ My Activities
```

## Flow E — Leave Activity

```text
My Activities
→ Activity
→ Leave
→ Confirm
→ Participant Removed
```

## Flow F — Create Activity

```text
Create
→ Enter Details
→ Review
→ Publish
→ Activity Available
```

## Flow G — Host Management

```text
My Activities
→ Hosted
→ Select Activity
→ View Participants
→ Manage
```

---

# 75. User Flow Rules

The following rules apply to all user flows.

## Rule 1

Important actions must require authentication.

## Rule 2

The backend must validate important actions.

## Rule 3

Users must receive clear feedback after important actions.

## Rule 4

Users should be able to recover from common errors.

## Rule 5

The application should avoid unnecessary steps.

## Rule 6

Location must be permission-based.

## Rule 7

A user's exact location should not automatically be exposed.

## Rule 8

A user cannot join an activity that is full, cancelled, or already started.

## Rule 9

A user cannot join the same activity twice.

## Rule 10

A host cannot normally leave their own activity.

## Rule 11

A host can cancel their activity.

## Rule 12

Cancelled activities should not remain available for new joins.

## Rule 13

The same core functionality must work across mobile, tablet, and desktop.

---

# 76. User Flow Dependencies

The flows depend on the following systems:

```text
Authentication
     ↓
User Profile
     ↓
Location
     ↓
Sports
     ↓
Activities
     ↓
Participants
     ↓
Maps
     ↓
Communication
     ↓
Notifications
     ↓
Ratings / Reputation
```

The MVP can initially implement the first six core systems before adding advanced communication and reputation features.

---

# 77. MVP Flow Priority

## Priority 1 — Essential

- Registration
- Login
- Profile
- Sports
- Location
- Radius
- Explore
- Activity creation
- Activity details
- Join
- Leave
- Participant count

## Priority 2 — Important

- Maps
- Bookmarks
- Notifications
- Basic chat
- Activity history

## Priority 3 — Post-MVP

- Ratings
- Attendance
- Reputation
- Reports
- Blocking
- Advanced moderation
- Turf booking
- Payments
- AI recommendations

---

# 78. Final User Flow Definition

The SquadUp experience should ultimately feel like:

```text
I want to play.
       ↓
Open SquadUp.
       ↓
Find nearby activities.
       ↓
Choose a game.
       ↓
Join the squad.
       ↓
Communicate.
       ↓
Play.
       ↓
Come back for the next game.
```

The product should make this journey simple, fast, safe, and understandable.

**Find your squad. Play your game.**
