# Answer Browser: Animation & Motion Guide

This guide establishes the principles and standards for all animations and microinteractions within the Answer browser. The goal is to create a user experience that feels fluid, responsive, and premium, without being distracting. Consistency is key.

## Core Principles

1.  **Purposeful Motion**: Animation should serve a purpose. It should guide the user's attention, provide feedback, and explain spatial relationships between UI elements. Avoid animation for decoration's sake.
2.  **Fluid & Natural**: Motion should feel natural, not robotic. We primarily use spring physics for interactive elements and a custom cubic-bezier for transitions to achieve an organic feel.
3.  **Responsive**: Animations should be fast and interruptible. Users should never feel like they are waiting for an animation to finish.
4.  **Accessible**: All animations must be designed with accessibility in mind. A "reduce motion" setting is available and must be respected.

## Animation System (Framer Motion)

We use Framer Motion for all animations. Reusable animation definitions are stored as `variants`.

### Easing

-   **Primary Easing (Transitions)**: For non-physical transitions like fading in panels or list items. This curve starts fast and decelerates gracefully.
    -   **CSS `transition-timing-function`**: `cubic-bezier(0.2, 0.9, 0.2, 1)`
    -   **Framer Motion `ease` array**: `[0.2, 0.9, 0.2, 1]`

-   **Spring Physics (Interactions)**: For elements that feel physical and interactive, like modals, pop-ups, and draggable tabs.
    -   **Default Spring**: `{ type: 'spring', stiffness: 400, damping: 30 }` - A balanced, responsive spring.
    -   **Gentle Spring**: `{ type: 'spring', stiffness: 300, damping: 35 }` - Softer, for larger elements like the sidebar.
    -   **Quick Spring**: `{ type: 'spring', stiffness: 700, damping: 35 }` - For small, quick microinteractions like toggles.

### Durations

Durations provide a fallback and are used for CSS transitions and simple opacity fades.

-   **Microinteractions** (hover, press): `150ms` - `200ms`
-   **Component Transitions** (panels, modals): `250ms` - `350ms`
-   **Page/View Transitions**: `400ms` - `500ms`

### Accessibility: Reduced Motion

When the `reduceMotion` setting is enabled, animations should be either disabled or replaced with a simple, quick cross-fade.

```tsx
// Example in a Framer Motion component
const { reduceMotion } = useSettingsStore();

const transition = reduceMotion 
  ? { duration: 0.01 } 
  : { type: 'spring', stiffness: 400, damping: 30 };

<motion.div transition={transition} ... />
```
This ensures the UI remains functional without potentially disorienting motion.

## Reusable Motion Variants

These variants should be used to ensure consistency for common entrance and exit animations.

```ts
// Example Variant for fading in from below
export const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: [0.2, 0.9, 0.2, 1] 
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
        duration: 0.2,
        ease: 'easeOut'
    }
  }
};

// Example Variant for a list with staggered children
export const staggerList = {
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
  hidden: {},
};
```

## Specific Component Motion

-   **Omnibox**: Focus state animates a glowing ring (`scale` and `opacity`). Suggestions dropdown animates in using `fadeInUp`.
-   **Tabs**: Active tab indicator uses `layoutId` with the "Default Spring". Dragging uses a `whileDrag` prop to scale and lift the tab.
-   **Sidebar**: Animates `width` using the "Gentle Spring". Icons and labels fade/slide in a staggered sequence.
-   **Modals / Panels**: Enter the screen with a `scale` and `opacity` animation using the "Default Spring". The backdrop fades in simultaneously.
-   **List Items (Cards)**: On hover, `scale` to `1.02` and `box-shadow` animates. Items in a list stagger in using `staggerChildren`.
-   **Buttons/Toggles**: On hover, `scale` to `1.03`. On press (`whileTap`), `scale` to `0.97`. Toggles animate their knob with the "Quick Spring".
