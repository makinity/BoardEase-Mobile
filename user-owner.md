# User Owner Mobile Analysis

This document analyzes the current C# repository as the existing Admin desktop portal for BoardEase and translates it into a mobile-first architecture for a future React Native Expo app supporting `Owner` and `Occupant` users.

Where the repo does not expose a public API layer, the mobile recommendations below are inferred from the WinForms presenters, services, repositories, model names, navigation catalog, and the user manual.

## 1. Executive Summary

### System Purpose

BoardEase is a role-based boarding house management system for managing properties, rooms, occupants, reservations, rentals, billing, collections, subscriptions, reports, and account access.

### Business Domain

The domain is boarding house operations and tenant lifecycle management:

- Property and room inventory
- Reservation handling
- Rental lifecycle tracking
- Billing, collections, and payment posting
- Occupant self-service
- Owner operational management
- Admin platform oversight

### Main Actors

- `Admin`: platform operator and system administrator
- `Owner`: property operator and billing manager
- `Occupant`: tenant/resident using self-service features

### Current Architecture

- Desktop application built with `C#` and `Windows Forms`
- MVP-style separation using presenters, views, services, and repositories
- Direct MySQL access through repository classes
- Role-specific sidebar navigation and module loading
- Local `WebView2`-backed HTML assets for maps, location picking, camera capture, and browser-based payment flows
- Separate notification server project using SignalR-style hub/repository structure
- File-based runtime overrides for database connection profiles

### Proposed Mobile Architecture

- `React Native` + `Expo Router`
- Role-based app shells for `Owner` and `Occupant`
- Shared auth, notifications, profile, upload, and utility modules
- `Supabase Auth` for login/session management
- `Supabase Storage` for photos, receipts, proofs, and attachments
- `Supabase PostgreSQL` as the mobile data backend
- `Realtime` for notifications, payment updates, reservation status changes, and owner/occupant activity feeds
- Push notifications through FCM/Expo push integration
- A thin API layer or edge functions to preserve business rules that currently live in desktop services and repositories

### Important Boundary

The desktop repository contains strong admin-only functionality that should not be mirrored in the mobile app:

- Database backup and restore
- User account administration
- System profile editing
- Subscription administration
- Audit log review
- Platform-wide boarding house oversight

Those remain admin/desktop responsibilities. The mobile app should focus on Owner and Occupant workflows.

## 2. Sidebar Extraction

The current navigation is fully role-based through `NavigationCatalog` and `NavigationKeys`.

| Sidebar Item | Purpose | Mobile Equivalent | Role |
| --- | --- | --- | --- |
| Dashboard | Summary and KPIs for the current role | Dashboard home screen | Shared |
| Boarding Houses | Platform monitoring of properties | Property list and property detail | Admin |
| BH Owners | Manage owner profiles and linked records | Not in mobile; admin-only | Admin |
| Subscriptions | Track owner subscription status | Not in mobile; admin-only | Admin |
| Audit Logs | Review system activity and security events | Not in mobile; admin-only | Admin |
| Reports | Export management reports | Not in mobile; admin-only | Admin |
| Settings | Admin settings hub | Not in mobile; admin-only | Admin |
| System Profile | Edit platform profile metadata | Not in mobile; admin-only | Admin |
| Database | Connection, backup, restore, and export tools | Not in mobile; admin-only | Admin |
| User Accounts | Manage platform users | Not in mobile; admin-only | Admin |
| My BH | Owner-owned boarding house management | Properties | Owner |
| Rooms | Manage room inventory | Rooms | Owner |
| My Reservations | Owner reservation workflow | Reservations | Owner |
| Occupants | Occupant records and payment history | Occupants | Owner |
| Rentals | Active and historical rental management | Rentals | Owner |
| Payments and Income | Post payments, review income, reconcile collections | Payments / Income | Owner |
| Collectables | Outstanding receivables across properties | Collections / Collectables | Owner |
| Profile | Owner account maintenance | Profile | Owner |
| Browse BH | Search and inspect boarding houses | Browse Properties | Occupant |
| Reservations | Occupant reservation tracking | Reservations | Occupant |
| Rentals | Occupant stay and rental history | Rentals | Occupant |
| My Bills | Occupant billing and payment review | Bills / Payments | Occupant |
| History | Occupant history and exported statements | History | Occupant |
| Profile | Occupant account maintenance | Profile | Occupant |

