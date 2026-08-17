# SquadUp — UI/UX Design System

**Document Version:** 1.0  
**Project:** SquadUp  
**Design Direction:** Minimal, Clean, Modern, Sporty  
**Primary Platforms:** Smartphone, Tablet, Desktop

---

# 1. Design Goal

SquadUp should have a simple and professional interface that allows users to quickly:

```text
Find a sport
      ↓
Choose location
      ↓
Set search radius
      ↓
Discover nearby activities
      ↓
Open activity
      ↓
Join the squad
```

The interface should prioritize:

- Simplicity
- Speed
- Readability
- Easy navigation
- Clear actions
- Responsive design
- Accessibility
- Consistent components

Avoid unnecessary visual complexity.

---

# 2. Overall Visual Style

The design should be:

```text
Minimal
+
Modern
+
Sporty
+
Friendly
+
Professional
```

Avoid:

- Heavy gradients
- Excessive animations
- Glassmorphism everywhere
- Excessive shadows
- Too many colors
- Overly rounded interfaces
- Crowded screens

---

# 3. Color System

Use a neutral base with one primary accent color.

## Background

```text
#F7F7F5
```

Use for the main application background.

## Primary

```text
#111111
```

Use for:

- Main headings
- Important text
- Primary navigation
- Strong UI elements

## Secondary Text

```text
#6B7280
```

Use for:

- Supporting text
- Metadata
- Descriptions
- Secondary labels

## Accent Blue

```text
#2563EB
```

Use for:

- Primary buttons
- Active navigation
- Links
- Selected filters
- Important interactive states

## Card Background

```text
#FFFFFF
```

## Border

```text
#E5E7EB
```

## Success

```text
#16A34A
```

## Warning

```text
#F59E0B
```

## Error

```text
#DC2626
```

---

# 4. Color Usage Rule

Do not use every color on every page.

Recommended:

```text
Background → #F7F7F5
Cards      → #FFFFFF
Text       → #111111
Secondary  → #6B7280
Accent     → #2563EB
Borders    → #E5E7EB
```

Status colors should only appear when necessary.

---

# 5. Typography

Use a clean sans-serif font.

Recommended:

```text
Inter
```

Fallback:

```text
Arial, sans-serif
```

Typography hierarchy:

```text
H1 → 36–48px
H2 → 28–36px
H3 → 20–24px
Body → 15–17px
Small → 13–14px
```

For mobile, reduce heading sizes appropriately.

---

# 6. Font Weight

Use:

```text
Regular → 400
Medium  → 500
Semibold → 600
Bold → 700
```

Avoid excessive bold text.

---

# 7. Spacing System

Use a consistent spacing scale:

```text
4px
8px
12px
16px
24px
32px
48px
64px
```

Prefer multiples of 4 or 8.

---

# 8. Border Radius

Use moderate rounding.

Recommended:

```text
Buttons → 8px
Inputs → 8px
Cards → 12px
Modals → 12px
Images → 12px
```

Avoid extremely rounded pill-shaped layouts except where useful for tags and filters.

---

# 9. Shadows

Use subtle shadows only when necessary.

Example:

```text
box-shadow:
0 2px 8px rgba(0,0,0,0.06);
```

Prefer borders for most cards instead of strong shadows.

---

# 10. Layout Principles

Every page should have:

```text
Clear hierarchy
Generous spacing
Consistent alignment
Simple navigation
Visible primary action
```

Avoid filling every available space.

---

# 11. Desktop Layout

Recommended maximum content width:

```text
1200px
```

Example:

```text
┌────────────────────────────────────────────────────┐
│ SQUADUP                         Explore  Profile    │
├────────────────────────────────────────────────────┤
│                                                    │
│ Find your next game                                │
│                                                    │
│ [ Location ] [ Radius ] [ Sport ]                  │
│                                                    │
│ Nearby activities                                  │
│                                                    │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Activity     │ │ Activity     │ │ Activity     │ │
│ │ Card         │ │ Card         │ │ Card         │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

# 12. Tablet Layout

Use:

```text
2-column cards
```

where appropriate.

Navigation should remain simple.

Example:

```text
┌──────────────────────────────────────────┐
│ SQUADUP                    Profile       │
├──────────────────────────────────────────┤
│ Find your next game                      │
│                                          │
│ [Location] [Radius]                      │
│ [Sport]   [Filters]                      │
│                                          │
│ ┌────────────────┐ ┌────────────────┐   │
│ │ Activity       │ │ Activity       │   │
│ └────────────────┘ └────────────────┘   │
└──────────────────────────────────────────┘
```

---

# 13. Mobile Layout

Mobile should be the primary responsive consideration.

Example:

```text
┌───────────────────────────┐
│ SQUADUP              ☰    │
├───────────────────────────┤
│ Find your next game       │
│                           │
│ 📍 Ottapalam              │
│                           │
│ Radius: 5 km              │
│                           │
│ [Football] [Cricket]      │
│                           │
│ Nearby activities         │
│                           │
│ ┌───────────────────────┐ │
│ │ Evening Football      │ │
│ │ 📍 2.4 km             │ │
│ │ 🕕 6:30 PM            │ │
│ │ 👥 7 / 10             │ │
│ │                       │ │
│ │             JOIN →    │ │
│ └───────────────────────┘ │
│                           │
│ Home Explore Create Me   │
└───────────────────────────┘
```

---

# 14. Navigation

Desktop:

```text
Logo
Explore
My Activities
Create Activity
Profile
```

Mobile:

```text
Home
Explore
Create
My Activities
Profile
```

Use a bottom navigation bar on mobile if it improves usability.

---

# 15. Logo

The SquadUp logo should be:

- Simple
- Recognizable
- Text-friendly
- Usable at small sizes

Recommended wordmark:

```text
SQUADUP
```

Avoid a complicated logo for the MVP.

---

# 16. Landing Page

Purpose:

Explain SquadUp quickly and encourage users to explore.

Structure:

```text
Header
   ↓
Hero
   ↓
How SquadUp Works
   ↓
Popular Sports
   ↓
Why SquadUp
   ↓
Call To Action
   ↓
Footer
```

---

# 17. Landing Hero

Suggested content:

```text
Find your game.
Find your squad.

Discover nearby sports activities,
join local players, and get in the game.

[Explore Games]
[Create a Game]
```

The final marketing copy can be refined later.

---

# 18. Login Page

Simple structure:

```text
Logo

Welcome back

Email
[________________]

Password
[________________]

[ Login ]

Forgot password?

Don't have an account?
Create account
```

Avoid unnecessary fields.

---

# 19. Registration Page

Fields:

```text
Full Name
Email
Phone
Password
Confirm Password
```

Primary button:

```text
Create Account
```

Keep registration simple.

Additional profile information can be collected after registration.

---

# 20. Onboarding

After registration:

```text
Create Account
      ↓
Choose Sports
      ↓
Choose Skill Levels
      ↓
Set Preferred Location
      ↓
Choose Search Radius
      ↓
Explore SquadUp
```

Do not force too many questions during onboarding.

---

# 21. Location Permission

When location is needed:

```text
Use your location?

Find nearby games and activities around you.

[Allow Location]
[Choose Location Manually]
```

The user must be able to continue without granting location permission.

---

# 22. Location Selection

Screen:

```text
Choose your location

[ Search location... ]

Recent / Preferred Locations

Ottapalam
Palakkad
Kochi

[Use Current Location]
```

---

# 23. Radius Selector

Simple control:

```text
Search radius

○ 1 km
○ 2 km
● 5 km
○ 10 km
○ 15 km
```

Alternative:

```text
[ 5 km ─────────● ]
```

Maximum:

```text
15 km
```

---

# 24. Explore Page

The Explore page is the main SquadUp experience.

Structure:

```text
Header
Location
Search radius
Sports
Filters
Map/List option
Activity results
```

---

# 25. Explore Header

Example:

```text
Find your next game

📍 Ottapalam
Within 5 km
```

Allow users to change location easily.

---

# 26. Sport Selector

Popular sports can appear as compact buttons:

```text
[ Football ]
[ Cricket ]
[ Badminton ]
[ Basketball ]
[ Volleyball ]
[ More ]
```

Selected:

```text
[ Football ✓ ]
```

Use the accent blue for selected state.

---

# 27. Filters

Possible filters:

```text
Sport
Date
Time
Distance
Skill Level
Price
Available Slots
```

On mobile, open filters in a bottom sheet or modal.

---

# 28. Activity Card

Each activity card should show:

```text
Sport
Activity title
Distance
Date
Time
Location
Skill level
Participants
Available slots
Price
Join action
```

Example:

```text
┌───────────────────────────────────┐
│ ⚽ Football                       │
│                                   │
│ Evening Football                  │
│ 📍 2.4 km away                    │
│ 🕕 Today · 6:30 PM                │
│ 🎯 Intermediate                   │
│ 👥 7 / 10                         │
│                                   │
│ ₹150                 [ JOIN ]     │
└───────────────────────────────────┘
```

---

# 29. Activity Card Rules

The card should not contain too much information.

Prioritize:

```text
What?
Where?
When?
How many?
How much?
Join
```

Everything else can appear on the details page.

---

# 30. Activity Details

Structure:

```text
Back

