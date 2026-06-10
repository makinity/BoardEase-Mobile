# BoardEase — UI/UX Prototype Spec

> **Stack:** React Native + Expo Router · **Theme:** Blue `#3182CE` primary, `#F7FAFC` background, `#102A43` text  
> **Reusable components:** `Screen`, `PageHeader`, `EmptyState`, `LoadingState`, `CardShell`, `PropertyCard`, `RoomCard`, `ReservationCard`, `RentalCard`, `PaymentCard`, `StatCard`, `SearchInput`  
> **Sample data:** Sunrise BH (owner: Juan Landlord), Room A1/A2, Alex Cruz (occupant, active rental), Jamie Reyes (occupant, pending reservation)

---

## Stitch Prompt

```
Design a mobile app UI for BoardEase — a boarding house management app for the Philippines.
Roles: Owner and Occupant. Style: clean, modern, blue (#3182CE) primary, white cards with subtle shadows,
#F7FAFC background, #102A43 dark text, #627D98 secondary text. Font: system default.
Use bottom tab navigation for main screens. Cards have 16px padding, 12px border radius, light shadow.
Buttons are full-width, rounded (8px), blue fill for primary and outlined red for destructive.
Status chips: green=available/approved, yellow=pending, red=occupied/rejected, gray=cancelled.
All amounts in Philippine Peso (₱). Amounts stored in centavos, display divided by 100.
Screen safe area respected. No dark mode required.
```

---

## Phase 1 — Authentication

### Frame 1: Login
**File:** `(auth)/login.tsx`  
**Flow:** App entry → no session → land here  
**Layout:**
```
[Logo / App name "BoardEase" centered]
[Subtitle: "Sign in to your account"]
[Email input]
[Password input]
[Sign In button — blue, full width]
[Forgot password? — text link]
[Don't have an account? Register — text link]
```
**Data:** none  
**Actions:** Sign In → role check → redirect to owner or occupant dashboard

---

### Frame 2: Register
**File:** `(auth)/register.tsx`  
**Flow:** Login → Register link  
**Layout:**
```
[Title: "Create Account"]
[Subtitle: "Occupant registration"]
[Full name input]
[Email input]
[Password input]
[Register button — blue, full width]
[Already have an account? Sign in — link]
```
**Data:** none  
**Actions:** Register → show email confirmation alert → back to login

---

### Frame 3: Forgot Password
**File:** `(auth)/forgot-password.tsx`  
**Layout:**
```
[Title: "Reset Password"]
[Subtitle: "Enter your email to receive a reset link."]
[Email input]
[Send Reset Link button]
[Back to login — link]
```

---

### Frame 4: Reset Password
**File:** `(auth)/reset-password.tsx`  
**Layout:**
```
[Title: "New Password"]
[New password input]
[Confirm password input]
[Update Password button]
```

---

## Phase 2 — Public Browsing (no auth required)

### Frame 5: Landing / Home
**File:** `(public)/index.tsx`  
**Flow:** App open → no login → public home  
**Layout:**
```
[Header: "BoardEase" + subtitle]
[Search bar — tappable, routes to search screen]
[Section: "Featured Properties"]
[PropertyCard × N: name + address]
  └─ Tap → Property Detail
```
**Data:** All properties from `properties` table (2 seeded: Sunrise BH, City Stay)

---

### Frame 6: Properties List
**File:** `(public)/properties/index.tsx`  
**Layout:**
```
[PageHeader: "Properties"]
[SearchInput — live filter by name/address]
[FlatList of PropertyCards]
  └─ Tap → Property Detail
```
**Data:** filtered `properties`

---

### Frame 7: Property Detail (Public)
**File:** `(public)/properties/[id].tsx`  
**Layout:**
```
[PageHeader: property.name]
[address — gray subtitle]
[Section: "Rooms (N)"]
[FlatList of RoomCards: name + status chip]
  └─ Tap → Room Detail
[Reserve a Room button — blue, shows only if available room exists]
  └─ Not logged in → Login screen
  └─ Logged in → Create Reservation
```
**Data:** `properties/{id}` + `rooms` filtered by `property_id`  
**Sample:** Sunrise BH → Room A1 (available), Room A2 (occupied)

---