### Sidebar Interpretation

- Admin menus are desktop-only control surfaces.
- Owner and Occupant menus map cleanly to mobile tabs and detail stacks.
- `Dashboard`, `Profile`, and `Notifications` should be shared patterns in the mobile app even when the underlying data differs by role.

## 3. Role Analysis

### Occupant

Occupant-facing modules in the repo:

- Dashboard
- Browse BH
- Reservations
- Rentals
- My Bills / Payments
- History
- Profile

Allowed actions:

- Sign in and manage session
- Browse boarding houses and available rooms
- View room and property details
- Submit reservations
- Track reservation state
- View current rental and rental history
- Review charges, balances, and payment history
- Submit payments through hosted checkout or proof-based flow
- Review notifications and status changes
- Update profile and password

Accessible screens:

- Auth/login
- Occupant home dashboard
- Browse BH landing and property detail screens
- Reservation list and reservation detail screens
- Rental detail screens
- Bills and payment screens
- History screens
- Profile screens

Notifications:

- Reservation approved, rejected, or cancelled
- Rental created, transferred, or ended
- Payment received or pending review
- Bill generation and due reminders
- General system notifications

Requests:

- Reservation submission
- Reservation cancellation
- Payment submission
- Payment proof upload
- Profile update
- Password change

Transactions:

- Payment history
- Bill review
- Outstanding balance review
- Hosted checkout payment flow

### Owner

Owner-facing modules in the repo:

- Dashboard
- My BH
- Rooms
- My Reservations
- Occupants
- Rentals
- Payments and Income
- Collectables
- Reports
- Profile

Allowed actions:

- Manage owned boarding houses
- Create/edit/delete properties
- Manage rooms and room status
- Review and act on reservations
- Approve, reject, cancel, check in, and convert reservations to rentals
- Manage occupants linked to owned properties
- Review rental history and active stays
- Post or confirm payments
- Review pending payment submissions
- Void payments and manage charges
- Inspect receivables and collections
- Export reports and operational lists
- Update owner profile and password

Accessible screens:

- Auth/login
- Owner home dashboard
- Property management screens
- Room management screens
- Reservation screens
- Occupant detail screens
- Rental management screens
- Payments and income screens
- Collectables screens
- Reports screens
- Profile screens

Notifications:

- New reservation request
- Reservation approved or rejected
- Rental status changes
- Payment submitted, approved, rejected, or voided
- Outstanding balances and collection alerts
- Occupant lifecycle or occupancy changes

Reports:

- Monthly income summary
- Occupancy and rental summaries
- Reservation summaries
- Collection summaries
- Property performance snapshots

Property management functions:

- Add/edit boarding houses
- Select map location
- Upload property image
- Manage rooms
- Review occupant assignments
- Monitor collections and payments

### Admin

Admin is a system actor but not a target role for the mobile app. It remains a desktop or web portal role for:

- Platform-wide oversight
- Owner profile management
- Subscription management
- Audit and compliance review
- Database operations
- User account administration
- System profile maintenance

## 4. Mobile App Modules

### Authentication

- Purpose: sign in, sign out, and create occupant accounts
- User roles: Shared, Occupant, Owner
- Required APIs: auth login, logout, register occupant, session refresh, me
- Main screens: login, register, forgot/reset password, connection/profile selection if retained

### Dashboard

- Purpose: role-specific summary and quick actions
- User roles: Owner, Occupant
- Required APIs: dashboard summary, notifications summary, recent activity
- Main screens: owner dashboard, occupant dashboard

### Properties

- Purpose: browsing for occupants and property management for owners
- User roles: Owner, Occupant
- Required APIs: property list, property detail, map search, image upload, availability lookup
- Main screens: browse list, property detail, map view, property edit

### Rooms

- Purpose: room inventory and availability
- User roles: Owner, Occupant
- Required APIs: room list, room detail, room status, room availability
- Main screens: room list, room detail, room create/edit

### Reservations

- Purpose: reservation submission and lifecycle tracking
- User roles: Owner, Occupant
- Required APIs: reservation CRUD, approve/reject/cancel, status history
- Main screens: reservation list, reservation detail, create reservation, review reservation

### Rentals