Football

Evening Football

Date
Time
Duration

Location
Map

About this activity

Skill level

Participants

Host

Price

[ JOIN ACTIVITY ]
```

---

# 31. Activity Details Primary Action

The primary action should be visually obvious.

Possible states:

```text
JOIN ACTIVITY
JOINED
FULL
CANCELLED
STARTED
```

Examples:

```text
[ JOIN ACTIVITY ]
```

or:

```text
[ ✓ JOINED ]
```

---

# 32. Participants

Display:

```text
7 / 10 players
```

Use avatars when available.

Example:

```text
👤 👤 👤 👤 👤 +2

7 / 10 players
```

Avoid exposing unnecessary personal information.

---

# 33. Host Information

Example:

```text
Hosted by

Profile Image
User Name
```

Future:

```text
Rating
Games hosted
```

These can be added later.

---

# 34. Create Activity

The creation process should be simple.

```text
Create Activity

Sport
[ Football ▼ ]

Title
[ Evening Football ]

Date
[ Select date ]

Time
[ Select time ]

Duration
[ 90 min ]

Location
[ Choose location ]

Skill Level
[ Intermediate ▼ ]

Players
[ 10 ]

Price
[ ₹150 ]

Description
[ Optional ]

[ CREATE ACTIVITY ]
```

---

# 35. Create Activity Validation

Show errors close to the field.

Example:

```text
Maximum players
[ -2 ]

Maximum players must be greater than 0.
```

Avoid showing all errors only at the top.

---

# 36. My Activities

Structure:

```text
My Activities

[ Hosting ] [ Joined ]

Upcoming

Activity Card
Activity Card

Past

Activity Card
```

---

# 37. Profile

Structure:

```text
Profile Image

Name
Email

Sports
Football
Cricket
Badminton

Skill Levels

Preferred Location

[ Edit Profile ]
```

---

# 38. Settings

Include:

```text
Account
Location
Notifications
Privacy
Security
Help
Logout
```

Keep settings grouped into clear sections.

---

# 39. Loading States

Use simple skeletons or spinners.

Example:

```text
┌───────────────────────────┐
│ ███████████               │
│ ██████                    │
│ ████████████              │
└───────────────────────────┘
```

Avoid blocking the entire screen unnecessarily.

---

# 40. Empty States

Example:

```text
No games nearby

There are no activities within 5 km.

[Increase Radius]
[Create a Game]
```

---

# 41. Error States

Example:

```text
Something went wrong.

We couldn't load nearby activities.

[Try Again]
```

Keep error messages simple.

---

# 42. Success Feedback

After joining:

```text
✓ You're in!

You've joined Evening Football.
```

Use a toast or small confirmation message.

---

# 43. Buttons

Primary:

```text
Background: #2563EB
Text: #FFFFFF
Radius: 8px
```

Secondary:

```text
Background: #FFFFFF
Text: #111111
Border: #E5E7EB
Radius: 8px
```

Danger:

```text
Background: #DC2626
Text: #FFFFFF
```

---

# 44. Button Hierarchy

Each screen should have one clear primary action.

Example:

Create Activity:

```text
Primary → CREATE ACTIVITY
Secondary → CANCEL
```

Activity Details:

```text
Primary → JOIN ACTIVITY
Secondary → Back
```

---

# 45. Inputs

Inputs should be:

```text
Height: approximately 44–48px
Border: #E5E7EB
Radius: 8px
Background: #FFFFFF
```

Focus state:

```text
Border: #2563EB
```

---

# 46. Search Box

Example:

```text
🔍 Search sports, games or locations
```

Use a clear icon and sufficient padding.

---

# 47. Cards

Cards should use:

```text
Background: #FFFFFF
Border: #E5E7EB
Radius: 12px
Padding: 16–20px
```

Avoid heavy shadows.

---

# 48. Badges

Use badges for:

```text
Skill level
Sport
Status
Availability
```

Example:

```text
[ Intermediate ]
```

Badges should be compact.

---

# 49. Maps

Map should be used mainly for:

```text
Activity location
Nearby activity discovery
Location selection
```

Avoid making the map dominate every screen.

For mobile, list view can be the default and map can be an optional view.

---

# 50. Explore Map/List Toggle

Example:

```text
[ List ] [ Map ]
```

List:

```text
Activity Cards
```

Map:

```text
Map
+
Activity markers
```

---

# 51. Mobile Navigation

Recommended:

```text
┌──────────────────────────┐
│ Home Explore + My Profile│
└──────────────────────────┘
```

The Create button can be visually emphasized.

Possible structure:

```text
Home
Explore
Create
My Activities
Profile
```

---

# 52. Desktop Navigation

Recommended:

```text
SQUADUP

