# Enrollment System Implementation Guide

## Overview

The enrollment system provides a comprehensive solution for managing user access to programs, courses, and materials. It handles authentication, enrollment forms, and access control automatically.

## Key Components

### 1. EnrollmentGate Component
Protects content and handles the complete enrollment flow.

```jsx
import EnrollmentGate from '@/components/enrollment/EnrollmentGate';

<EnrollmentGate
  programType="sector"
  programId="tarbiya-idad"
  programName="Tarbiya & Idad Academy"
  requiresForm={true}
  formFields={[
    {
      name: 'level',
      label: 'Current Islamic Knowledge Level',
      type: 'select',
      required: true,
      options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
      ]
    },
    {
      name: 'goals',
      label: 'What are your goals?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe your goals...'
    }
  ]}
  redirectAfterEnroll="/dashboard/sectors/tarbiya-idad"
>
  {/* Protected content goes here */}
  <div>This content is only visible to enrolled users</div>
</EnrollmentGate>
```

### 2. EnrollmentButton Component
Simple button for quick enrollment without forms.

```jsx
import EnrollmentButton from '@/components/enrollment/EnrollmentButton';

<EnrollmentButton
  programType="course"
  programId="arabic-101"
  programName="Arabic Language Course"
  variant="primary"
  className="w-full"
>
  Enroll in Course
</EnrollmentButton>
```

## Program Types

### Supported Program Types:
- `sector` - Main academic sectors (Tarbiya, Dawah, etc.)
- `course` - Individual courses within sectors
- `qirat` - Quranic recitation programs

## User Flow

### For Unauthenticated Users:
1. User clicks enrollment button/accesses protected content
2. System shows login/register prompt
3. User signs in or creates account
4. System redirects back to original content
5. Enrollment process continues

### For Authenticated Users:
1. System checks enrollment status
2. If not enrolled:
   - Shows enrollment form (if required)
   - Or direct enrollment (if no form needed)
3. If already enrolled:
   - Shows protected content immediately
   - Or redirects to appropriate dashboard

## API Endpoints

### Check Enrollment Status
```
GET /api/enrollment/status?type=sector&id=tarbiya-idad
```

### Create Enrollment
```
POST /api/enrollment/enroll
{
  "programType": "sector",
  "programId": "tarbiya-idad",
  "enrollmentData": {
    "level": "beginner",
    "goals": "Spiritual development"
  }
}
```

## Database Tables

The system uses these enrollment tables:
- `sector_enrollments` - For sector enrollments
- `course_enrollments` - For course enrollments  
- `qirat_enrollments` - For Qirat program enrollments

## Implementation Examples

### 1. Protecting Course Materials

```jsx
// In a course page
export default function CoursePage() {
  return (
    <EnrollmentGate
      programType="course"
      programId="islamic-history-101"
      programName="Islamic History 101"
      requiresForm={false} // Direct enrollment
    >
      <CourseContent />
      <CourseMaterials />
      <Assignments />
    </EnrollmentGate>
  );
}
```

### 2. Sector Page with Form

```jsx
// In a sector page
export default function SectorPage() {
  return (
    <div>
      <SectorOverview /> {/* Public content */}
      
      <EnrollmentGate
        programType="sector"
        programId="dawah-irshad"
        programName="Dawah & Irshad Sector"
        requiresForm={true}
        formFields={[
          {
            name: 'experience',
            label: 'Previous Dawah Experience',
            type: 'select',
            required: true,
            options: [
              { value: 'none', label: 'No Experience' },
              { value: 'some', label: 'Some Experience' },
              { value: 'experienced', label: 'Very Experienced' }
            ]
          },
          {
            name: 'availability',
            label: 'Weekly Availability',
            type: 'select',
            required: true,
            options: [
              { value: '1-3', label: '1-3 hours' },
              { value: '4-6', label: '4-6 hours' },
              { value: '7+', label: '7+ hours' }
            ]
          }
        ]}
      >
        <SectorMaterials />
        <WeeklySchedule />
        <MentorAccess />
      </EnrollmentGate>
    </div>
  );
}
```

### 3. Homepage Quick Enrollment

```jsx
// In homepage sector cards
{sectors.map(sector => (
  <div key={sector.id} className="sector-card">
    <h3>{sector.name}</h3>
    <p>{sector.description}</p>
    
    <EnrollmentButton
      programType="sector"
      programId={sector.slug}
      programName={sector.name}
      variant="outline"
    >
      Quick Enroll
    </EnrollmentButton>
  </div>
))}
```

## Form Field Types

### Available Field Types:
- `text` - Text input
- `email` - Email input
- `textarea` - Multi-line text
- `select` - Dropdown selection
- `checkbox` - Checkbox input
- `radio` - Radio button group

### Field Configuration:
```jsx
{
  name: 'fieldName',           // Required: field identifier
  label: 'Field Label',        // Required: display label
  type: 'text',               // Required: input type
  required: true,             // Optional: validation
  placeholder: 'Enter...',    // Optional: placeholder text
  options: [                  // Required for select/radio
    { value: 'val1', label: 'Label 1' },
    { value: 'val2', label: 'Label 2' }
  ]
}
```

## Portal Routing

The system automatically routes users to appropriate portals:

### Student Portals:
- Male students: `/dashboard/male`
- Female students: `/dashboard/female`

### Mentor Portal:
- All mentors: `/mentor/dashboard`

### Admin Portal:
- All admins: `/admin/dashboard`

## Security Features

1. **Authentication Required**: All enrollment requires valid user session
2. **Email Verification**: Users must verify email before enrollment
3. **Role-Based Access**: Different access levels for students/mentors/admins
4. **Enrollment Validation**: Prevents duplicate enrollments
5. **Return URL Handling**: Preserves user's intended destination

## Usage Tips

1. **Use EnrollmentGate for content protection** - Wrap any content that requires enrollment
2. **Use EnrollmentButton for quick actions** - Add to cards, headers, CTAs
3. **Design enrollment forms carefully** - Only ask for essential information
4. **Test the complete flow** - Verify unauthenticated → authenticated → enrolled flow
5. **Handle errors gracefully** - Provide clear feedback for enrollment issues

## Customization

### Custom Styling:
```jsx
<EnrollmentButton
  className="custom-button-class"
  variant="primary" // primary, secondary, success, outline
>
  Custom Text
</EnrollmentButton>
```

### Custom Redirects:
```jsx
<EnrollmentGate
  redirectAfterEnroll="/custom/success/page"
>
  Content
</EnrollmentGate>
```

This enrollment system provides a complete solution for managing user access while maintaining a smooth user experience across all program types.