- Purpose: active stay and historical rental management
- User roles: Owner, Occupant
- Required APIs: rental list, rental detail, transfer rental, end rental, timeline
- Main screens: current rental, rental history, rental detail, transfer flow, end rental flow

### Billing and Payments

- Purpose: bill review, collection, payment posting, and reconciliation
- User roles: Owner, Occupant
- Required APIs: bill list, charge list, payment list, create payment, submit proof, approve payment, void payment
- Main screens: bills, payment history, payment checkout, pending review, receipts

### Collectables

- Purpose: outstanding balance review and collection workflow
- User roles: Owner
- Required APIs: receivables summary, overdue balances, drill-down into rental and billing detail
- Main screens: collection summary, collection detail

### Occupants

- Purpose: owner-side occupant management
- User roles: Owner
- Required APIs: occupant list, occupant detail, payment history, profile update
- Main screens: occupant list, occupant detail

### History

- Purpose: occupant history and exported statements
- User roles: Occupant
- Required APIs: history list, export statements, transaction detail
- Main screens: history list, history detail, export action

### Profile

- Purpose: account maintenance and password changes
- User roles: Owner, Occupant
- Required APIs: profile get/update, password change, avatar upload
- Main screens: profile view/edit, password change

### Notifications

- Purpose: in-app activity feed and unread alerts
- User roles: Owner, Occupant
- Required APIs: list notifications, mark read, mark all read, realtime subscription
- Main screens: notification inbox, notification detail

### Reports

- Purpose: owner report snapshots and exports
- User roles: Owner
- Required APIs: report list, report detail, export PDF/CSV
- Main screens: report dashboard, report detail, export preview

### Shared Utilities

- Purpose: reusable mobile features
- User roles: Shared
- Required APIs: upload service, map lookup, media capture, file picker, connectivity check
- Main screens: image picker, camera capture, map preview, empty state overlays

## 5. Mobile Navigation Plan

### Auth Stack

- Login
- Register occupant
- Forgot password
- Reset password
- Connection or environment selection, if the deployment still needs it

### Owner Stack

- Owner dashboard
- Properties
- Rooms
- Reservations
- Occupants
- Rentals
- Payments
- Collectables
- Reports
- Profile

### Occupant Stack

- Occupant dashboard
- Browse properties
- Property detail
- Reservations
- Rentals
- Bills and payments
- History
- Profile

### Shared Stack

- Notifications
- Receipt viewer
- Image picker
- Camera capture
- Map preview
- Loading and error screens

### Navigation Recommendation

- Use bottom tabs for the top 4 to 5 owner and occupant destinations
- Use nested stacks for detail, create, review, and edit flows
- Use modal presentation for payment checkout, map preview, and confirmation dialogs
- Avoid a full drawer as the primary mobile pattern unless the role has many secondary tools
- Keep admin-only surfaces out of the mobile route tree

## 6. React Native Folder Structure

Recommended Expo Router structure:

```text
app/
  _layout.tsx
  index.tsx
  (auth)/
    login.tsx
    register.tsx
    forgot-password.tsx
    reset-password.tsx
  (owner)/
    _layout.tsx
    dashboard.tsx
    properties/
      index.tsx
      [propertyId].tsx
      create.tsx
      edit.tsx
    rooms/
      index.tsx
      [roomId].tsx
      create.tsx
      edit.tsx
    reservations/
      index.tsx
      [reservationId].tsx
      create.tsx
      review.tsx
    occupants/
      index.tsx
      [occupantId].tsx
    rentals/
      index.tsx
      [rentalId].tsx
      transfer.tsx
      end.tsx
    payments/
      index.tsx
      [paymentId].tsx
      review.tsx
    collectables/
      index.tsx
      [rentalId].tsx
    reports/
      index.tsx
      [reportId].tsx
    profile.tsx
  (occupant)/
    _layout.tsx
    dashboard.tsx
    browse/
      index.tsx
      [propertyId].tsx
      [propertyId]/room/[roomId].tsx
    reservations/
      index.tsx
      [reservationId].tsx
      create.tsx
    rentals/
      index.tsx
      [rentalId].tsx
    bills/
      index.tsx
      [billId].tsx
      payment.tsx
    history/
      index.tsx
      [entryId].tsx
    profile.tsx
  (shared)/
    notifications.tsx
    receipt/[receiptId].tsx
    map-preview.tsx
    camera.tsx
    image-picker.tsx

src/
  components/
  features/
    auth/
    dashboard/
    properties/
    rooms/
    reservations/
    rentals/
    payments/
    collectables/
    reports/
    notifications/
    profile/
    uploads/
  services/
  hooks/
  store/
  types/
  constants/
  utils/
  api/
```

