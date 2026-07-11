# Design Engineering (Emil Kowalski)

> Source: https://github.com/emilkowalski/skill — `skills/emil-design-eng/SKILL.md`
> Author: [Emil Kowalski](https://emilkowal.ski/)

---

## When invoked

When invoked without a specific question, responds with *"I'm ready to help you build interfaces that feel right"* and directs to [animations.dev](https://animations.dev).

---

## Core Philosophy

- **Taste is trained, not innate** — developed through deliberate study and practice.
- **Unseen details compound** — small, invisible refinements accumulate into a cohesive, excellent experience.
- **Beauty as leverage** — well-crafted UI makes software more effective, not just prettier.

---

## Review Format

When reviewing UI code, use a markdown table with three columns:

| Before | After | Why |
|--------|-------|-----|

---

## Animation Decision Framework

Four questions, in order:

### 1. Should it animate at all?
- Frequency-based decision tree
- **Keyboard actions = never animate** (accessibility & disorientation)

### 2. What's the purpose?
- Spatial consistency (where did that come from / go?)
- State indication (something changed)
- Explanation (cause and effect)
- Feedback (direct manipulation response)
- Preventing jarring changes (crossfade, dissolve)

### 3. What easing?
Decision tree:
| Scenario | Easing |
|----------|--------|
| Entering (appearing) | ease-out |
| Moving on screen | ease-in-out |
| Hover | ease (not built-in; custom cubic-bezier) |
| Constant / mechanical | linear |

Always prefer **custom cubic-bezier curves** over CSS built-in easings.

### 4. How fast?
| Element | Duration |
|---------|----------|
| Button press | 100–160ms |
| Tooltips | 125–200ms |
| Dropdowns | 150–250ms |
| Modals / dialogs | 200–500ms |
| General UI | under **300ms** |

---

## Springs

- **When to use:** drag interactions, elements that should feel "alive", gestures, decorative mouse-tracking effects.
- **Configuration approaches:** Apple-style (duration + bounce) vs traditional physics (mass, stiffness, damping).
- **Key advantage:** naturally interruptible — a spring中途で中断してもスムーズ。

---

## Component Principles

| Rule | Detail |
|------|--------|
| Button press | `scale(0.97)` on `:active` |
| Entry animation | Never from `scale(0)` — use `scale(0.95)` + `opacity: 0` |
| Popovers | Origin-aware positioning for entry animation |
| Tooltips | Skip delay on subsequent hovers (immediate for repeat triggers) |
| Technique preference | CSS transitions over CSS keyframes |
| Crossfades | Use `blur()` to mask imperfect crossfades between elements |
| Entry animations | Use `@starting-style` for CSS entry animations |
| Property restriction | Animate **only `transform` and `opacity`** — never layout/paint properties |
| Easing vars | Use `var(--ease-out-expo)` / `var(--ease-in-out-expo)` |
| Stagger | 30–80ms cascading delays between items |
| Entry/exit asymmetry | Entrance slower (deliberate), exit/release snappy |

---

## CSS Transform Mastery

- `translateY` with **percentages** for self-referential motion
- `scale()` affects **children** — be mindful of nested transforms
- 3D transforms need `preserve-3d` on the parent
- `transform-origin` anchors effects (popovers, tooltips, menus)

---

## clip-path Techniques

- **Inset shapes** for reveal animations
- **Tabs** with clip-path color transitions
- **Hold-to-delete** interactions
- **Image reveals** on scroll
- **Comparison sliders** with clip-path

---

## Gesture / Drag

- **Momentum-based dismissal** — threshold velocity > 0.11
- **Damping** at boundary (rubber-banding, not hard stops)
- **Pointer capture** for reliable drag tracking
- **Multi-touch protection** — prevent two-finger conflicts
- **Friction** over hard stops for natural deceleration

---

## Performance

- Animate **only `transform` and `opacity`** — skip layout/paint entirely
- CSS variables are **inheritable** — expensive on deeply nested parents
- Framer Motion's shorthand properties are **not GPU-accelerated**
- **CSS transitions** beat JS animation under load
- **WAAPI** (Web Animations API) as an alternative to JS libraries

---

## Accessibility

- `prefers-reduced-motion` — **still keep opacity/color transitions**; only disable movement/position animations
- Hover states must use:
  ```css
  @media (hover: hover) and (pointer: fine) { ... }
  ```

---

## Sonner Principles (Toast Library)

- DX matters more than features
- Good defaults over configuration options
- Naming creates identity for the library
- Handle edge cases invisibly (the user shouldn't notice)
- Transitions over keyframes
- Great documentation is a feature
- **Cohesion matters** — everything should feel like part of the same system
- **Asymmetric enter/exit timing** — enter is deliberate, exit is snappy

---

## Stagger

- **30–80ms** delays between items in a list/grid
- **Never block interaction** while staggering — elements should be interactive immediately, even if still animating in

---

## Debugging

- **Slow motion testing** — use `transition-duration: 3s` or DevTools slow-motion
- **Frame-by-frame inspection** in Chrome DevTools Animations panel
- **Test on real devices** — simulator/mockup ≠ real touch response

---

## Review Checklist

| Check | What to look for |
|-------|-----------------|
| `transition: all` | Replace with specific property lists |
| `scale(0)` entry | Replace with `scale(0.95)` + `opacity: 0` |
| ease-in misuse | Entering elements should use ease-out |
| transform-origin | Popovers/tooltips need origin-aware positioning |
| Keyboard animation | Should never animate |
| Duration > 300ms | UI elements should be under 300ms |
| Hover without media query | Add `@media (hover: hover) and (pointer: fine)` |
| Keyframes on frequent elements | Prefer CSS transitions |
| Framer Motion shorthand | Not GPU-accelerated — use explicit `transform` |
| Enter/exit asymmetry | Exit should be faster than enter |
| Missing stagger | List/grid items need 30–80ms delay |
