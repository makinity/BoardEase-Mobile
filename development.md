# BoardEase — Development Guide

A phase-by-phase plan for building the BoardEase mobile app (React Native + Expo Router + Supabase). It tells you **what to build, in what order, which screen comes first, and when each phase is "done."**

- Architecture reference: [user-owner.md](user-owner.md)
- Audit & rationale for the current structure: see the folder-structure audit.
- Stack: Expo SDK 56, Expo Router (typed routes), Supabase (Auth/Postgres/Storage/Realtime), TanStack Query, Zustand, PayMongo (later).

> **Read the versioned Expo docs before writing code:** https://docs.expo.dev/versions/v56.0.0/

---

## How the codebase is organized

```
src/
  app/                 # Expo Router route tree (screens)
    (public)/          # guest browsing — no auth required
    (auth)/            # login / register / password / verify
    (occupant)/        # occupant role shell
    (owner)/           # owner role shell
    (shared)/          # modals: notifications, receipt, map-preview
  features/<domain>/   # api/ + hooks/ + types/ (+ components/) per domain
  store/               # Zustand stores (auth, profile, property, ... )
  lib/                 # supabase client, query-client, query-keys
  services/            # external integrations (paymongo)
  components/          # reusable UI: cards/ forms/ layout/ modals/ navigation/
  theme/               # colors, spacing, typography, radius, shadows, fonts
  providers/           # AppProviders → AuthProvider + QueryProvider
  types/               # domain entity types + database.ts (generated)
  utils/               # formatCurrency, formatDate, ...
```

**The data flow for every screen is the same:**

```
screen  →  feature hook (useX)  →  feature api (Supabase)  →  Postgres
            (TanStack Query)        (lib/supabase client)
```

Local UI/session state that isn't server data lives in `src/store/*` (Zustand).

---

## The canonical "build a screen" recipe

Every list/detail screen follows this shape. Copy it.

```tsx
// src/app/(owner)/my-bh/index.tsx  (example)
import { FlatList } from "react-native";

import { PropertyCard } from "@/components/cards";
import {
  EmptyState,
  LoadingState,
  PageHeader,
  Screen,
} from "@/components/layout";
import { useProperties } from "@/features/properties";

export default function MyBoardingHouses() {
  const { data, isLoading, isError, refetch } = useProperties();

  if (isLoading) return <LoadingState />;
  if (isError)
    return <EmptyState title="Couldn't load properties" onRetry={refetch} />;
  if (!data?.length) return <EmptyState title="No boarding houses yet" />;

  return (
    <Screen>
      <PageHeader title="My BH" />
      <FlatList
        data={data}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PropertyCard property={item} />}
      />
    </Screen>
  );
}
```

Mutations (create/edit/approve/pay) follow the mutation hook pattern:

```tsx
const { mutate, isPending } = useCreateProperty();
mutate(form, { onSuccess: () => router.back() });
```

> Some `layout` components (`EmptyState`, `LoadingState`, `PageHeader`) currently take minimal props. Extend their prop types as you wire the first screens — that's expected Phase 1 work.

---

## Phase map (at a glance)

| Phase | Theme                                          | Unlocks                                   | Depends on |
| ----- | ---------------------------------------------- | ----------------------------------------- | ---------- |
| 0     | Backend & foundation                           | Everything                                | —          |
| 1     | Auth & routing                                 | A user can log in and land on their role  | 0          |
| 2     | Public browsing                                | Guests can browse properties/rooms        | 0          |
| 3     | Dashboards                                     | Role home screens with live counts        | 1          |
| 4     | Owner property & room mgmt                     | Owners create the inventory guests browse | 1, 2       |
| 5     | Reservations                                   | Occupants request, owners approve         | 4          |
| 6     | Rentals                                        | Stays tracked, transfer/end               | 5          |
| 7     | Billing & payments                             | Bills, checkout, approvals, collectables  | 6          |
| 8     | Notifications & realtime                       | Live alerts + push                        | 3          |
| 9     | Profile, settings, reports, occupants, history | Self-service + owner analytics            | 7          |
| 10    | Polish & release                               | Ship                                      | all        |