## 7. Screen Inventory

| Screen Name | Role | Purpose | Inputs | Outputs | APIs Used | Navigation Flow |
| --- | --- | --- | --- | --- | --- | --- |
| Login | Shared | Authenticate user and choose environment | username, password, connection mode | session, role redirect | auth login, system profile load | app start -> role home |
| Register Occupant | Occupant | Create a new occupant account | registration form fields | new account, validation messages | auth register | login -> register -> login |
| Owner Dashboard | Owner | Show owner summary | none or filters | KPIs, recent records | owner dashboard | auth -> owner dashboard |
| Occupant Dashboard | Occupant | Show occupant summary | none or filters | stay, bills, reservations, notifications | occupant dashboard | auth -> occupant dashboard |
| Properties List | Owner | Manage boarding houses | search, filters | property cards/list | property list | owner dashboard -> properties |
| Property Detail | Owner | Edit a property | property fields | updated property | property detail/update | properties -> detail |
| Browse Properties | Occupant | Explore available boarding houses | search, filters, map bounds | property list, room list | browse properties | occupant dashboard -> browse |
| Property Map Detail | Occupant | Inspect property location and rooms | property selection | map and room info | property detail, availability | browse -> detail |
| Rooms List | Owner | Manage rooms | property filter, status filter | room list | room list | owner -> rooms |
| Room Detail | Owner | Edit room data | room fields | updated room | room detail/update | rooms -> detail |
| Reservations List | Owner | Review and act on reservations | filters, search | reservation list | reservation list | owner -> reservations |
| Reservation Detail | Owner/Occupant | Inspect reservation status | selected reservation | reservation detail | reservation detail | reservations -> detail |
| Create Reservation | Occupant | Submit a new room reservation | room, dates, notes | reservation record | reservation create | browse -> create reservation |
| Rentals List | Owner/Occupant | Track stays | filters | rental list | rental list | owner/occupant -> rentals |
| Rental Detail | Owner/Occupant | Inspect rental history and active stay | selected rental | detail, timeline, balance | rental detail | rentals -> detail |
| Payments | Owner | Post and reconcile collections | payment filters, payment form | payment list, receipt | payment CRUD | owner -> payments |
| Bills | Occupant | Review balances and payment history | rental, billing month | bills, charges, payment records | bill list, payment history | occupant -> bills |
| Payment Checkout | Occupant | Pay outstanding bill | amount, method, proof or payment intent | checkout result | create payment, submit proof | bills -> checkout |
| Collectables | Owner | Review unpaid balances | boarding house, month | receivables summary | receivables endpoint | owner -> collectables |
| Occupants | Owner | Manage occupant records | search, boarding house filter | occupant list and detail | occupant list/detail | owner -> occupants |
| History | Occupant | Review past actions and exported statements | history type, date range | history entries | history endpoints | occupant -> history |
| Reports | Owner | Review summary reports | date range, scope | report data, export file | report endpoints | owner -> reports |
| Profile | Owner/Occupant | Update account information | profile fields, password fields | updated profile | profile update, password change | role stack -> profile |
| Notifications | Owner/Occupant | Review alerts and actions | none | notification list | notifications list/read | shared modal or screen |

## 8. UI/UX Specification

### Authentication

- Mobile layout: full-screen sign-in card with role-aware branding and a single primary action
- User journey: open app, sign in, land on role dashboard, optionally complete registration for occupants
- Required components: text inputs, password toggle, segmented environment selector if still needed, primary button, status banner
- Empty states: no profile found, no database selected, registration incomplete
- Error states: invalid credentials, unreachable backend, weak password, duplicate username
- Loading states: app bootstrap, auth check, session refresh

### Dashboard

- Mobile layout: stacked metric cards, quick actions, recent activity feed
- User journey: land on role dashboard, jump to primary task, glance at current status
- Required components: cards, trend chips, list previews, action buttons
- Empty states: no recent activity, no current stay, no current property
- Error states: dashboard data unavailable, failed refresh
- Loading states: skeleton cards and list placeholders

