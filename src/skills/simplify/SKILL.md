# Simplify

## Description
Behavior-preserving code simplification for readability and maintainability. Reduces unnecessary complexity, improves naming and structure, and keeps simplification work scoped and reviewable.

## When to Use
- Code that is hard to understand at first glance
- Functions or methods that do too many things
- Deeply nested conditionals or loops
- Duplicated logic across files
- Over-engineered solutions for simple problems (YAGNI)
- Before adding new features to complex code
- During code review when maintainability is flagged

## Principles

### YAGNI (You Aren't Gonna Need It)
Remove abstractions, interfaces, and patterns that don't serve an immediate, concrete purpose. Every layer of indirection must justify its existence.

### Single Responsibility
Each function, class, and module should have one clear reason to change. If you need "and" to describe what something does, it does too much.

### Name for Intent
- Variables: what they contain (not their type)
- Functions: what they do or return (verb or noun)
- Classes: what they represent (noun)
- Avoid: `data`, `info`, `obj`, `temp`, `result` (unless truly generic)
- Prefer: `customerEmail`, `calculateTax()`, `OrderRepository`

### Reduce Nesting
- Use early returns instead of deep if-else chains
- Extract nested loops into named functions
- Use guard clauses at function entry
- Max recommended nesting depth: 3 levels

### Keep It Scoped
- Simplify one piece at a time
- Keep diffs small and reviewable
- Don't mix simplification with feature changes
- Run tests between each simplification step

## Simplification Checklist
- [ ] Can a junior developer understand this in 5 minutes?
- [ ] Are names accurate and revealing?
- [ ] Is every abstraction pulling its weight?
- [ ] Could nesting be reduced?
- [ ] Are there duplicated blocks that could be extracted?
- [ ] Does the code follow the principle of least surprise?
- [ ] Are comments explaining "why" (not "what")?
- [ ] Do all tests still pass?
