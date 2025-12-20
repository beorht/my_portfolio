# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static portfolio website showcasing a full-stack developer's skills, projects, and experience. The site features modern animations, smooth scrolling navigation, and responsive design. Built as a single-page application deployed via GitHub Pages.

**Technology Stack:**
- Pure HTML5, CSS3, and vanilla JavaScript
- No build tools or dependencies
- Deployed automatically via GitHub Actions to GitHub Pages

## Deployment

The site is automatically deployed to GitHub Pages on every push to the `main` branch via `.github/workflows/static.yml`. Changes pushed to main are immediately published.

**Live URL:** The deployment URL is available in the GitHub Pages settings and workflow outputs.

## Project Structure

```
/
├── index.html          # Main HTML file (Russian language)
├── style.css           # All styles including animations
├── img/                # Image assets (avatar, backgrounds)
│   └── behruz.png     # Profile avatar image
└── .github/workflows/
    └── static.yml     # GitHub Pages deployment workflow
```

## Design Architecture

**Single-Page Navigation:**
- Vertical scroll-based sections with anchor links
- Sidebar navigation (left side) with section highlighting
- Smooth scroll behavior via JavaScript
- Sections: MAIN, ABOUT, SKILLS, PROJECTS, EDUCATION, CONTACT

**CSS Architecture:**
- CSS custom properties (`:root`) for theming and color management
- Responsive breakpoints: 1024px, 768px
- Grid and Flexbox layouts throughout
- Complex animations using keyframes

**Key Visual Components:**

1. **Hero Section:**
   - Animated avatar with breathing light effect
   - Floating cyan circles with staggered animations
   - Animated fish swimming across screen (5 fish with different paths/timings)
   - Large background text "Dev"

2. **Skills Grid:**
   - 3-column grid (responsive to 2-col, then 1-col on mobile)
   - Color-coded categories using `:nth-child()` selectors
   - Hover effects with transform and shadow

3. **Terminal Window (Contact):**
   - VS Code-style terminal UI showing JSON contact card
   - Syntax highlighting with custom classes (`.json-key`, `.json-string`, etc.)
   - Line numbers and toolbar icons

4. **Snowflakes Animation:**
   - 20 individual snowflakes with unique positions and timing
   - Continuous falling animation throughout content section

**JavaScript Behavior:**
- Scroll position tracking for active nav highlighting
- Smooth scroll to section anchors
- IntersectionObserver for project card animations
- Prevents auto-scroll on page load/reload

## Development Notes

**Editing Content:**
- All text is in Russian - maintain language consistency when editing
- Profile information is in the JSON terminal at `#contact` section
- Project cards have `onclick` handlers linking to GitHub repos
- Skills are organized in `.skill-category` divs with class-based styling

**Styling Conventions:**
- Color variables are in `:root` - modify there for theme changes
- Animation delays use `nth-child` selectors extensively
- Mobile-first not used - desktop styles are primary, mobile overrides in media queries

**Animation Performance:**
- Fish animations use `transform` and `opacity` for GPU acceleration
- Intersection Observer used to re-trigger project animations on scroll
- Snowflakes use individual keyframe animations (not performant at scale)

**Common Tasks:**
- Update profile info: Edit JSON structure in `index.html` lines ~362-375
- Add project: Add new `.project-card` div with GitHub link in `onclick`
- Modify colors: Update CSS custom properties in `:root` (lines 1-32 of `style.css`)
- Add skill category: Insert new `.skill-category` div in skills grid (styling auto-applied via nth-child)

## Responsive Behavior

- Sidebar nav hidden on mobile (`display: none` below 768px)
- Hero layout switches from horizontal to vertical flex on mobile
- Fish size scales down on mobile devices
- Terminal font size and padding reduce on mobile
- Grid columns collapse: 3 → 2 → 1 based on viewport width