### Properties and Browse

- Mobile layout: search bar, filter chips, map preview, scrollable property cards
- User journey: search property, open details, inspect rooms, reserve or edit
- Required components: cards, map preview, image gallery, tags, bottom sheet detail panel
- Empty states: no matching properties, no available rooms
- Error states: location lookup failure, image load failure, unavailable property data
- Loading states: skeleton list, shimmer map placeholder

### Rooms

- Mobile layout: property scoped room list with compact status rows
- User journey: select property, filter rooms, view detail, edit or reserve
- Required components: status chips, sortable list, numeric summary cards, form sheets
- Empty states: no rooms, no rooms matching filters
- Error states: invalid room data, save failure
- Loading states: list skeletons and inline spinners

### Reservations

- Mobile layout: list grouped by status with detail drill-in
- User journey: create reservation, wait for approval, track progress, cancel if allowed
- Required components: status timeline, action sheet, confirmation modal, date selector
- Empty states: no reservations yet
- Error states: reservation conflict, invalid dates, permission denied
- Loading states: detail skeletons, submitting spinner

### Rentals

- Mobile layout: active rental at top, history below
- User journey: inspect current stay, review billing context, view timeline, transfer or end rental for owner
- Required components: timeline, badges, summary cards, tabs
- Empty states: no active rental
- Error states: stale rental state, sync failure
- Loading states: progress skeletons

### Billing and Payments

- Mobile layout: bill summary header, charge list, payment actions anchored near the bottom
- User journey: inspect bill, choose payment method, submit proof or open hosted checkout, review receipt
- Required components: total due card, itemized charges, payment method picker, upload control, receipt view
- Empty states: no outstanding balance, no payment history
- Error states: payment failed, proof upload failed, checkout cancelled
- Loading states: processing indicator, upload progress, receipt generation spinner

### Notifications

- Mobile layout: inbox-style list with unread state and filters
- User journey: open notification, jump to linked screen, mark read
- Required components: notification cards, unread badge, mark-all-read action
- Empty states: no notifications
- Error states: realtime disconnect, fetch failure
- Loading states: pull-to-refresh and list skeletons

### Reports

- Mobile layout: report cards and drill-down tables rendered as grouped lists
- User journey: select scope, view summary, export if allowed
- Required components: filters, summary widgets, export button, accordions
- Empty states: no report data for the selected range
- Error states: export unavailable, backend error
- Loading states: table skeletons and progress bars

### Mobile Pattern Recommendations

- Bottom navigation should cover the 4 to 5 most frequent actions per role
- Tables should become card lists with expandable rows
- Dashboard widgets should emphasize counts, trend direction, and next action
- Search should remain sticky at the top of long lists
- Filters should be chips or bottom-sheet controls, not desktop-style toolbars
- Use large touch targets for payment and approval actions

## 9. Service Layer Extraction

The current repo uses direct repositories, so the mobile app needs an API layer. The names below are the practical mobile services to expose.

### `authService.ts`

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/auth/login` | Authenticate username/password and return session + role |
| POST | `/auth/logout` | Revoke session locally or server-side |
| POST | `/auth/register-occupant` | Create a new occupant account |
| GET | `/auth/me` | Return the current user and role |

Example payload:

```json
{
  "username": "jane.doe",
  "password": "********",
  "connectionMode": "Local"
}
```

### `profileService.ts`

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/profile/me` | Load the current user profile |
| PUT | `/profile/me` | Update profile details |
| PUT | `/profile/me/password` | Change password |
| POST | `/profile/me/avatar` | Upload profile image |

### `notificationService.ts`

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/notifications` | Fetch notification list |
| GET | `/notifications/unread-count` | Fetch unread badge count |
| PUT | `/notifications/{id}/read` | Mark one notification as read |
| PUT | `/notifications/read-all` | Mark all notifications as read |

### `propertyService.ts`

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/properties` | List properties visible to the role |
| GET | `/properties/{id}` | Get property detail |
| POST | `/properties` | Create a property |
| PUT | `/properties/{id}` | Update a property |
| DELETE | `/properties/{id}` | Delete a property |
| POST | `/properties/{id}/image` | Upload property image |
| POST | `/properties/{id}/location` | Save map coordinates |

