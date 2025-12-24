# Admin Articles Display Guide

## Overview
When admin creates and publishes articles through the admin content management system, they are displayed in the public articles section of the Fejrul Islam website.

## Article Creation Process

### 1. Admin Content Management
- Navigate to `/admin/content`
- Click on the "Articles" tab
- Click "Add New" to create a new article
- Fill in the article form with:
  - **Title**: Article headline
  - **Description**: Brief summary
  - **Content**: Full article text
  - **Sector**: Choose from available sectors
  - **Target Audience**: All users, students only, etc.
  - **Author**: Author name (defaults to "Fejrul Islam")
  - **Status**: Draft, Review, Published, or Archived
  - **Image URL**: Optional featured image

### 2. Article Status Flow
- **Draft**: Article is saved but not visible to public
- **Review**: Article is pending review (not visible to public)
- **Published**: Article is live and visible to all users
- **Archived**: Article is hidden from public view

## Where Published Articles Appear

### 1. Main Articles Page (`/articles`)
- **URL**: `https://yoursite.com/articles`
- **Access**: Available to all visitors (no login required)
- **Features**:
  - Grid layout showing all published articles
  - Search functionality
  - Filter by sector
  - Sort by newest, oldest, popular, or alphabetical
  - Article cards show title, description, author, date, reading time
  - View count and like count display

### 2. Individual Article Pages (`/articles/[slug]`)
- **URL**: `https://yoursite.com/articles/article-slug`
- **Access**: Available to all visitors
- **Features**:
  - Full article content display
  - Author information and publication date
  - Reading time estimate
  - View counter (automatically incremented)
  - Like/unlike functionality
  - Social sharing buttons (Facebook, Twitter, LinkedIn, Copy Link)
  - Related articles section
  - Breadcrumb navigation

### 3. Navigation Integration
- Articles link added to main site navigation header
- Accessible from any page via the "Articles" menu item

## Article Management Features

### Admin Features
- **Real-time Updates**: Articles appear immediately after publishing
- **Edit Functionality**: Update articles anytime through admin panel
- **Delete Capability**: Remove articles permanently
- **Status Management**: Change article status (draft ↔ published ↔ archived)
- **View Analytics**: See view counts and engagement metrics
- **Preview**: View published articles directly from admin panel

### Public Features
- **Search**: Find articles by title, description, or content
- **Filter by Sector**: Show articles from specific sectors only
- **Responsive Design**: Works on desktop, tablet, and mobile
- **SEO Friendly**: Each article has unique URL and meta information
- **Social Sharing**: Easy sharing on social media platforms

## Database Structure

### Articles Table
```sql
- id: Unique identifier
- title: Article title
- description: Brief summary
- content: Full article text
- sector: Associated sector
- target_audience: Intended audience
- status: Publication status
- slug: URL-friendly identifier
- image_url: Featured image
- author: Article author
- views: View count
- likes: Like count
- created_at: Creation timestamp
- updated_at: Last modification timestamp
```

### Article Likes Table
```sql
- id: Unique identifier
- article_id: Reference to article
- user_id: Reference to user (optional)
- created_at: Like timestamp
```

## Content Guidelines

### Best Practices for Article Creation
1. **Clear Titles**: Use descriptive, engaging titles
2. **Compelling Descriptions**: Write summaries that encourage reading
3. **Quality Content**: Provide valuable, well-structured information
4. **Appropriate Sectoring**: Assign articles to relevant sectors
5. **Author Attribution**: Credit the appropriate author
6. **Image Selection**: Use relevant, high-quality images when available

### Content Standards
- All content should align with Islamic values and Fejrul Islam's mission
- Articles should be educational, inspirational, or informative
- Maintain respectful and scholarly tone
- Ensure accuracy of Islamic information
- Provide proper citations when referencing sources

## Technical Implementation

### API Endpoints
- `GET /api/articles` - Fetch published articles
- `GET /api/articles/[slug]` - Fetch specific article
- `POST /api/articles/[slug]/like` - Like/unlike article
- `POST /api/admin/articles` - Create article (admin only)
- `PUT /api/admin/articles` - Update article (admin only)
- `DELETE /api/admin/articles` - Delete article (admin only)

### Security Features
- Admin authentication required for content management
- Public access for reading published articles
- Rate limiting on like functionality
- Input validation and sanitization

## Monitoring and Analytics

### Available Metrics
- **View Counts**: Track article popularity
- **Like Counts**: Measure engagement
- **Search Terms**: Understand user interests
- **Sector Performance**: See which topics are most popular

### Admin Dashboard Integration
- Article statistics visible in admin content management
- Quick access to edit or delete articles
- Status indicators for easy management
- Direct links to view published articles

## Troubleshooting

### Common Issues
1. **Article Not Appearing**: Check status is set to "Published"
2. **Broken Links**: Verify slug generation is working correctly
3. **Image Not Loading**: Check image URL is valid and accessible
4. **Search Not Working**: Ensure database indexes are properly created

### Support
For technical issues or questions about article management, contact the system administrator or refer to the main troubleshooting guide.

---

**Summary**: Admin-created articles are displayed on the public `/articles` page when their status is set to "Published". The system provides a complete article management and display solution with search, filtering, engagement features, and responsive design.