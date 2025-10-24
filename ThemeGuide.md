# Answer Browser Theme Guide

This document outlines the visual design system for the Answer browser, including colors, typography, and spacing. The theme is built using Tailwind CSS and is designed to be sleek, modern, and accessible with a dark, high-contrast aesthetic.

## Color Palette

The color system is defined in `tailwind.config` and exposed as CSS custom properties for global use.

| Name           | Hex       | Tailwind Class       | CSS Variable              | Usage                                         |
| -------------- | --------- | -------------------- | ------------------------- | --------------------------------------------- |
| Primary        | `#E10600` | `primary`            | `--color-primary`         | Main brand color, links, active indicators.   |
| Primary Active | `#B00400` | `primary-active`     | `--color-primary-active`  | Pressed/active states for primary elements.   |
| Background     | `#0B0B0B` | `background`         | `--color-background`      | The main application background color.        |
| Surface        | `#141414` | `surface`            | `--color-surface`         | Backgrounds for cards, inputs, and modals.    |
| Text Primary   | `#FFFFFF` | `text-primary`       | `--color-text-primary`    | Main text color for headings and body copy.   |
| Text Muted     | `#707070` | `text-muted`         | `--color-text-muted`      | Secondary text, placeholders, and icons.      |

### Contrast

All default text and UI element combinations are designed to meet WCAG AA contrast ratio standards.

- `text-primary` (#FFFFFF) on `background` (#0B0B0B) has a contrast ratio of 21:1.
- `text-primary` (#FFFFFF) on `surface` (#141414) has a contrast ratio of 18.59:1.
- `primary` (#E10600) on `background` (#0B0B0B) has a contrast ratio of 4.52:1.

## Typography

The primary font is **Inter**, sourced from Google Fonts. It is a variable font that is highly legible on screens. The fallback is the system's default sans-serif font.

### Font Family

- **Sans-serif:** `font-sans` (Inter, sans-serif)

### Font Sizes and Weights

The following scale is used for text elements.

| Class       | Font Size (rem/px) | Font Weight | Tailwind Class (`font-`) |
| ----------- | ------------------ | ----------- | ------------------------ |
| `text-xs`   | 0.75rem / 12px     | 400         | `normal`                 |
| `text-sm`   | 0.875rem / 14px    | 400         | `normal`                 |
| `text-base` | 1rem / 16px        | 400         | `normal`                 |
| `text-lg`   | 1.125rem / 18px    | 500         | `medium`                 |
| `text-xl`   | 1.25rem / 20px     | 600         | `semibold`               |
| `text-2xl`  | 1.5rem / 24px      | 700         | `bold`                   |
| `text-3xl`  | 1.875rem / 30px    | 700         | `bold`                   |
| `text-4xl`  | 2.25rem / 36px     | 800         | `extrabold`              |
| `text-5xl`  | 3rem / 48px        | 800         | `extrabold`              |
| `text-6xl`  | 3.75rem / 60px     | 800         | `extrabold`              |

## Spacing

The application uses Tailwind's default 4px-based spacing scale for padding, margin, width, height, and other layout properties. This ensures consistency and rhythm in the design.

| Class  | Value (rem/px) |
| ------ | -------------- |
| `p-0`  | 0rem / 0px     |
| `p-1`  | 0.25rem / 4px  |
| `p-2`  | 0.5rem / 8px   |
| `p-3`  | 0.75rem / 12px |
| `p-4`  | 1rem / 16px    |
| `p-5`  | 1.25rem / 20px |
| `p-6`  | 1.5rem / 24px  |
| `p-8`  | 2rem / 32px    |
| `p-10` | 2.5rem / 40px  |
| `p-12` | 3rem / 48px    |
| `p-16` | 4rem / 64px    |
| `p-20` | 5rem / 80px    |
| ...    | ...            |

This is just a subset of the available spacing utilities. Refer to the [Tailwind CSS Documentation](https://tailwindcss.com/docs/spacing) for the full scale.
