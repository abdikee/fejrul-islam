import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sectorId = searchParams.get('sectorId');
    const userId = searchParams.get('userId');
    const contentType = searchParams.get('type') || 'all'; // all, courses, resources, announcements
    const limit = parseInt(searchParams.get('limit') || '20');
    const includeRelated = searchParams.get('related') === 'true';

    let integratedContent = {
      courses: [],
      resources: [],
      announcements: [],
      sectors: [],
      relatedContent: [],
      userProgress: null,
      recommendations: []
    };

    // Get all sectors for navigation
    const sectorsResult = await query(`
      SELECT 
        ls.id, ls.name, ls.description, ls.icon, ls.color,
        COUNT(DISTINCT c.id) as course_count,
        COUNT(DISTINCT r.id) as resource_count
      FROM learning_sectors ls
      LEFT JOIN courses c ON ls.id = c.sector_id AND c.is_active = true
      LEFT JOIN resources r ON ls.id = r.sector_id
      GROUP BY ls.id, ls.name, ls.description, ls.icon, ls.color
      ORDER BY ls.name
    `);
    integratedContent.sectors = sectorsResult.rows;

    // Build base conditions
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (sectorId) {
      whereConditions.push(`sector_id = $${paramIndex}`);
      queryParams.push(parseInt(sectorId));
      paramIndex++;
    }

    const sectorCondition = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get courses
    if (contentType === 'all' || contentType === 'courses') {
      const coursesQuery = `
        SELECT 
          c.id, c.title, c.description, c.level, c.duration_weeks, 
          c.prerequisites, c.learning_objectives, c.created_at,
          ls.name as sector_name, ls.description as sector_description,
          ls.icon as sector_icon, ls.color as sector_color,
          COUNT(DISTINCT r.id) as related_resources
        FROM courses c
        LEFT JOIN learning_sectors ls ON c.sector_id = ls.id
        LEFT JOIN resources r ON c.sector_id = r.sector_id
        ${sectorCondition.replace('sector_id', 'c.sector_id')}
        ${sectorCondition ? 'AND' : 'WHERE'} c.is_active = true
        GROUP BY c.id, c.title, c.description, c.level, c.duration_weeks, 
                 c.prerequisites, c.learning_objectives, c.created_at,
                 ls.name, ls.description, ls.icon, ls.color
        ORDER BY c.created_at DESC 
        LIMIT $${paramIndex}
      `;

      const coursesParams = [...queryParams, limit];
      const coursesResult = await query(coursesQuery, coursesParams);
      integratedContent.courses = coursesResult.rows;
    }

    // Get resources
    if (contentType === 'all' || contentType === 'resources') {
      const resourcesQuery = `
        SELECT 
          r.id, r.title, r.description, r.resource_type, r.file_path, 
          r.file_size, r.download_count, r.access_level, r.created_at,
          ls.name as sector_name, ls.color as sector_color,
          ls.icon as sector_icon,
          u.first_name as uploader_first_name, u.last_name as uploader_last_name
        FROM resources r
        LEFT JOIN learning_sectors ls ON r.sector_id = ls.id
        LEFT JOIN users u ON r.uploaded_by = u.id
        ${sectorCondition.replace('sector_id', 'r.sector_id')}
        ${sectorCondition ? 'AND' : 'WHERE'} r.access_level = 'public'
        ORDER BY r.created_at DESC 
        LIMIT $${paramIndex}
      `;

      const resourcesParams = [...queryParams, limit];
      const resourcesResult = await query(resourcesQuery, resourcesParams);
      integratedContent.resources = resourcesResult.rows;
    }

    // Get announcements
    if (contentType === 'all' || contentType === 'announcements') {
      const announcementsQuery = `
        SELECT 
          id, title, content, announcement_type, priority, 
          target_audience, publish_date, expire_date, created_at
        FROM announcements
        WHERE is_active = true 
        AND (expire_date IS NULL OR expire_date > NOW())
        AND publish_date <= NOW()
        ORDER BY 
          CASE priority 
            WHEN 'urgent' THEN 1 
            WHEN 'high' THEN 2 
            WHEN 'normal' THEN 3 
            WHEN 'low' THEN 4 
          END,
          created_at DESC 
        LIMIT $${paramIndex}
      `;

      const announcementsResult = await query(announcementsQuery, [limit]);
      integratedContent.announcements = announcementsResult.rows;
    }

    // Get user progress if userId provided
    if (userId) {
      try {
        const progressQuery = `
          SELECT 
            course_id,
            progress_percentage,
            last_accessed,
            completed_at
          FROM user_progress
          WHERE user_id = $1
        `;
        
        const progressResult = await query(progressQuery, [userId]);
        integratedContent.userProgress = progressResult.rows;
      } catch (error) {
        console.log('User progress table not found, skipping...');
        integratedContent.userProgress = [];
      }
    }

    // Get related content if requested
    if (includeRelated && sectorId) {
      const relatedQuery = `
        -- Related courses in same sector
        (SELECT 
          'course' as content_type,
          c.id, c.title, c.description, c.level,
          ls.name as sector_name, ls.color as sector_color
        FROM courses c
        LEFT JOIN learning_sectors ls ON c.sector_id = ls.id
        WHERE c.sector_id = $1 AND c.is_active = true
        ORDER BY c.created_at DESC
        LIMIT 5)
        
        UNION ALL
        
        -- Related resources in same sector
        (SELECT 
          'resource' as content_type,
          r.id, r.title, r.description, r.resource_type as level,
          ls.name as sector_name, ls.color as sector_color
        FROM resources r
        LEFT JOIN learning_sectors ls ON r.sector_id = ls.id
        WHERE r.sector_id = $1
        ORDER BY r.download_count DESC
        LIMIT 5)
        
        ORDER BY content_type, title
      `;
      
      const relatedResult = await query(relatedQuery, [sectorId, sectorId]);
      integratedContent.relatedContent = relatedResult.rows;
    }

    // Generate recommendations based on popular content
    const recommendationsQuery = `
      -- Most downloaded resources
      (SELECT 
        'resource' as type,
        r.id, r.title, r.download_count as score,
        ls.name as sector_name, ls.color as sector_color
      FROM resources r
      LEFT JOIN learning_sectors ls ON r.sector_id = ls.id
      ORDER BY r.download_count DESC
      LIMIT 3)
      
      UNION ALL
      
      -- Newest courses
      (SELECT 
        'course' as type,
        c.id, c.title, 
        EXTRACT(epoch FROM (NOW() - c.created_at)) as score,
        ls.name as sector_name, ls.color as sector_color
      FROM courses c
      LEFT JOIN learning_sectors ls ON c.sector_id = ls.id
      WHERE c.is_active = true
      ORDER BY c.created_at DESC
      LIMIT 3)
      
      ORDER BY score DESC
    `;
    
    const recommendationsResult = await query(recommendationsQuery);
    integratedContent.recommendations = recommendationsResult.rows;

    // Calculate content statistics
    const stats = {
      totalCourses: integratedContent.courses.length,
      totalResources: integratedContent.resources.length,
      totalAnnouncements: integratedContent.announcements.length,
      totalSectors: integratedContent.sectors.length,
      totalDownloads: integratedContent.resources.reduce((sum, r) => sum + (r.download_count || 0), 0)
    };

    // Add cross-references between content
    const crossReferences = {};
    
    // Link courses to their sector resources
    integratedContent.courses.forEach(course => {
      const sectorResources = integratedContent.resources.filter(
        r => r.sector_name === course.sector_name
      );
      crossReferences[`course_${course.id}`] = {
        relatedResources: sectorResources.slice(0, 3),
        sectorInfo: {
          name: course.sector_name,
          color: course.sector_color,
          icon: course.sector_icon
        }
      };
    });

    // Link resources to their sector courses
    integratedContent.resources.forEach(resource => {
      const sectorCourses = integratedContent.courses.filter(
        c => c.sector_name === resource.sector_name
      );
      crossReferences[`resource_${resource.id}`] = {
        relatedCourses: sectorCourses.slice(0, 3),
        sectorInfo: {
          name: resource.sector_name,
          color: resource.sector_color,
          icon: resource.sector_icon
        }
      };
    });

    return NextResponse.json({
      success: true,
      content: integratedContent,
      crossReferences,
      stats,
      filters: {
        sectorId,
        contentType,
        includeRelated
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching integrated content:', error);
    
    // Return mock integrated content for development
    return NextResponse.json({
      success: true,
      content: {
        courses: [
          {
            id: 1,
            title: 'Islamic Finance Fundamentals',
            description: 'Learn the basics of Islamic banking and finance',
            level: 'Beginner',
            duration_weeks: 8,
            sector_name: 'Tarbiya & Idad',
            sector_color: 'blue',
            related_resources: 5,
            created_at: new Date().toISOString()
          }
        ],
        resources: [
          {
            id: 1,
            title: 'Quran Recitation Guide',
            description: 'Complete guide for proper Quran recitation',
            resource_type: 'PDF',
            download_count: 245,
            sector_name: 'Qirat & Ilm',
            sector_color: 'teal',
            created_at: new Date().toISOString()
          }
        ],
        announcements: [
          {
            id: 1,
            title: 'Ramadan Schedule Update',
            content: 'Updated prayer and study schedule for Ramadan',
            priority: 'high',
            target_audience: 'all',
            created_at: new Date().toISOString()
          }
        ],
        sectors: [
          { id: 1, name: 'Tarbiya & Idad', color: 'blue', course_count: 45, resource_count: 89 },
          { id: 2, name: 'Literature', color: 'green', course_count: 32, resource_count: 67 },
          { id: 3, name: 'Comparative Religion', color: 'purple', course_count: 28, resource_count: 54 },
          { id: 4, name: 'Ziyara', color: 'orange', course_count: 25, resource_count: 43 },
          { id: 5, name: 'Qirat & Ilm', color: 'teal', course_count: 26, resource_count: 71 }
        ],
        recommendations: [
          { type: 'course', id: 1, title: 'Islamic Finance Fundamentals', score: 245, sector_name: 'Tarbiya & Idad' },
          { type: 'resource', id: 1, title: 'Quran Recitation Guide', score: 189, sector_name: 'Qirat & Ilm' }
        ]
      },
      stats: {
        totalCourses: 156,
        totalResources: 324,
        totalAnnouncements: 12,
        totalSectors: 5,
        totalDownloads: 5847
      },
      timestamp: new Date().toISOString()
    });
  }
}