Explore
My Activities
Create Activity

                    Profile
```

Keep the header clean.

---

# 53. Responsive Rules

## Mobile

```text
1 column
Full-width controls
Bottom navigation
Large touch targets
Compact cards
```

## Tablet

```text
2 columns
Flexible navigation
Medium card widths
```

## Desktop

```text
2–3 columns
Maximum content width
Full navigation
Optional map panel
```

---

# 54. Touch Targets

Interactive controls should have sufficiently large touch areas.

Target:

```text
approximately 44px or larger
```

Avoid tiny buttons.

---

# 55. Accessibility

The UI should include:

- Semantic HTML
- Labels for form inputs
- Keyboard navigation
- Visible focus states
- Sufficient contrast
- Alt text for meaningful images
- Accessible buttons
- Accessible error messages

---

# 56. Icons

Use a consistent icon library.

Icons should:

- Be simple
- Have consistent stroke style
- Support accessibility
- Not replace important text unnecessarily

Examples:

```text
Location
Calendar
Clock
Users
Search
Filter
Map
Settings
```

---

# 57. Animation

Keep animations subtle.

Use:

```text
150–250ms
```

for simple transitions.

Good examples:

```text
Button hover
Card hover
Modal opening
Filter selection
Toast appearance
```

Avoid:

```text
Large page animations
Constant movement
Excessive bouncing
```

---

# 58. Hover States

Desktop cards can have a subtle hover effect:

```text
border becomes slightly stronger
or
small elevation
```

Do not dramatically change the card.

---

# 59. Focus States

Keyboard users should clearly see focus.

Example:

```text
outline: 2px solid #2563EB;
outline-offset: 2px;
```

---

# 60. Mobile Performance

Avoid:

- Huge images
- Unnecessary animations
- Heavy JavaScript packages
- Large background videos
- Loading everything at once

Prioritize fast initial rendering.

---

# 61. Image Guidelines

Activity images should be:

- Optimized
- Responsive
- Properly cropped
- Lazy-loaded when appropriate

Use consistent aspect ratios.

---

# 62. Design Tokens

Define reusable CSS variables.

Example:

```css
:root {
  --color-background: #F7F7F5;
  --color-primary: #111111;
  --color-secondary: #6B7280;
  --color-accent: #2563EB;
  --color-card: #FFFFFF;
  --color-border: #E5E7EB;
  --color-success: #16A34A;
  --color-warning: #F59E0B;
  --color-error: #DC2626;

  --radius-sm: 8px;
  --radius-md: 12px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
}
```

---

# 63. Component System

Create reusable components:

```text
Button
Input
Select
Modal
Toast
Badge
Card
Avatar
Navbar
BottomNavigation
ActivityCard
ActivityList
FilterPanel
LocationPicker
RadiusSelector
SportSelector
Map
LoadingState
EmptyState
ErrorState
```

---

# 64. Component Rule

Do not create different versions of the same component unnecessarily.

Bad:

```text
BlueButton
BigBlueButton
SmallBlueButton
JoinButton
CreateButton
```

Better:

```text
Button
```

with variants:

```text
primary
secondary
danger
```

---

# 65. Page Component Structure

Example:

```text
ExplorePage
│
├── Header
├── LocationSelector
├── RadiusSelector
├── SportSelector
├── FilterPanel
├── ViewToggle
└── ActivityList
    └── ActivityCard
```

---

# 66. User Flow — New User

```text
Landing
  ↓
Register
  ↓
Choose Sports
  ↓
Choose Skill
  ↓
Location
  ↓
Radius
  ↓
Explore
```

---

# 67. User Flow — Returning User

```text
Login
  ↓
Home
  ↓
Current / Preferred Location
  ↓
Nearby Activities
  ↓
Filter
  ↓
Activity Details
  ↓
Join
```

---

# 68. User Flow — Create Activity

```text
Home
  ↓
Create
  ↓
Choose Sport
  ↓
Activity Details
  ↓
Location
  ↓
Date / Time
  ↓
Players / Price
  ↓
Review
  ↓
Create
  ↓
Activity Details
```

---

# 69. User Flow — Join

```text
Explore
  ↓
Activity Card
  ↓
Activity Details
  ↓
Join Activity
  ↓
Confirmation
  ↓
My Activities
```

---

# 70. User Flow — Leave

```text
My Activities
  ↓
Activity
  ↓
Leave Activity
  ↓
