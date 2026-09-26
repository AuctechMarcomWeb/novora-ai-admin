/* eslint-disable prettier/prettier */

export const BOOKS_LIST = [
  {
    _id: 'BOOK001',
    class: 'Class 10',
    subject: 'Mathematics',
    bookTitle: 'NCERT Mathematics Class 10',
    bookSummary: 'Complete mathematics textbook for Class 10 CBSE curriculum covering algebra, geometry, trigonometry, and statistics.',
    pdfUrl: '/pdfs/class10-math.pdf',
    coverImage: 'https://via.placeholder.com/150x200?text=Math+10',
    status: 'Active',
    uploadedDate: '2024-01-10T10:00:00Z',
    uploadedBy: 'Admin',
  },
  {
    _id: 'BOOK002',
    class: 'Class 10',
    subject: 'Science',
    bookTitle: 'NCERT Science Class 10',
    bookSummary: 'Science textbook covering Physics, Chemistry, and Biology for Class 10 students.',
    pdfUrl: '/pdfs/class10-science.pdf',
    coverImage: 'https://via.placeholder.com/150x200?text=Science+10',
    status: 'Active',
    uploadedDate: '2024-01-12T11:30:00Z',
    uploadedBy: 'Admin',
  },
  {
    _id: 'BOOK003',
    class: 'Class 9',
    subject: 'English',
    bookTitle: 'NCERT Beehive Class 9',
    bookSummary: 'English literature and language textbook with prose and poetry for Class 9.',
    pdfUrl: '/pdfs/class9-english.pdf',
    coverImage: 'https://via.placeholder.com/150x200?text=English+9',
    status: 'Active',
    uploadedDate: '2024-01-15T09:00:00Z',
    uploadedBy: 'Admin',
  },
  {
    _id: 'BOOK004',
    class: 'Class 8',
    subject: 'Social Science',
    bookTitle: 'NCERT Social Science Class 8',
    bookSummary: 'Comprehensive social studies covering History, Geography, Civics, and Economics.',
    pdfUrl: '/pdfs/class8-social.pdf',
    coverImage: 'https://via.placeholder.com/150x200?text=Social+8',
    status: 'Inactive',
    uploadedDate: '2024-02-01T14:20:00Z',
    uploadedBy: 'Admin',
  },
  {
    _id: 'BOOK005',
    class: 'Class 12',
    subject: 'Physics',
    bookTitle: 'NCERT Physics Class 12 Part 1',
    bookSummary: 'Advanced physics concepts including electrostatics, current electricity, and magnetism.',
    pdfUrl: '/pdfs/class12-physics.pdf',
    coverImage: 'https://via.placeholder.com/150x200?text=Physics+12',
    status: 'Active',
    uploadedDate: '2024-02-10T10:30:00Z',
    uploadedBy: 'Admin',
  },
  {
    _id: 'BOOK006',
    class: 'Class 11',
    subject: 'Chemistry',
    bookTitle: 'NCERT Chemistry Class 11',
    bookSummary: 'Basic concepts of chemistry including atomic structure, chemical bonding, and organic chemistry.',
    pdfUrl: '/pdfs/class11-chemistry.pdf',
    coverImage: 'https://via.placeholder.com/150x200?text=Chemistry+11',
    status: 'Active',
    uploadedDate: '2024-02-15T12:00:00Z',
    uploadedBy: 'Admin',
  },
]

export const BOOK_STATS = {
  totalBooks: 6,
  activeBooks: 5,
  inactiveBooks: 1,
}

export const CLASS_OPTIONS = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12'
]

export const SUBJECT_OPTIONS = [
  'Mathematics',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Hindi',
  'Social Science',
  'History',
  'Geography',
  'Economics',
  'Political Science',
  'Computer Science',
]
