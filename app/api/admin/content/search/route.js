import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import { verifyJwtToken } from '@/lib/auth/jwt.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const contentType = searchParams.get('type') || 'all'; // all, courses, resources, announcements, users
    const sectorId = searchParams.get('sectorId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!searchQuery.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Search query is required'
      }, { status: 400 });
    }

    const searchTerm = `%${searchQuery.toLowerCase()}%`;
    let results = {
      courses: [],
      resources: [],
      announcements: [],
      users: [],
      total: 0
    };

    // Search in courses
    if (contentType === 'all' || contentType === 'courses') {
      const coursesQuery = `
        SELECT 
          c.id, c.title, c.description, c.level, c.duration_weeks, c.created_at,
          ls.name as sector_name, ls.color as sector_color,
          'course' as content_type
        FROM courses c
        LEFT JOIN learning_sectors ls ON c.sector_id = ls.id
        WHERE (LOWER(c.title) LIKE $1 OR LOWER(c.description) LIKE $1)
        ${sectorId ? 'AND c.sector_id = $2' : ''}
        AND c.is_active = true
        ORDER BY c.created_at DESC
        LIMIT ${limit}
      `;
      
      const coursesParams = sectorId ? [searchTerm, sectorId] : [searchTerm];
      const coursesResult = await query(coursesQuery, coursesParams);
      results.courses = coursesResult.rows;
    }

    // Search in resources
    if (contentType === 'all' || contentType === 'resources') {
      const resourcesQuery = `
        SELECT 
          r.id, r.title, r.description, r.resource_type, r.file_size, 
          r.download_count, r.created_at,
          ls.name as sector_name, ls.color as sector_color,
          'resource' as content_type
        FROM resources r
        LEFT JOIN learning_sectors ls ON r.sector_id = ls.id
        WHERE (LOWER(r.title) LIKE $1 OR LOWER(r.description) LIKE $1)
        ${sectorId ? 'AND r.sector_id = $2' : ''}
        ORDER BY r.created_at DESC
        LIMIT ${limit}
      `;
      
      const resourcesParams = sectorId ? [searchTerm, sectorId] : [searchTerm];
      const resourcesResult = await query(resourcesQuery, resourcesParams);
      results.resources = resourcesResult.rows;
    }

    // Search in announcements
    if (contentType === 'all' || contentType === 'announcements') {
      const announcementsQuery = `
        SELECT 
          id, title, content as description, announcement_type, priority, 
          target_audience, publish_date, created_at,
          'announcement' as content_type
        FROM announcements
        WHERE (LOWER(title) LIKE $1 OR LOWER(content) LIKE $1)
        AND is_active = true
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
      
      const announcementsResult = await query(announcementsQuery, [searchTerm]);
      results.announcements = announcementsResult.rows;
    }

    // Search in users
    if (contentType === 'all' || contentType === 'users') {
      const usersQuery = `
        SELECT 
          id, first_name, last_name, email, role, gender, 
          created_at, last_login,
          CONCAT(first_name, ' ', last_name) as full_name,
          'user' as content_type
        FROM users
        WHERE (LOWER(first_name) LIKE $1 OR LOWER(last_name) LIKE $1 OR LOWER(email) LIKE $1)
        AND role != 'admin'
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
      
      const usersResult = await query(usersQuery, [searchTerm]);
      results.users = usersResult.rows;
    }

    // Calculate total results
    results.total = results.courses.length + results.resources.length + 
                   results.announcements.length + results.users.length;

    // Create unified search results for "all" type
    let unifiedResults = [];
    if (contentType === 'all') {
      unifiedResults = [
        ...results.courses.map(item => ({ ...item, type: 'course' })),
        ...results.resources.map(item => ({ ...item, type: 'resource' })),
        ...results.announcements.map(item => ({ ...item, type: 'announcement' })),
        ...results.users.map(item => ({ ...item, type: 'user', title: item.full_name, description: `${item.role} - ${item.email}` }))
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    // Get search suggestions based on popular content
    const suggestionsQuery = `
      (SELECT title as suggestion, 'course' as type FROM courses 
       WHERE LOWER(title) LIKE $1 AND is_active = true LIMIT 3)
      UNION ALL
      (SELECT title as suggestion, 'resource' as type FROM resources 
       WHERE LOWER(title) LIKE $1 LIMIT 3)
      UNION ALL
      (SELECT title as suggestion, 'announcement' as type FROM announcements 
       WHERE LOWER(title) LIKE $1 AND is_active = true LIMIT 2)
    `;
    
    const suggestionsResult = await query(suggestionsQuery, [searchTerm]);

    return NextResponse.json({
      success: true,
      query: searchQuery,
      contentType,
      results: contentType === 'all' ? unifiedResults : results,
      suggestions: suggestionsResult.rows,
      metadata: {
        totalResults: results.total,
        searchTime: Date.now(),
        hasMore: results.total >= limit
      }
    });

  } catch (error) {
    console.error('Error searching content:', error);
    return NextResponse.json(
      { success: false, message: 'Search failed' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyJwtToken(token);
    const userResult = await query('SELECT role FROM users WHERE id = $1', [decoded.userId]);
    
    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { query: searchQuery, filters, action } = body;

    // Log search query for analytics
    if (action === 'log_search') {
      // In a real app, you'd log this to a search_logs table
      console.log('Admin search logged:', { searchQuery, filters, timestamp: new Date() });
      
      return NextResponse.json({
        success: true,
        message: 'Search logged successfully'
      });
    }

    // Advanced search with filters
    if (action === 'advanced_search') {
      const {
        dateRange,
        sectors,
        contentTypes,
        userRoles,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = filters || {};

      let conditions = [];
      let params = [];
      let paramIndex = 1;

      // Add search term condition
      if (searchQuery) {
        conditions.push(`(LOWER(title) LIKE $${paramIndex} OR LOWER(description) LIKE $${paramIndex})`);
        params.push(`%${searchQuery.toLowerCase()}%`);
        paramIndex++;
      }

      // Add date range filter
      if (dateRange?.start && dateRange?.end) {
        conditions.push(`created_at BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
        params.push(dateRange.start, dateRange.end);
        paramIndex += 2;
      }

      // Add sector filter
      if (sectors?.length > 0) {
        conditions.push(`sector_id = ANY($${paramIndex})`);
        params.push(sectors);
        paramIndex++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Execute advanced search (simplified example)
      const advancedQuery = `
        SELECT 
          id, title, description, created_at, 'course' as type
        FROM courses 
        ${whereClause}
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT 50
      `;

      const advancedResult = await query(advancedQuery, params);

      return NextResponse.json({
        success: true,
        results: advancedResult.rows,
        filters: filters,
        total: advancedResult.rows.length
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in advanced search:', error);
    return NextResponse.json(
      { success: false, message: 'Advanced search failed' },
      { status: 500 }
    );
  }
}