### Frame 8: Room Detail (Public)
**File:** `(public)/rooms/[id].tsx`  
**Layout:**
```
[PageHeader: room.name]
[Row: Status | green/red/orange chip]
[Row: Capacity | "2 persons"]
[Row: Monthly Rate | "₱4,500.00"]
[Reserve This Room button — only if available]
```
**Data:** `rooms/{id}`  
**Sample:** Room A1 — available, 2 persons, ₱4,500

---

### Frame 9: Search
**File:** `(public)/search.tsx`  
**Layout:**
```
[PageHeader: "Search"]
[SearchInput — autofocus]
[Empty state: "Type at least 2 characters"]
[Results: PropertyCards]
```

---

## Phase 3 — Dashboards

### Frame 10: Owner Dashboard
**File:** `(owner)/dashboard/index.tsx`  
**Flow:** Owner login → here  
**Layout:**
```
[PageHeader: "Hello, Juan Landlord" + "Here's your overview"]
[2×2 grid of StatCards:]
  ├─ Properties: 1
  ├─ Active Rentals: 1
  ├─ Pending Reservations: 1
  └─ Total Income: ₱2,000
[Section: "Quick Actions"]
[Action buttons: My Properties | Reservations | Payments]
```
**Data:** `getOwnerDashboard()` — counts from properties/rentals/reservations/payments

---

### Frame 11: Occupant Dashboard
**File:** `(occupant)/dashboard/index.tsx`  
**Flow:** Occupant login → here  
**Layout:**
```
[PageHeader: "Hello, Alex Cruz" + "Here's your overview"]
[3 StatCards:]
  ├─ Active Rental: "Active"
  ├─ Pending Bills: 1
  └─ Reservations: 0
["Browse Boarding Houses" button — only if no active rental]
[Section: "Quick Actions"]
[Action buttons: My Reservations | My Bills | My Rentals]
```
**Data:** `getOccupantDashboard()`  
**Sample (Alex Cruz):** Active rental at Room A2, 1 partial bill

---

## Phase 4 — Owner Property & Room Management

### Frame 12: My Properties List
**File:** `(owner)/my-bh/index.tsx`  
**Layout:**
```
[PageHeader: "My Properties"]
[FlatList of PropertyCards filtered to ownerId]
  └─ Tap → Property Detail (owner view)
[Empty state + "Add Property" retry button]
```
**Sample:** Sunrise Boarding House — Obrero, Davao City

---

### Frame 13: Create Property
**File:** `(owner)/my-bh/create.tsx`  
**Layout:**
```
[Title: "New Property"]
[Property name input]
[Address input]
[Create Property button]
```

---

### Frame 14: Property Detail (Owner)
**File:** `(owner)/my-bh/[id].tsx`  
**Layout:**
```
[PageHeader: property.name]
[address — gray]
[Row of buttons: Edit | Add Room]
[Section: "Rooms (N)"]
[FlatList of RoomCards]
  └─ Tap → Room Detail (owner)
```
**Sample:** Sunrise BH → [Edit] [Add Room] → Room A1 (available), Room A2 (occupied)

---

### Frame 15: Edit Property
**File:** `(owner)/my-bh/edit.tsx`  
**Layout:**
```
[Title: "Edit Property"]
[Name input — prefilled]
[Address input — prefilled]
[Save Changes button]
[Delete Property — red text link]
  └─ Confirm alert before delete
```

---

### Frame 16: Rooms List (Owner)
**File:** `(owner)/rooms/index.tsx`  
**Layout:**
```
[PageHeader: "Rooms"]
[FlatList of all RoomCards across owned properties]
  └─ Tap → Room Detail
```

---

### Frame 17: Create Room
**File:** `(owner)/rooms/create.tsx`  
**Layout:**
```
[Title: "New Room"]
[Room name input]
[Capacity input — numeric]
[Monthly rate input — PHP]
[Create Room button]
```
**Params:** `?propertyId=` from property detail screen

---

### Frame 18: Room Detail (Owner)
**File:** `(owner)/rooms/[id].tsx`  
**Layout:**
```
[PageHeader: room.name]
[Row: Status | color chip]
[Row: Capacity]
[Row: Monthly Rate]
[Edit Room button — outlined blue]
```

---

### Frame 19: Edit Room
**File:** `(owner)/rooms/edit.tsx`  
**Layout:**
```
[Title: "Edit Room"]
[Name input]
[Capacity input]
[Monthly rate input]
[Status selector: available | occupied | maintenance — pill toggle]
[Save Changes button]
[Delete Room — red link]
```

