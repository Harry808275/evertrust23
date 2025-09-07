# 🎨 Content Management System

## Overview

The Content Management System allows admins to control **ALL** frontend content from the admin panel, including:

- **Hero Banners** - Main homepage video/image with customizable text
- **Section Banners** - Promotional content sections
- **Content Sections** - Informational sections with media
- **Footer Content** - Bottom page content
- **Dynamic Text** - All titles, subtitles, and descriptions
- **Media Control** - Videos, images, and their settings
- **Visual Customization** - Colors, opacity, animations

## 🚀 Quick Start

### 1. Access Content Management

1. Sign in as admin at `/auth/signin`
2. Go to `/admin` 
3. Click the **"Content"** tab
4. Start creating your dynamic content!

### 2. Seed Sample Content

Run this command to add sample content for testing:

```bash
npm run seed-content
```

This will create:
- Hero banner with your video
- Sample banner sections
- Content sections with images
- All fully customizable

## 📝 Content Types

### Hero Banner (`type: 'hero'`)
- **Purpose**: Main homepage banner (full-screen)
- **Media**: Video or image background
- **Content**: Title, subtitle, description, button
- **Settings**: Overlay opacity, text colors, animations

### Section Banner (`type: 'banner'`)
- **Purpose**: Promotional sections throughout the page
- **Media**: Images or videos
- **Content**: Title, subtitle, description, call-to-action
- **Order**: Control display sequence

### Content Section (`type: 'section'`)
- **Purpose**: Informational content with media
- **Media**: Images or videos with descriptions
- **Content**: Educational or promotional content
- **Layout**: Centered with media and text

### Footer (`type: 'footer'`)
- **Purpose**: Bottom page content
- **Media**: Optional background images
- **Content**: Links, information, branding

## 🎛️ Customization Options

### Media Settings
- **Type**: Video or Image
- **URL**: Direct link or uploaded file
- **Alt Text**: Accessibility description
- **Poster**: Video thumbnail image

### Visual Settings
- **Overlay Opacity**: 0.0 to 1.0 (transparent to solid)
- **Text Color**: Any hex color
- **Background Color**: Optional gradient overlay
- **Animation**: Fade, Slide, Zoom, or None

### Content Settings
- **Title**: Main heading text
- **Subtitle**: Secondary text
- **Description**: Detailed explanation
- **Button Text**: Call-to-action text
- **Button Link**: Where button leads

## 🔧 How It Works

### Frontend Integration
The homepage (`/`) automatically:
1. Fetches active content from database
2. Renders dynamic sections based on content type
3. Applies custom styling and animations
4. Falls back to default content if none configured

### Admin Control
- **Create**: Add new content sections
- **Edit**: Modify existing content
- **Delete**: Remove unwanted sections
- **Activate/Deactivate**: Show/hide content
- **Reorder**: Control display sequence

## 📱 Responsive Design

All content automatically:
- Adapts to mobile and desktop
- Maintains aspect ratios
- Optimizes for different screen sizes
- Uses Next.js Image optimization

## 🎯 Best Practices

### Hero Banner
- Use high-quality video (MP4) or images
- Keep text concise and readable
- Test overlay opacity for text visibility
- Ensure button leads to relevant page

### Section Banners
- Create compelling headlines
- Use relevant images/videos
- Include clear call-to-action
- Maintain consistent branding

### Content Sections
- Tell your brand story
- Use high-quality media
- Keep descriptions engaging
- Link to relevant pages

## 🚨 Troubleshooting

### Content Not Showing
1. Check if content is marked as `isActive: true`
2. Verify media URLs are accessible
3. Check browser console for errors
4. Ensure content type is correct

### Media Not Loading
1. Verify file exists in `/public` folder
2. Check file permissions
3. Use relative paths (e.g., `/lv-hero.mp4`)
4. Test with different file formats

### Styling Issues
1. Check color values are valid hex codes
2. Verify opacity values are between 0-1
3. Test animations work in browser
4. Check for CSS conflicts

## 🔄 Content Updates

### Real-time Changes
- Content updates immediately after saving
- No need to restart server
- Changes visible on next page refresh
- Admin can preview before publishing

### Version Control
- All changes are timestamped
- Easy to revert to previous versions
- Track content evolution over time
- Maintain content history

## 🌟 Advanced Features

### Conditional Rendering
- Show/hide content based on conditions
- Seasonal content management
- A/B testing different content
- Personalized user experiences

### SEO Optimization
- Alt text for accessibility
- Structured content for search engines
- Meta descriptions from content
- Optimized image loading

### Performance
- Lazy loading for media
- Optimized image delivery
- Efficient database queries
- Minimal impact on page speed

## 📊 Analytics Integration

Track content performance:
- View counts for each section
- User engagement metrics
- Conversion tracking
- Content effectiveness analysis

## 🎨 Design System

### Color Palette
- Primary: Amber (#fbbf24)
- Secondary: Black (#000000)
- Text: Gray variations
- Custom: Any hex color

### Typography
- Headings: Custom font family
- Body: Readable sans-serif
- Consistent sizing scale
- Responsive text scaling

### Spacing
- Consistent padding/margins
- Responsive grid system
- Mobile-first approach
- Professional layout standards

---

## 🚀 Get Started Now!

1. **Sign in as admin** at `/auth/signin`
2. **Go to admin panel** at `/admin`
3. **Click Content tab** to manage frontend
4. **Create your first content** section
5. **Customize everything** from the admin panel!

Your e-commerce site is now **100% controllable** from the admin panel! 🎉