Build phases **in order** — each assumes the previous one's data exists. Within a phase, build the **first screen listed first** (it's the dependency for the rest).

---

## Phase 0 — Backend & Foundation (do this first)

Nothing renders real data until this exists. This is the current blocker.

**Tasks**

1. Create a Supabase project. Put real values in `.env` (see [.env.example](.env.example)): `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
2. Write the schema (SQL migration) for the tables the feature APIs assume:
   `profiles, properties, rooms, reservations, rentals, bills, charges, payments, collectables, notifications, reports`.
   Match the column names used in `src/types/index.ts` (camelCase) **or** add a naming convention + update the `api/` selects accordingly. Decide this now — it ripples through every feature.
3. Add Row Level Security policies (user-owner.md §11): owner-only on owned BH + dependents; occupant-only on their reservations/rentals/bills/payments.
4. Create Storage buckets: `avatars`, `properties`, `receipts`, `proofs` (matches `UploadBucket` in `src/features/uploads/types`).
5. Generate types: `npx supabase gen types typescript --project-id <ref> > src/types/database.ts`, then optionally type the client: `createClient<Database>(...)` in `src/lib/supabase/client.ts`.
6. Seed a couple of properties/rooms for development.

**Foundation already in place (verify, don't rebuild)**

- Supabase client, query client, query keys — `src/lib/`
- Session bootstrap + `useAuth()` — `src/providers/AuthProvider.tsx`
- Role redirect entry — `src/app/index.tsx`
- Theme tokens — `src/theme/`
- Reusable cards/states/modals — `src/components/`

**Done when:** a throwaway screen calling `useProperties()` returns seeded rows, and uploading a file to a bucket succeeds.

---

## Phase 1 — Authentication & Routing

Make a user able to sign in, register, recover a password, and land on the correct role shell.

**Screens (build login first)**

| Order | Screen          | File                                 | Data layer            |
| ----- | --------------- | ------------------------------------ | --------------------- |
| 1     | Login           | `src/app/(auth)/login.tsx`           | `useSignIn`           |
| 2     | Register        | `src/app/(auth)/register.tsx`        | `useSignUp`           |
| 3     | Forgot password | `src/app/(auth)/forgot-password.tsx` | `auth.resetPassword`  |
| 4     | Reset password  | `src/app/(auth)/reset-password.tsx`  | `auth.updatePassword` |
| 5     | Verify email    | `src/app/(auth)/verify-email.tsx`    | Supabase email OTP    |

**Also**

- Persist role: after login, load the profile and set `useAuthStore().setAuth(userId, role)` (`src/store/auth.store.ts`). The redirect in `src/app/index.tsx` already reads `role`.
- Add route guards in each role group's `_layout.tsx` (`(occupant)/_layout.tsx`, `(owner)/_layout.tsx`): redirect to `(auth)/login` when there's no session.
- `expo-secure-store` is installed — confirm Supabase session persists across restarts.

**Backend prereq:** `profiles` table + a trigger/row created on sign-up that carries `role` (`owner` | `occupant`).

**Done when:** a new occupant can register → verify → log in → land on `(occupant)/dashboard`; an owner lands on `(owner)/dashboard`; logout returns to login.

---

## Phase 2 — Public Browsing (guest)

Guests browse without an account; protected actions bounce to login.

**Screens (build the list first)**

| Order | Screen          | File                                    | Data layer                          |
| ----- | --------------- | --------------------------------------- | ----------------------------------- |
| 1     | Landing         | `src/app/(public)/index.tsx`            | featured `useProperties`            |
| 2     | Properties list | `src/app/(public)/properties/index.tsx` | `useProperties` + `SearchInput`     |
| 3     | Property detail | `src/app/(public)/properties/[id].tsx`  | `useProperty`, `useRoomsByProperty` |
| 4     | Room detail     | `src/app/(public)/rooms/[id].tsx`       | `useRoom`                           |
| 5     | Search          | `src/app/(public)/search.tsx`           | `useProperties` + `FilterModal`     |

**Components:** `PropertyCard`, `RoomCard`, `SearchInput`, `FilterModal`, `EmptyState`, `LoadingState`.

**Protected-action rule:** "Reserve" / "Save" on a public screen → if no session, `router.push('/(auth)/login')`.

**Done when:** a logged-out user can browse the seeded properties, open a property, see its rooms, and tapping "Reserve" sends them to login.

---

## Phase 3 — Dashboards

Role home screens with live summary cards and a notification badge.

**Screens**

| Screen             | File                                     | Data layer             |
| ------------------ | ---------------------------------------- | ---------------------- |
| Occupant dashboard | `src/app/(occupant)/dashboard/index.tsx` | `useOccupantDashboard` |
| Owner dashboard    | `src/app/(owner)/dashboard/index.tsx`    | `useOwnerDashboard`    |

**Backend prereq:** implement the dashboard queries — fill in `src/features/dashboard/api/index.ts` (currently returns `null`). Easiest path: Postgres RPC functions (`owner_dashboard`, `occupant_dashboard`) returning the shapes in `src/features/dashboard/types`.

**Components:** `StatCard`, `SectionHeader`, `NotificationBadge`.

**Done when:** each dashboard shows real counts (properties/rentals/reservations/income for owner; active stay/bills/reservations for occupant) and an unread badge.

---

## Phase 4 — Owner Property & Room Management

Owners create the inventory that Phase 2 browses. This is where uploads + maps come in.

**Screens (build My BH list → create → detail/edit, then rooms)**

| Order | Screen      | File                               | Data layer                               |
| ----- | ----------- | ---------------------------------- | ---------------------------------------- |
| 1     | My BH list  | `src/app/(owner)/my-bh/index.tsx`  | `useProperties`                          |
| 2     | Create BH   | `src/app/(owner)/my-bh/create.tsx` | `useCreateProperty` + `useUploadImage`   |
| 3     | BH detail   | `src/app/(owner)/my-bh/[id].tsx`   | `useProperty`                            |
| 4     | Edit BH     | `src/app/(owner)/my-bh/edit.tsx`   | `useUpdateProperty`, `useDeleteProperty` |
| 5     | Rooms list  | `src/app/(owner)/rooms/index.tsx`  | `useRoomsByProperty`                     |
| 6     | Create room | `src/app/(owner)/rooms/create.tsx` | `useCreateRoom`                          |
| 7     | Room detail | `src/app/(owner)/rooms/[id].tsx`   | `useRoom`                                |
| 8     | Edit room   | `src/app/(owner)/rooms/edit.tsx`   | `useUpdateRoom`, `useDeleteRoom`         |

**Cross-cutting:** location picking → `src/app/(shared)/map-preview.tsx`; image upload → `src/features/uploads` + `properties`/`avatars` buckets.

**Done when:** an owner can create a BH with image + location, add rooms, edit/delete both, and the new BH appears in the public browse list.

---

## Phase 5 — Reservations

The first two-sided workflow: occupant submits, owner acts.

**Occupant screens**

| Order | Screen                 | File                                                                  | Data layer                               |
| ----- | ---------------------- | --------------------------------------------------------------------- | ---------------------------------------- |
| 1     | Create reservation     | `src/app/(occupant)/reservations/create.tsx`                          | `useCreateReservation`                   |
| 2     | Reservations list      | `src/app/(occupant)/reservations/index.tsx`                           | `useReservations`                        |
| 3     | Reservation detail     | `src/app/(occupant)/reservations/[id].tsx`                            | `useReservation`, `useCancelReservation` |
| —     | Occupant browse detail | `src/app/(occupant)/browse/[propertyId].tsx`, `.../room/[roomId].tsx` | entry points into create                 |

**Owner screens**

| Screen             | File                                     | Data layer                                      |
| ------------------ | ---------------------------------------- | ----------------------------------------------- |
| Reservations list  | `src/app/(owner)/reservations/index.tsx` | `useReservations`                               |
| Reservation detail | `src/app/(owner)/reservations/[id].tsx`  | `useApproveReservation`, `useRejectReservation` |

**Components:** `ReservationCard`, status timeline, `ConfirmModal`.

**Backend prereq:** add a `convert-to-rental` action (RPC) — surfaces in Phase 6.

**Done when:** an occupant reserves a room, the owner sees it, approves/rejects it, and both sides reflect the new status.

---

## Phase 6 — Rentals

Approved reservations become stays.

**Occupant screens**

| Screen        | File                                   | Data layer   |
| ------------- | -------------------------------------- | ------------ |
| Rentals list  | `src/app/(occupant)/rentals/index.tsx` | `useRentals` |
| Rental detail | `src/app/(occupant)/rentals/[id].tsx`  | `useRental`  |

**Owner screens**

| Screen          | File                                   | Data layer                |
| --------------- | -------------------------------------- | ------------------------- |
| Rentals list    | `src/app/(owner)/rentals/index.tsx`    | `useRentals`              |
| Rental detail   | `src/app/(owner)/rentals/[id].tsx`     | `useRental`               |
| Transfer rental | `src/app/(owner)/rentals/transfer.tsx` | `useTransferRental`       |
| End rental      | `src/app/(owner)/rentals/end.tsx`      | `useEndRental`            |
| Occupants list  | `src/app/(owner)/occupants/index.tsx`  | (occupant query)          |
| Occupant detail | `src/app/(owner)/occupants/[id].tsx`   | profile + payment history |

**Components:** `RentalCard`, timeline, tabs (active vs history).

**Done when:** approving a reservation creates a rental; the owner can transfer or end it; both roles see active stay + history.

---

## Phase 7 — Billing & Payments (incl. PayMongo)

The money path. Highest-risk; do it after the lifecycle works.

**Occupant screens**

| Order | Screen             | File                                    | Data layer                                             |
| ----- | ------------------ | --------------------------------------- | ------------------------------------------------------ |
| 1     | Bills list         | `src/app/(occupant)/bills/index.tsx`    | `useBills`                                             |
| 2     | Bill detail        | `src/app/(occupant)/bills/[billId].tsx` | `useBill`                                              |
| 3     | Payment / checkout | `src/app/(occupant)/bills/payment.tsx`  | `useCreatePayment`, `useUploadImage` (proof), PayMongo |
| 4     | Payment history    | `src/app/(occupant)/bills/history.tsx`  | `usePayments`                                          |

**Owner screens**

| Screen                  | File                                       | Data layer                              |
| ----------------------- | ------------------------------------------ | --------------------------------------- |
| Payments list           | `src/app/(owner)/payments/index.tsx`       | `usePayments`                           |
| Payment detail          | `src/app/(owner)/payments/[id].tsx`        | `usePayment`                            |
| Review/approve          | `src/app/(owner)/payments/review.tsx`      | `useApprovePayment`, `useRejectPayment` |
| Collectables            | `src/app/(owner)/collectables/index.tsx`   | `useCollectables`                       |
| Collectable detail      | `src/app/(owner)/collectables/[id].tsx`    | `useCollectable`                        |
| Income                  | `src/app/(owner)/income/index.tsx`         | payments aggregation                    |
| Receipt viewer (shared) | `src/app/(shared)/receipt/[receiptId].tsx` | receipt data                            |

**PayMongo:** implement `src/services/paymongo/index.ts` behind a **Supabase Edge Function** (keep the secret key server-side — already noted in the file). Use `expo-web-browser` for hosted checkout. Proof-upload flow is the fallback path.

**Components:** `PaymentCard`, `CollectableCard`, total-due card, payment-method picker, upload control.

**Done when:** an occupant pays a bill (hosted checkout OR proof upload), the owner reviews/approves it, balances update, and a receipt is viewable.

---

## Phase 8 — Notifications & Realtime

| Screen         | File                                         | Data layer                                          |
| -------------- | -------------------------------------------- | --------------------------------------------------- |
| Occupant inbox | `src/app/(occupant)/notifications/index.tsx` | `useNotifications`, `useMarkRead`, `useMarkAllRead` |
| Owner inbox    | `src/app/(owner)/notifications/index.tsx`    | same                                                |
| Shared modal   | `src/app/(shared)/notifications.tsx`         | `useUnreadCount`                                    |

**Tasks**

- Wire the unread badge (Phase 3) to `useUnreadCount`.
- Supabase **Realtime** subscription on `notifications` (and reservation/payment status) → invalidate the relevant query keys.
- Expo push notifications (`expo-device` is installed); register tokens, trigger from backend events.
- Deep links from a notification to the reservation/payment/rental it references.

**Done when:** an action by one role pushes a live notification to the other, the badge updates without refresh, and tapping it deep-links to the right screen.

---

## Phase 9 — Profile, Settings, Reports, History

Self-service + owner analytics. Mostly read/update screens reusing existing hooks.

| Screen            | File                                    | Data layer                                            |
| ----------------- | --------------------------------------- | ----------------------------------------------------- |
| Occupant profile  | `src/app/(occupant)/profile/index.tsx`  | `useProfile`, `useUpdateProfile`, `useChangePassword` |
| Owner profile     | `src/app/(owner)/profile/index.tsx`     | same                                                  |
| Occupant settings | `src/app/(occupant)/settings/index.tsx` | local prefs + `useSignOut`                            |
| Owner settings    | `src/app/(owner)/settings/index.tsx`    | same                                                  |
| Owner reports     | `src/app/(owner)/reports/index.tsx`     | `useReports`, `useReport`                             |

**Backend prereq:** report queries/RPCs + `reports` rows; avatar upload via `avatars` bucket.

**Done when:** both roles can edit profile + change password + upload avatar + sign out; owners can view report snapshots; occupant history/statements are reviewable.

---

## Phase 10 — Polish & Release

- Every screen has explicit **loading / empty / error** states (use `LoadingState` / `EmptyState`).
- Form validation + friendly Supabase error messages (add to `src/utils`).
- Accessibility: large touch targets on payment/approval actions, labels, contrast.
- Performance: `FlatList` tuning, `expo-image` caching, query `staleTime` review.
- Testing: add a test runner (none configured yet) + smoke tests for auth and the payment path.
- Build: configure **EAS Build**, app icons/splash (already in `app.json`), store metadata.

**Done when:** a clean run through register → browse → reserve → rent → pay → get notified works on a physical device, and an EAS build is installable.

---

## Definition of "feature-complete"

All phases 0–9 done, Phase 10 polish applied, and:

- Occupant journey: register → browse → reserve → approved → rental → bill → pay → receipt → notified.
- Owner journey: create BH/rooms → approve reservation → manage rental → review payment → see income/collectables/reports → notified.
- Admin-only surfaces (DB ops, subscriptions, audit, user admin) intentionally remain **out of mobile** (user-owner.md §1, §3).

---

## Progress checklist

- [ ] **Phase 0** — Supabase project, schema, RLS, buckets, generated types, seed
- [ ] **Phase 1** — Auth + role routing + guards
- [ ] **Phase 2** — Public browse (list, property, room, search)
- [ ] **Phase 3** — Owner + occupant dashboards
- [ ] **Phase 4** — Owner BH + room CRUD (+ upload, map)
- [ ] **Phase 5** — Reservations (occupant create/list/detail; owner approve/reject)
- [ ] **Phase 6** — Rentals (list/detail; transfer/end; occupants)
- [ ] **Phase 7** — Billing & payments (bills, checkout, review, collectables, income, receipts, PayMongo)
- [ ] **Phase 8** — Notifications + realtime + push
- [ ] **Phase 9** — Profile, settings, reports, history
- [ ] **Phase 10** — Polish, testing, EAS release

---

## Conventions cheat-sheet

- **Data:** server state → TanStack Query hooks in `features/*/hooks`; never call Supabase from a screen directly.
- **Local/session state:** Zustand in `src/store/*`.
- **New domain call:** add to `features/<domain>/api`, expose a hook in `features/<domain>/hooks`, add a key to `src/lib/query-keys.ts`.
- **New shared component:** put it in the right `src/components/<category>/` and export from that category barrel. (`feedback/` and each feature's `components/` barrel are placeholders — re-add the `export *` line in the parent barrel when you add the first component.)
- **Theme:** import tokens from `@/theme` (single source). No hard-coded colors/spacing.
- **Money:** store amounts in **centavos**; format with `formatCurrency` in `src/utils`.
- **Secrets:** never ship a secret key in the app — proxy PayMongo through a Supabase Edge Function.