Confirmation
  ↓
Status Updated
```

---

# 71. Design for Trust

SquadUp connects people for real-world activities.

The interface should therefore clearly show:

```text
Host
Location
Time
Participant count
Activity status
```

Avoid hiding important activity information behind unnecessary interactions.

---

# 72. Safety-Oriented UI

Future features can include:

```text
Report
Block
Activity cancellation
User verification
Community guidelines
```

These should be accessible without making the main UI complicated.

---

# 73. Search Experience

Search should feel immediate.

User:

```text
Choose Football
```

Then:

```text
Nearby football activities
```

Filters should update results without requiring unnecessary navigation.

---

# 74. Location UX Rule

Always make the active search area visible.

Example:

```text
📍 Ottapalam · 5 km
```

This prevents users from accidentally searching the wrong location.

---

# 75. Radius UX Rule

The current radius should always be understandable.

Example:

```text
Within 5 km
```

Avoid displaying only:

```text
5
```

---

# 76. Activity Availability

Show available slots clearly.

Example:

```text
7 / 10 players
3 spots left
```

If full:

```text
10 / 10 players
FULL
```

---

# 77. Activity Status

Possible statuses:

```text
DRAFT
PUBLISHED
FULL
CANCELLED
COMPLETED
```

The UI should represent status consistently.

---

# 78. Responsive Activity Card

Desktop:

```text
Horizontal or 3-column card
```

Mobile:

```text
Full-width vertical card
```

Do not simply shrink the desktop card.

---

# 79. Responsive Forms

Desktop:

```text
2-column form where appropriate
```

Mobile:

```text
1-column form
```

Primary button:

```text
Full width on mobile
```

---

# 80. Design Consistency Rules

Use the same:

```text
Button style
Input style
Card style
Spacing
Typography
Icons
Colors
Border radius
```

across all pages.

---

# 81. Avoid UI Overload

Do not put every feature on the home page.

Home should focus on:

```text
Location
Sports
Nearby activities
Create activity
```

Advanced options belong in filters/settings.

---

# 82. MVP Screens

The first version should implement:

```text
1. Landing
2. Login
3. Register
4. Onboarding
5. Home / Explore
6. Location selection
7. Activity details
8. Create activity
9. My activities
10. Profile
11. Settings
```

---

# 83. Phase 2 Screens

Later:

```text
Notifications
Chat
Bookmarks
Ratings
Reports
Blocked users
Admin dashboard
```

---

# 84. Design System Implementation

The frontend should centralize design values rather than repeating values everywhere.

Use:

```text
CSS variables
Reusable components
Reusable layout components
Reusable form controls
```

This allows the entire application design to be changed quickly.

---

# 85. AI Implementation Rule

When asking Antigravity to implement the UI, provide:

```text
Read:
docs/01-product-requirements.md
docs/02-user-flows.md
docs/03-features.md
docs/04-database-design.md
docs/05-api-design.md
docs/06-ui-ux-design.md
```

Then specify:

```text
Implement only the requested screen.
Follow the design tokens.
Use reusable components.
Make it responsive.
Do not introduce a different visual style.
Do not modify unrelated features.
```

---

# 86. UI Review Checklist

Before accepting a screen:

```text
[ ] Works on mobile
[ ] Works on tablet
[ ] Works on desktop
[ ] Clear primary action
[ ] Good spacing
[ ] Consistent typography
[ ] Correct colors
[ ] Accessible labels
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] No unnecessary animation
[ ] No horizontal overflow
```

---

# 87. Final Design Direction

SquadUp should look like:

```text
Clean
Minimal
Neutral
Sporty
Modern
Professional
```

Core visual formula:

```text
Soft off-white background
        +
White cards
        +
Near-black typography
        +
Blue accent
        +
Subtle borders
        +
Generous spacing
        +
Simple icons
```

---

# 88. Final Color Summary

```text
Background  #F7F7F5
Primary     #111111
Secondary   #6B7280
Accent      #2563EB
Card        #FFFFFF
Border      #E5E7EB
Success     #16A34A
Warning     #F59E0B
Error       #DC2626
```

---

# 89. Final UI Principle

Every screen should answer:

```text
What can I do here?
```

within a few seconds.

For SquadUp:

```text
Find a game.
Join a squad.
Create a game.
```

The design should make those actions obvious without overwhelming the user.

---

# 90. Final Rule

Build the UI around the user journey, not around the number of features.

The most important experience is:

```text
LOCATION
   ↓
SPORT
   ↓
NEARBY GAME
   ↓
DETAILS
   ↓
JOIN
```

Everything else should support this journey.
