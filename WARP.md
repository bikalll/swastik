# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is the **Swastik Interiors** website - a modern, responsive furniture and interior design company website built with vanilla HTML, CSS, and JavaScript. The project emphasizes premium design aesthetics, smooth animations, and interactive user experiences.

## Development Commands

### Running the Website
```powershell
# Start a local development server (Python)
python -m http.server 8000

# Alternative with Node.js http-server (if available)
npx http-server . -p 8000

# Or use Live Server extension in VS Code
# Right-click index.html → "Open with Live Server"
```

### Opening Files
```powershell
# Open main HTML file directly
.\index.html

# Open in VS Code
code .

# View in browser
start http://localhost:8000
```

### File Operations
```powershell
# Check file sizes (useful for optimization)
Get-ChildItem -Recurse | Measure-Object -Property Length -Sum

# Find all image files
Get-ChildItem -Recurse -Include *.jpg,*.png,*.svg
```

## Architecture Overview

### Core Structure
- **Single Page Application (SPA)** - All content in `index.html`
- **Modular CSS** - Organized with CSS custom properties (CSS variables)
- **Progressive JavaScript Enhancement** - Vanilla JS with modern features
- **Asset Management** - All images stored in `/assets` directory

### Key Components

#### 1. Header System (`site-header`)
- Fixed positioning with transparency/solid state transitions
- Dynamic background based on scroll position
- Mobile-responsive navigation with hamburger menu
- Dropdown submenus for "About Us" and "Our Services"

#### 2. Hero Section
- Full viewport height with background image
- CSS Grid layout for content centering
- Responsive typography with clamp() functions
- Call-to-action buttons with modern styling

#### 3. Interactive Sections
- **Janaki Legacy** - Heritage content with scroll animations
- **Features Grid** - Glassmorphism design cards
- **Collections** - Product showcase with hover effects
- **Testimonials Carousel** - Advanced slider with touch support
- **FAQ Accordion** - Luxury design with particle effects

#### 4. Animation System
- **Intersection Observer API** - Scroll-triggered animations
- **CSS Transitions** - Smooth state changes
- **Keyframe Animations** - Complex motion effects
- **Particle Systems** - Interactive visual elements

### CSS Architecture

#### Design System
```css
:root {
  /* Colors */
  --clr-accent: #7a5130;
  --clr-gold: #c4a37a;
  --clr-text: #1f1f1f;
  --clr-muted: #6b6b6b;
  
  /* Typography */
  --ff-serif: "Playfair Display", Georgia, serif;
  --ff-sans: "Inter", ui-sans-serif, system-ui;
  
  /* Spacing & Layout */
  --container: 1200px;
  --radius-sm: 8px;
  --radius-xl: 24px;
}
```

#### Component Patterns
- **BEM-like naming** - `.component__element--modifier`
- **Utility classes** - `.sr-only`, `.container`, `.btn--primary`
- **State classes** - `.is-open`, `.is-solid`, `.is-inview`
- **Animation classes** - `.jl-animate`, `.testimonials-animate`

### JavaScript Architecture

#### Class-Based Components
1. **TestimonialsCarousel** - Manages slideshow functionality
2. **FAQAccordion** - Handles expandable content sections

#### Feature Modules
- **Header Management** - Scroll-based state changes
- **Navigation** - Mobile menu and dropdown handling  
- **Scroll Animations** - Intersection Observer implementations
- **Interactive Effects** - Hover states and ripple effects
- **Keyboard Navigation** - Arrow key section jumping

#### Event Handling Patterns
- Passive scroll listeners for performance
- Debounced resize handlers
- Touch/swipe gesture support
- Keyboard accessibility

### Performance Considerations

#### Optimization Techniques
- CSS custom properties for theming efficiency
- Intersection Observer for lazy animations
- `transform` and `opacity` for smooth animations
- Passive event listeners where possible
- Minimal DOM manipulation

#### Asset Strategy
- Background images via CSS for better control
- SVG icons for scalability
- Image optimization recommended for `/assets` folder

### Styling Patterns

#### Modern CSS Features
- CSS Grid and Flexbox layouts
- Custom properties (CSS variables)
- `clamp()` for responsive typography
- `backdrop-filter` for glassmorphism effects
- CSS logical properties where appropriate

#### Component Styling
- Each major section has its own CSS block
- Consistent naming conventions
- Hover states and transitions defined together
- Mobile-first responsive design

## Development Notes

### Browser Compatibility
- Modern browsers (ES2018+ features used)
- CSS Grid and Flexbox support required
- Intersection Observer API needed
- Backdrop filter for premium effects

### Accessibility Features
- ARIA attributes throughout
- Semantic HTML structure
- Keyboard navigation support
- Screen reader announcements
- Focus management

### Mobile Responsiveness
- Responsive breakpoints at 768px primarily
- Touch-friendly interaction areas
- Swipe gestures on carousel
- Mobile navigation patterns

### Animation Performance
- Uses `transform` and `opacity` for animations
- Hardware acceleration with `will-change` where needed
- Reduced motion considerations via CSS
- Intersection Observer for scroll animations

## File Dependencies

### Critical Files
- `index.html` - Main structure
- `styles.css` - All styling (4000+ lines)
- `script.js` - All functionality (1400+ lines)

### Asset Dependencies
- `/assets/` - Images and media files
- Font loading via Google Fonts (commented out, using system fonts)
- No external JavaScript libraries (vanilla implementation)

### Development Dependencies
- Local server for file:// protocol limitations
- Modern browser for testing
- Code editor with HTML/CSS/JS support