### `maintenanceService.ts`

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/maintenance/rooms` | Fetch room maintenance status |
| PUT | `/maintenance/rooms/{id}` | Update maintenance state |
| GET | `/maintenance/work-orders` | List maintenance requests if added later |

### `paymentService.ts`

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/payments` | List payments |
| GET | `/payments/{id}` | Payment detail |
| POST | `/payments` | Create payment intent or manual submission |
| PUT | `/payments/{id}` | Update pending payment or void status |
| POST | `/payments/{id}/approve` | Approve a pending payment submission |
| POST | `/payments/{id}/reject` | Reject a pending payment submission |
| POST | `/payments/{id}/receipt` | Fetch or generate receipt data |

### Additional Required APIs

- `/dashboard/owner`
- `/dashboard/occupant`
- `/boarding-houses`
- `/boarding-houses/{id}/rooms`
- `/rooms`
- `/reservations`
- `/reservations/{id}/approve`
- `/reservations/{id}/reject`
- `/reservations/{id}/cancel`
- `/reservations/{id}/convert-to-rental`
- `/rentals`
- `/rentals/{id}/transfer`
- `/rentals/{id}/end`
- `/occupants`
- `/occupants/{id}`
- `/collectables`
- `/reports`
- `/uploads`

## 10. Database Entities

| Entity | Description | Relationships | Mobile Usage |
| --- | --- | --- | --- |
| User | Login identity record | Has one role; linked to owner or occupant profile | Auth, session, profile |
| Owner | Boarding house operator profile | Belongs to user; has many properties, rooms, rentals, payments | Owner workspace |
| Occupant | Resident/tenant profile | Belongs to user; linked to reservations, rentals, bills, payments | Occupant workspace |
| BoardingHouse | Managed property record | Has many rooms, reservations, rentals, occupants | Browse and manage properties |
| Room | Individual unit inside a boarding house | Belongs to boarding house; linked to reservations and rentals | Availability and assignment |
| Reservation | Request to reserve a room | Belongs to occupant and boarding house/room; may convert to rental | Reservation workflow |
| Rental | Active or historical stay record | Belongs to occupant, room, and boarding house | Current stay and history |
| Payment | Money movement or submitted proof | Belongs to rental, bill, and user | Bills and receipts |
| Bill | Billing period summary | Belongs to rental and occupant | Outstanding balance review |
| Charge | Itemized fee inside a bill | Belongs to bill | Charge breakdown |
| Collectable | Outstanding amount snapshot | Belongs to owner, boarding house, rental, bill | Receivables and collection |
| Subscription | Owner access coverage record | Belongs to owner/user | Admin-only in mobile, if exposed later |
| AuditLog | Security or activity record | Belongs to user/action context | Admin-only, desktop only |
| Notification | System message or status alert | Belongs to user and event | In-app alerts |
| SystemProfile | Platform branding and configuration | Global singleton-like record | Login branding, admin only edit |
| Attachment | Uploaded proof, image, or receipt | Belongs to payment, profile, property, or reservation | Media upload and display |

## 11. Supabase Migration Plan

### Recommended Mapping

- `Supabase Auth`: replace desktop login/session handling for mobile users
- `Supabase PostgreSQL`: host the operational schema for mobile-accessible entities
- `Supabase Storage`: store avatars, property images, receipt images, and payment proofs
- `Supabase Realtime`: stream reservation, payment, and notification updates
- `Push notifications`: integrate Expo push or FCM, triggered from backend events

### What Moves to Mobile

- Occupant self-service features
- Owner property management
- Reservation actions
- Rental review and transfer actions
- Bill viewing and payment submission
- Notification inbox
- Profile updates
- Media uploads

### What Stays in Admin

- Database backup and restore
- User account administration
- Subscription administration
- Audit log review
- System profile editing
- Platform-wide reports
- Cross-tenant oversight
- Owner support and compliance workflows

### What Needs Backend Refactoring

- Direct MySQL repository calls should be replaced or wrapped
- Payment checkout flows should move behind API endpoints
- Notification writes should be centralized
- File uploads should be normalized into storage objects and metadata rows
- Map/location data should be exposed through clean REST or RPC endpoints

### Suggested Supabase Tables / Policies

- Row level security by `user_id`, `owner_id`, and `occupant_id`
- Owner-only access to owned boarding houses and dependent records
- Occupant-only access to their own reservations, rentals, bills, and payments
- Admin-only access to audit, subscription, and system tables

