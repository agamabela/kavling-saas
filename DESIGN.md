# KavlingSaaS Design System Specification (Anti-Slop Guidelines)

## 1. Palette & Surfaces
- **Neutrals**: Deep obsidian slate (`#0B0F19`, `#0F172A`), crisp architectural canvas (`#F8FAFC`, `#FFFFFF`), borders with physical substance (`#E2E8F0`, `#CBD5E1`).
- **Brand Primary**: Property Emerald (`#059669` / `#10B981`) — represents Indonesian property growth, closing, and financial stability.
- **Interactive Secondary**: Direct Cobalt (`#2563EB`) — used strictly for interactive controls, inputs, and links.
- **Forbidden AI Tells**:
  - ❌ NO generic purple-to-blue or violet gradient backgrounds.
  - ❌ NO blurred glowing radial orbs behind cards.
  - ❌ NO excessive glassmorphism / backdrop-filter on every card.
  - ❌ NO uniform pill-shapes on every element; use distinct 8px (`rounded-lg`) for inputs and 12px-16px (`rounded-xl`/`rounded-2xl`) for structured cards.

## 2. Typography & Hierarchy
- Clean grotesque system fonts with tight headline tracking (`tracking-tight`).
- Monospace numerals (`font-mono`) for monetary IDR values, plot numbers, and NIK/NPWP identifiers.
- Micro-copy with domain authority: use authentic Indonesian banking and real estate terminology (*Plafon KPR*, *Akad Kredit*, *Surat Penegasan*, *BI Checking / SLIK OJK*, *Kepmen PUPR*).

## 3. Structural Inspirations
- **Navbar**: [navbar.gallery](https://navbar.gallery/) — clean floating/structural shell, command palette trigger (`⌘K`), and role switcher.
- **Hero**: [supahero.io](https://supahero.io/) — bold editorial title, live pipeline status HUD, real estate trust proof.
- **Pricing**: [pricingpages.design](https://pricingpages.design/) — transparent developer SaaS tiers in IDR with unit caps.
- **CTA**: [cta.gallery](https://cta.gallery/) — focused conversion block with direct WhatsApp booking.
- **Footer**: [footer.design](https://footer.design/) — rich multi-column footer with regulatory and partner bank directory.
