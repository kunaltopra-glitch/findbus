# Find Bus

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Full-stack Haryana Roadways bus tracking web app
- Home page with hero section, about section, smooth animations
- Find Bus page: route selection form (From/To dropdowns, 3 demo routes), redirects to bus timing page
- Bus Selection page: 3 demo bus timings per route, each with "Find Bus" button
- Live Bus Details page: bus number, driver/conductor IDs, bus type, ETA, current speed (simulated), animated vertical route timeline with bus icon moving upward on interval
- Book Tickets page: same route selection flow, leads to bus details, then payment
- Payment page: UPI and Debit/Credit Card options, simulated payment success, ticket confirmation with Ticket ID
- AI Bot page: chat input, JavaScript-based chatbot logic, Web Speech API voice response for queries like "Where is my bus?" / "What is ETA?"
- Admin page at /admin: add bus, add route, update timing (hidden, simple)
- Sticky header with nav: Home | Find Bus | Book Ticket | AI Bot | Customer Support, hamburger menu on mobile
- Dark footer with contact details, social icons (Instagram, LinkedIn, Twitter, YouTube), "Designed By Kunal Pandit"
- Blue + Orange transport gradient theme, FontAwesome icons, smooth hover transitions

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Backend: Store routes, buses, timings data; expose query endpoints for routes, buses by route, bus details; store ticket bookings
2. Frontend:
   - Global layout: sticky nav, footer
   - Home page: hero with 3 CTA buttons, about section with placeholder images
   - Find Bus / Book Ticket flow: route form → bus timing list → live bus details
   - Live Bus Details: animated vertical timeline, simulated GPS movement via setInterval
   - Payment page: form with UPI/card options, simulated success, ticket ID display
   - AI Bot page: chat UI, rule-based JS responses, Web Speech API for voice output
   - Admin page: simple forms to add/view buses and routes