---

## Phase 5 — Reservations

### Frame 20: Occupant — Create Reservation
**File:** `(occupant)/reservations/create.tsx`  
**Flow:** Room Detail → Reserve → here (if logged in)  
**Layout:**
```
[Title: "Reserve Room"]
[Start date input — YYYY-MM-DD]
[Notes textarea — optional]
[Submit Reservation button]
```
**Params:** `?roomId=&propertyId=`  
**Data:** Creates row in `reservations` with status=pending

---

### Frame 21: Occupant — Reservations List
**File:** `(occupant)/reservations/index.tsx`  
**Layout:**
```
[PageHeader: "My Reservations"]
[FlatList of ReservationCards: startDate + status chip]
  └─ Tap → Reservation Detail
[Empty state: "Browse properties to reserve a room"]
```
**Sample (Jamie Reyes):** 2026-07-01 · pending

---

### Frame 22: Occupant — Reservation Detail
**File:** `(occupant)/reservations/[id].tsx`  
**Layout:**
```
[PageHeader: "Reservation Detail"]
[Row: Status | color chip]
[Row: Start Date]
[Row: Notes]
[Cancel Reservation button — outlined red, only if pending/approved]
  └─ Confirm alert
```

---

### Frame 23: Owner — Reservations List
**File:** `(owner)/reservations/index.tsx`  
**Layout:**
```
[PageHeader: "Reservations"]
[FlatList of ReservationCards filtered to owned properties]
  └─ Tap → Reservation Detail
```
**Sample:** Jamie Reyes reservation — 2026-07-01 · pending

---

### Frame 24: Owner — Reservation Detail
**File:** `(owner)/reservations/[id].tsx`  
**Layout:**
```
[PageHeader: "Reservation Detail"]
[Row: Status | color chip]
[Row: Start Date]
[Row: Room ID]
[Row: Notes]
[Two action buttons — only if pending:]
  ├─ Approve — green fill
  └─ Reject — outlined red
```

---

## Phase 6 — Rentals (stub screens, to be implemented)

### Frame 25: Occupant — Rentals List
**File:** `(occupant)/rentals/index.tsx`  
**Layout:**
```
[PageHeader: "My Rentals"]
[Active rental card at top — highlighted]
[History list below]
```
**Sample (Alex Cruz):** Room A2, started 2026-06-01, active

---

### Frame 26: Occupant — Rental Detail
**File:** `(occupant)/rentals/[id].tsx`  
**Layout:**
```
[PageHeader: rental room name]
[Row: Status]
[Row: Start Date]
[Row: End Date — if ended]
[View Bills button]
```

---

### Frame 27: Owner — Rentals List
**File:** `(owner)/rentals/index.tsx`  
**Layout:**
```
[PageHeader: "Rentals"]
[Active rentals section]
[Historical rentals section]
```

---

### Frame 28: Owner — Rental Detail
**File:** `(owner)/rentals/[id].tsx`  
**Layout:**
```
[PageHeader: rental detail]
[Status, dates, occupant info]
[Transfer button | End Rental button]
```

---

### Frame 29: Owner — Transfer Rental
**File:** `(owner)/rentals/transfer.tsx`  
**Layout:**
```
[Title: "Transfer Rental"]
[Target room picker]
[Effective date input]
[Reason input]
[Confirm Transfer button]
```

---

### Frame 30: Owner — End Rental
**File:** `(owner)/rentals/end.tsx`  
**Layout:**
```
[Title: "End Rental"]
[End date input]
[Confirm button — red]
```

---

### Frame 31: Owner — Occupants List
**File:** `(owner)/occupants/index.tsx`  
**Layout:**
```
[PageHeader: "Occupants"]
[List of occupants linked to owned properties]
```

---

### Frame 32: Owner — Occupant Detail
**File:** `(owner)/occupants/[id].tsx`  
**Layout:**
```
[Name, email]
[Active rental info]
[Payment history list]
```

---

## Phase 7 — Billing & Payments (stub screens)

### Frame 33: Occupant — Bills List
**File:** `(occupant)/bills/index.tsx`  
**Layout:**
```
[PageHeader: "My Bills"]
[Bill cards: period, total, paid, status chip]
  └─ Tap → Bill Detail
```
**Sample (Alex Cruz):** June 2026 — ₱4,500 total, ₱2,000 paid, partial

