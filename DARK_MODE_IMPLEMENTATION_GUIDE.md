# Dark Mode Implementation Guide - Fejrul Islam Website

## Overview
A comprehensive dark mode system has been implemented for the Fejrul Islam website, providing users with a seamless light/dark theme experience that respects system preferences and maintains Islamic aesthetic values.

## Features Implemented

### 1. Theme Context System
- **ThemeProvider**: React context for global theme management
- **useTheme Hook**: Easy access to theme state and controls
- **Persistent Storage**: Theme preference saved in localStorage
- **System Preference Detection**: Automatically detects user's system theme preference

### 2. Theme Toggle Components
- **Simple Toggle**: Basic light/dark switch for headers
- **Dropdown Toggle**: Advanced options with theme selection
- **Button Toggle**: Full button with text labels
- **Responsive Design**: Works on all screen sizes

### 3. Comprehensive CSS System
- **CSS Custom Properties**: Dynamic color variables for both themes
- **Utility Classes**: Pre-built classes for common dark mode patterns
- **Smooth Transitions**: 200ms transitions for all theme changes
- **Islamic Color Palette**: Emerald/teal colors adapted for dark mode

## Implementation Details

### Theme Context (`/contexts/ThemeContext.js`)
```javascript
// Provides theme state management
const { theme, toggleTheme, isDark, isLight } = useTheme();
```

### Theme Toggle (`/components/ui/ThemeToggle.js`)
```javascript
// Three variants available
<ThemeToggle variant="simple" />     // Icon only
<ThemeToggle variant="dropdown" />   // Dropdown menu
<ThemeToggle variant="button" />     // Full button
```

### CSS Classes for Dark Mode
```css
/* Background gradients */
.bg-gradient-light    /* Light mode gradient */
.bg-gradient-dark     /* Dark mode gradient */

/* Card styles */
.card-light          /* Light mode cards */
.card-dark           /* Dark mode cards */

/* Text colors */
.text-primary-light  /* Primary text light */
.text-primary-dark   /* Primary text dark */
.text-secondary-light /* Secondary text light */
.text-secondary-dark  /* Secondary text dark */

/* Interactive elements */
.btn-primary         /* Primary buttons */
.btn-secondary       /* Secondary buttons */
.input-primary       /* Form inputs */
.nav-link           /* Navigation links */
```

## Color Scheme

### Light Mode
- **Background**: Slate-50 to White gradients
- **Cards**: Pure white with slate borders
- **Text Primary**: Slate-900
- **Text Secondary**: Slate-600
- **Accent**: Emerald-600 to Teal-600

### Dark Mode
- **Background**: Slate-900 to Emerald-950 gradients
- **Cards**: Slate-800 with slate-700 borders
- **Text Primary**: Slate-100
- **Text Secondary**: Slate-400
- **Accent**: Emerald-400 to Teal-400

## Pages Updated with Dark Mode

### 1. Main Homepage (`/app/page.js`)
- ✅ Islamic header with dark mode gradients
- ✅ Hero section with adaptive colors
- ✅ Statistics cards with dark variants
- ✅ Action buttons with theme-aware styles
- ✅ Features section with dark mode support
- ✅ Sectors grid with adaptive cards
- ✅ Quranic verses with enhanced dark styling

### 2. Articles System
- ✅ Articles listing page (`/articles/page.js`)
- ✅ Individual article pages (`/articles/[slug]/page.js`)
- ✅ Search and filter components
- ✅ Article cards with dark mode styling

### 3. Layout Components
- ✅ Main Header with theme toggle
- ✅ Navigation links with dark mode colors
- ✅ Logo with proper dark mode handling

### 4. Global Styles
- ✅ Comprehensive dark mode CSS variables
- ✅ Smooth transitions for all elements
- ✅ Custom scrollbar styling
- ✅ Selection colors for both themes
- ✅ Focus indicators adapted for dark mode

## Islamic Design Considerations

### 1. Color Harmony
- Maintained emerald/teal Islamic color scheme
- Adapted brightness for dark mode readability
- Preserved Arabic text styling and shadows

### 2. Accessibility
- High contrast ratios in both themes
- Proper focus indicators
- Readable text on all backgrounds
- Smooth transitions to reduce eye strain

### 3. Cultural Sensitivity
- Logo remains unchanged in dark mode
- Arabic text maintains proper styling
- Quranic verses have enhanced shadows in dark mode
- Islamic geometric patterns preserved

## Usage Instructions

### For Users
1. **Automatic Detection**: Theme automatically matches system preference
2. **Manual Toggle**: Click theme toggle in header to switch
3. **Persistent**: Choice is remembered across sessions
4. **Smooth Transition**: All elements transition smoothly

### For Developers
1. **Use Theme Hook**: `const { isDark, toggleTheme } = useTheme()`
2. **Apply CSS Classes**: Use utility classes like `text-primary-light text-primary-dark`
3. **Conditional Styling**: Use `isDark` for JavaScript-based styling
4. **Test Both Modes**: Always test components in both light and dark modes

## Browser Support
- ✅ Chrome/Edge (CSS custom properties)
- ✅ Firefox (CSS custom properties)
- ✅ Safari (CSS custom properties)
- ✅ Mobile browsers (responsive design)

## Performance Considerations
- **CSS Variables**: Efficient theme switching without re-rendering
- **Minimal JavaScript**: Theme logic is lightweight
- **Cached Preferences**: localStorage prevents theme flashing
- **Optimized Transitions**: 200ms duration for smooth experience

## Future Enhancements

### Planned Features
1. **Auto Theme Scheduling**: Automatic light/dark based on time
2. **High Contrast Mode**: Enhanced accessibility option
3. **Custom Color Themes**: User-selectable color variations
4. **Reduced Motion**: Respect user's motion preferences

### Additional Pages to Update
1. Dashboard pages (student/mentor/admin)
2. Authentication pages (login/signup)
3. Sector-specific pages
4. Learning and course pages
5. Settings and profile pages

## Testing Checklist

### Visual Testing
- [ ] All text is readable in both themes
- [ ] Images display properly in dark mode
- [ ] Buttons and interactive elements are visible
- [ ] Borders and shadows work in both themes
- [ ] Arabic text maintains proper styling

### Functional Testing
- [ ] Theme toggle works correctly
- [ ] Preference is saved and restored
- [ ] System preference detection works
- [ ] Smooth transitions between themes
- [ ] No layout shifts during theme change

### Accessibility Testing
- [ ] Sufficient color contrast ratios
- [ ] Focus indicators visible in both themes
- [ ] Screen reader compatibility
- [ ] Keyboard navigation works
- [ ] No motion for users with motion sensitivity

## Troubleshooting

### Common Issues
1. **Theme Flashing**: Ensure ThemeProvider wraps entire app
2. **Colors Not Updating**: Check CSS custom property usage
3. **Preference Not Saving**: Verify localStorage access
4. **Transitions Jerky**: Confirm transition properties are set

### Debug Tools
- Browser DevTools for CSS custom properties
- React DevTools for theme context state
- Lighthouse for accessibility testing
- Color contrast analyzers for compliance

---

**Summary**: The Fejrul Islam website now features a comprehensive dark mode system that maintains Islamic aesthetic values while providing excellent user experience across all devices and preferences. The implementation uses modern CSS techniques and React context for efficient, accessible theme switching.