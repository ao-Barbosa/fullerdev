# Frontend UI/UX

## Description
Designer-turned-developer skill for crafting stunning user interfaces even without design mockups. Emphasizes bold aesthetic direction, distinctive typography, cohesive color palettes, and intentional micro-interactions. This skill teaches agents to approach frontend work with a designer's eye.

## When to Use
- Building new user interfaces
- Redesigning or refreshing existing UI
- Creating landing pages or marketing sites
- Adding animations and transitions
- Ensuring accessibility (a11y) compliance
- Reviewing UI/UX quality

## Design Philosophy

### Intentional over Decorative
Every visual choice should serve a purpose. Before adding any element, ask: "What does this communicate to the user? What action does it encourage?"

### Consistency over Novelty
Use established patterns. Only innovate when it genuinely improves the user experience. Consistent UI builds user trust and reduces cognitive load.

### Mobile-First
Design for the smallest screen first. Ensure touch targets are adequate (minimum 44px). Test layout at 320px, 768px, 1024px, and 1440px.

### Accessibility is Non-Negotiable
- WCAG 2.1 AA minimum
- Proper heading hierarchy (h1 → h2 → h3)
- Sufficient color contrast (4.5:1 for text, 3:1 for large text)
- Keyboard navigation support
- Screen reader-friendly ARIA labels
- Focus indicators for all interactive elements

## Visual System

### Color
- Define a cohesive palette: primary, secondary, accent, neutral, semantic (success, warning, error, info)
- Use CSS custom properties for theming
- Dark mode support via `prefers-color-scheme` media query or toggle

### Typography
- Choose 1-2 font families maximum
- Define a clear type scale (e.g., 12px, 14px, 16px, 20px, 24px, 32px, 48px)
- Use relative units (rem/em) for accessibility
- Line-height: 1.5 for body text, 1.2 for headings

### Spacing
- Use a consistent spacing scale (4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96)
- Spacing should relate elements: closer = related, further = separate

### States
Always implement: default, hover, focus, active, disabled, loading, empty, error, success

## Implementation Checklist
- [ ] Responsive at 320px, 768px, 1024px, 1440px
- [ ] All interactive elements have focus styles
- [ ] Color contrast passes WCAG AA
- [ ] Semantic HTML used appropriately
- [ ] Loading and empty states handled
- [ ] Error states shown gracefully
- [ ] Typography scale is consistent
- [ ] Spacing system is applied uniformly
- [ ] Animations respect `prefers-reduced-motion`