---

### Frame 34: Occupant — Bill Detail
**File:** `(occupant)/bills/[billId].tsx`  
**Layout:**
```
[PageHeader: "Bill — June 2026"]
[Total due card]
[Itemized charges: Room Rent ₱4,000 | Water ₱300 | Electricity ₱200]
[Pay Now button]
```

---

### Frame 35: Occupant — Payment / Checkout
**File:** `(occupant)/bills/payment.tsx`  
**Layout:**
```
[Title: "Pay Bill"]
[Amount input]
[Payment method selector: GCash | Bank | Cash]
[Reference number input]
[Upload Proof button]
[Submit Payment button]
```

---

### Frame 36: Owner — Payments List
**File:** `(owner)/payments/index.tsx`  
**Layout:**
```
[PageHeader: "Payments"]
[PaymentCards: amount, method, status chip]
  └─ Pending ones highlighted
```

---

### Frame 37: Owner — Payment Detail / Review
**File:** `(owner)/payments/[id].tsx` + `review.tsx`  
**Layout:**
```
[Amount, method, reference]
[Proof image if uploaded]
[Approve | Reject buttons — if pending]
```

---

### Frame 38: Owner — Collectables
**File:** `(owner)/collectables/index.tsx`  
**Layout:**
```
[PageHeader: "Collectables"]
[CollectableCards: amount, due date, paid status]
```
**Sample:** ₱4,500 due 2026-06-30, unpaid

---

### Frame 39: Owner — Income
**File:** `(owner)/income/index.tsx`  
**Layout:**
```
[PageHeader: "Income"]
[Total income stat]
[Monthly breakdown list]
```

---

## Phase 8 — Notifications (stub)

### Frame 40: Notifications (both roles)
**File:** `(owner)/notifications/index.tsx` + `(occupant)/notifications/index.tsx`  
**Layout:**
```
[PageHeader: "Notifications"]
[List: title, message, time, unread dot]
[Mark all read button]
```
**Sample:** "Payment Received" (Alex), "Reservation Pending" (Jamie)

---

## Phase 9 — Profile & Settings (stub)

### Frame 41: Profile (both roles)
**File:** `(owner)/profile/index.tsx` + `(occupant)/profile/index.tsx`  
**Layout:**
```
[Avatar placeholder]
[Display name]
[Email — read only]
[Edit name input]
[Change Password section]
[Save button]
[Sign Out — red link]
```

---

### Frame 42: Settings
**File:** `(owner)/settings/index.tsx` + `(occupant)/settings/index.tsx`  
**Layout:**
```
[PageHeader: "Settings"]
[Sign Out button]
```

---

## Navigation Structure

### Owner Bottom Tabs
```
Dashboard | My Properties | Reservations | Payments | Profile
```

### Occupant Bottom Tabs
```
Dashboard | Browse | Reservations | Bills | Profile
```

---

## Component Reference

| Component | Props | Usage |
|---|---|---|
| `Screen` | `title`, `description`, `scrollable` | Every screen wrapper |
| `PageHeader` | `title`, `description` | Auto-used inside Screen |
| `EmptyState` | `title`, `description`, `onRetry` | No data / error state |
| `LoadingState` | `label?` | Fetching state |
| `CardShell` | `tone: default\|accent` | Card wrapper |
| `PropertyCard` | `name`, `location` | Property list items |
| `RoomCard` | `title`, `status` | Room list items |
| `ReservationCard` | `title`, `status` | Reservation list items |
| `RentalCard` | — | Rental list items |
| `PaymentCard` | — | Payment list items |
| `StatCard` | `label`, `value` | Dashboard stats |
| `SearchInput` | `value`, `onChangeText` | Search bars |

---

## Color Tokens

| Token | Hex | Usage |
|---|---|---|
| Primary | `#3182CE` | Buttons, links, accent |
| Background | `#F7FAFC` | Screen bg |
| Card | `#FFFFFF` | Card bg |
| Text Primary | `#102A43` | Headings |
| Text Secondary | `#627D98` | Subtitles, labels |
| Border | `#E2E8F0` | Input, divider |
| Success | `#38A169` | Available, approved |
| Warning | `#D69E2E` | Pending |
| Danger | `#E53E3E` | Rejected, delete |
| Info | `#3182CE` | Converted, info |
| Muted | `#718096` | Cancelled |
