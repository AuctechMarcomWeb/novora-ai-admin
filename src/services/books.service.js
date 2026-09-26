/* eslint-disable prettier/prettier */
import { getRequest, postRequest, patchRequest, deleteRequest, fileUpload } from '../Helpers'

export const booksService = {
  // Books CRUD
  getAllBooks: (params = '') => getRequest(`books${params}`),
  getBookById: (id) => getRequest(`books/${id}`),
  createBook: (formData) => fileUpload({ url: 'books', cred: formData }),
  updateBook: (id, formData) => fileUpload({ url: `books/${id}`, cred: formData }),
  deleteBook: (id) => deleteRequest(`books/${id}`),
  
  // Book Actions
  updateStatus: (id, cred) => patchRequest({ url: `books/${id}/status`, cred }),
  downloadPDF: (id) => getRequest(`books/${id}/download`),
  previewPDF: (id) => getRequest(`books/${id}/preview`),
  
  // Book Content Index
  getBookContent: (bookId) => getRequest(`books/${bookId}/content`),
  
  // Stats
  getBookStats: () => getRequest('books/stats'),
}
