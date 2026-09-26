/* eslint-disable prettier/prettier */

export const ADMIN_DASHBOARD_SUMMARY = {
  // Schools
  totalSchools: 5,
  activeSchools: 4,
  inactiveSchools: 1,
  
  // Books
  totalBooks: 6,
  activeBooks: 5,
  
  // AI Content Generated
  totalContentGenerated: 150,
  lessonPlans: 60,
  worksheets: 50,
  mcqs: 40,
  
  // Recent Activity
  recentLogins: 12,
  todayLogins: 5,
}

export const ADMIN_RECENT_ACTIVITY = [
  {
    _id: 'ACT001',
    school: 'Delhi Public School',
    activity: 'Generated Lesson Plan',
    book: 'NCERT Mathematics Class 10',
    timestamp: '2024-09-24T12:30:00Z',
  },
  {
    _id: 'ACT002',
    school: 'St. Xavier\'s School',
    activity: 'Generated Worksheet',
    book: 'NCERT Science Class 10',
    timestamp: '2024-09-24T11:45:00Z',
  },
  {
    _id: 'ACT003',
    school: 'DAV Public School',
    activity: 'Generated MCQ',
    book: 'NCERT Beehive Class 9',
    timestamp: '2024-09-24T10:15:00Z',
  },
  {
    _id: 'ACT004',
    school: 'Kendriya Vidyalaya',
    activity: 'Login Success',
    book: null,
    timestamp: '2024-09-24T09:00:00Z',
  },
  {
    _id: 'ACT005',
    school: 'Delhi Public School',
    activity: 'Generated Lesson Plan',
    book: 'NCERT Physics Class 12',
    timestamp: '2024-09-23T16:20:00Z',
  },
]
