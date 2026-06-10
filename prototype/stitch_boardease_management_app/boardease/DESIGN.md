---
name: BoardEase
colors:
  surface: '#f8f9ff'
  surface-dim: '#c4dcfd'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef4ff'
  surface-container: '#e4efff'
  surface-container-high: '#dbe9ff'
  surface-container-highest: '#d1e4ff'
  on-surface: '#011d35'
  on-surface-variant: '#414751'
  inverse-surface: '#19324b'
  inverse-on-surface: '#e9f1ff'
  outline: '#717782'
  outline-variant: '#c0c7d3'
  surface-tint: '#0061a5'
  primary: '#005ea1'
  on-primary: '#ffffff'
  primary-container: '#2178c3'
  on-primary-container: '#fdfcff'
  inverse-primary: '#9fcaff'
  secondary: '#006d40'
  on-secondary: '#ffffff'
  secondary-container: '#8ef5b5'
  on-secondary-container: '#007243'
  tertiary: '#7a5500'
  on-tertiary: '#ffffff'
  tertiary-container: '#996c00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#9fcaff'
  on-primary-fixed: '#001d37'
  on-primary-fixed-variant: '#00497e'
  secondary-fixed: '#91f8b8'
  secondary-fixed-dim: '#74db9d'
  on-secondary-fixed: '#002110'
  on-secondary-fixed-variant: '#00522f'
  tertiary-fixed: '#ffdeaa'
  tertiary-fixed-dim: '#f8bc4b'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5f4100'
  background: '#f8f9ff'
  on-background: '#011d35'
  surface-variant: '#d1e4ff'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

This design system is built for the Philippine rental market, focusing on trust, clarity, and ease of use for both property owners and student/worker tenants. The brand personality is professional yet approachable, reflecting the reliability needed for financial transactions and the warmth of finding a home. 

The aesthetic follows a **Corporate / Modern** style with a mobile-first philosophy. It prioritizes high legibility and efficient task completion. By utilizing a clean, systematic interface, the design system minimizes cognitive load, ensuring that managing lease agreements, payments, and maintenance requests feels effortless. Visual interest is generated through a crisp use of color against a light, airy background, evoking a sense of organized living.

## Colors

The palette is anchored in a dependable blue primary, paired with a semantic system that communicates occupancy and financial status clearly. 

- **Primary Blue:** Used for primary actions, navigation states, and branding.
- **Success/Available Green:** Indicates vacant rooms or successful payments.
- **Pending/Warning Yellow:** Used for upcoming due dates or pending approvals.
- **Danger/Occupied Red:** Signals occupied units, overdue payments, or critical issues.
- **Surface & Neutrals:** The background uses a very soft cool gray to reduce screen glare, while text uses a deep navy for maximum contrast and readability. 
- **Borders:** A subtle gray is used to define structure without adding visual noise.

## Typography

The design system utilizes **Inter**, a highly legible sans-serif font designed for screens. 

For the Philippine context, the currency symbol (₱) should always be rendered with the same weight as its accompanying value to maintain visual balance. Titles and headlines use tighter letter spacing and heavier weights to establish a clear hierarchy. Body text is set with generous line height to ensure lease terms and payment details are easy to read on mobile devices. Labels for status indicators (e.g., "OCCUPIED") use uppercase styling to differentiate them from interactive text.

## Layout & Spacing

The layout is built on a **4px baseline grid** to ensure mathematical consistency across all components.

- **Mobile Layout:** Uses a fluid 1-column layout with 16px side margins. Elements are stacked vertically to optimize for one-handed thumb use.
- **Desktop/Tablet Layout:** Transitions to a 12-column grid. Dashboard widgets and room cards can span 3, 4, or 6 columns depending on content density.
- **Consistency:** Spacing between related items (like an input label and its field) should use 4px or 8px (XS/SM), while spacing between sections should use 24px or 32px (LG/XL).

## Elevation & Depth

This design system uses a **Tonal Layering** approach combined with soft, ambient shadows to create depth.

- **Base Layer:** The `#F7FAFC` background serves as the canvas.
- **Surface Layer:** White cards (`#FFFFFF`) sit on top of the base layer.
- **Shadows:** Cards use a "Soft Shadow" — a dual-layered shadow (e.g., `0 1px 3px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)`) to appear slightly lifted without looking heavy.
- **Interactive Depth:** Buttons have no shadow in their default state but gain a subtle inner glow or slight elevation increase on hover/press to provide tactile feedback.

## Shapes

The shape language is "Rounded," utilizing an **8px (0.5rem)** standard corner radius. This radius provides a modern, friendly feel that is more approachable than sharp corners but more professional than fully rounded "pill" shapes. 

- **Small elements:** Checkboxes and small tags use a 4px radius.
- **Standard elements:** Buttons, input fields, and cards use the 8px radius.
- **Large elements:** Bottom sheets and modal containers use a 16px radius on top corners only.

## Components

### Buttons
- **Primary:** Solid `#3182CE` background with white text. 8px radius. 
- **Secondary:** Outlined with `#E2E8F0` and `#102A43` text for less critical actions.
- **States:** Include a 10% darker shade for active/pressed states.

### Cards
- **Usage:** Essential for room listings and tenant profiles.
- **Style:** White background, 8px radius, soft shadow, and a 1px `#E2E8F0` border to ensure definition on all screen qualities.

### Bottom Tab Navigation
- **Style:** A fixed bar at the bottom with 5 slots: Dashboard, Rooms, Payments, Requests, and Profile.
- **Visuals:** Uses 24px outline-style icons. The active state uses the primary blue for both the icon and the 11px label.

### Chips / Status Indicators
- **Style:** Subtle backgrounds (10% opacity of the semantic color) with high-contrast text of the same hue (e.g., Light green background with dark green text for "Available").

### Input Fields
- **Style:** 1px `#E2E8F0` border, 8px radius, white fill. Focused state uses a 2px `#3182CE` border.
- **Affordance:** The Philippine Peso symbol (₱) should be used as a fixed prefix in payment-related inputs.

### Lists
- **Style:** Clean rows with 16px vertical padding, separated by a 1px `#E2E8F0` divider. Include a chevron-right icon for navigable list items.