## 12. API Contract Draft

### Shared APIs

#### `GET /auth/me`

```json
{
  "id": 12,
  "username": "owner01",
  "displayName": "Maria Cruz",
  "role": "Owner"
}
```

#### `GET /notifications`

```json
[
  {
    "id": 101,
    "title": "Payment received",
    "message": "Your payment for May 2026 has been recorded.",
    "isRead": false,
    "createdAt": "2026-06-10T09:00:00Z"
  }
]
```

### Occupant APIs

#### `GET /occupant/dashboard`

Returns occupant summary cards, active stay, bills, reservations, and recent activity.

#### `GET /occupant/boarding-houses`

Searches available boarding houses and room availability.

#### `POST /occupant/reservations`

```json
{
  "boardingHouseId": 7,
  "roomId": 21,
  "startDate": "2026-06-15",
  "notes": "Near the entrance if possible"
}
```

#### `PUT /occupant/reservations/{id}`

Updates a pending reservation.

#### `DELETE /occupant/reservations/{id}`

Cancels a pending reservation.

#### `GET /occupant/rentals`

Returns current and historical rentals.

#### `GET /occupant/bills`

Returns bills, charges, balances, and payment history.

#### `POST /occupant/payments`

```json
{
  "rentalId": 44,
  "billId": 88,
  "amount": 2500,
  "method": "GCash",
  "referenceNumber": "GCASH-123456",
  "proofUrl": "https://storage.example.com/proof.jpg"
}
```

### Owner APIs

#### `GET /owner/dashboard`

Returns property counts, occupancy, income, reservations, and recent payments.

#### `GET /owner/properties`

Lists owned boarding houses.

#### `POST /owner/properties`

```json
{
  "name": "Sunrise Boarding House",
  "address": "123 Sample St",
  "latitude": 14.5995,
  "longitude": 120.9842
}
```

#### `PUT /owner/properties/{id}`

Updates property details.

#### `DELETE /owner/properties/{id}`

Deletes or archives a property.

#### `GET /owner/rooms`

Lists rooms under owned properties.

#### `POST /owner/rooms`

Creates a room.

#### `PUT /owner/rooms/{id}`

Updates room status or attributes.

#### `GET /owner/reservations`

Lists owner-managed reservations.

#### `POST /owner/reservations/{id}/approve`

Approves a reservation.

#### `POST /owner/reservations/{id}/reject`

Rejects a reservation.

#### `POST /owner/reservations/{id}/convert-to-rental`

Converts a reservation into an active rental.

#### `GET /owner/rentals`

Lists active and historical rentals.

#### `POST /owner/rentals/{id}/transfer`

```json
{
  "targetRoomId": 35,
  "effectiveDate": "2026-06-20",
  "reason": "Room maintenance"
}
```

#### `POST /owner/rentals/{id}/end`

Ends a rental.

#### `GET /owner/payments`

Lists payments and pending submissions.

#### `POST /owner/payments/{id}/approve`

Approves a submitted payment.

#### `POST /owner/payments/{id}/reject`

Rejects a submitted payment.

### Shared and Cross-Cutting APIs

- `POST /uploads/image`
- `POST /uploads/receipt`
- `GET /reports/owner`
- `GET /reports/occupant`
- `GET /search/properties`
- `GET /map/properties`

## 13. Development Roadmap

### Phase 1 - Authentication

- Build Supabase Auth or equivalent auth gateway
- Implement login, session restore, logout, and occupant registration
- Add role-based routing and guards

### Phase 2 - Dashboard

- Build owner and occupant dashboards
- Add notification badge support
- Add quick actions and recent activity cards

### Phase 3 - Properties

- Build property list, map view, property detail, image upload, and room availability views
- Add owner property create/edit flows
- Add occupant browse and reserve flows

### Phase 4 - Payments

- Build bills, payment history, payment submission, and receipt screens
- Add hosted checkout or proof upload flows
- Add owner payment review and approval flows

### Phase 5 - Notifications

- Add in-app inbox
- Add realtime updates and push notifications
- Add deep links from notifications to reservations, payments, and rentals

### Phase 6 - Advanced Features

- Add reports for owners
- Add occupant history export
- Add collection analytics
- Add transfer and rental end workflows
- Add map enhancements and richer media handling

