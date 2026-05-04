import axiosInstance from "@/utils/axios";

// Simple cache mechanism
const bookCache = {
  data: null as any,
  timestamp: 0,
  duration: 30000, // 30 seconds cache
};

export type BookType = {
  bookId: string;
  bookName: string;
  bookCover: string;
  bookDescription: string;
  bookPrice: string;
  bookGenre: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookType = {
  bookName: string;
  bookCover: string;
  bookDescription: string;
  bookPrice: string;
  bookGenre: string;
};

export type UpdateBookType = {
  bookName?: string;
  bookCover?: string;
  bookDescription?: string;
  bookPrice?: string;
  bookGenre?: string;
};

// Khai báo các dịch vụ CRUD (Create, Read, Update, Delete) - xem, thêm, sửa, xóa dữ liệu
const bookService = {

  getAllBooks: async (): Promise<BookType[]> => {
    const now = Date.now();
    // Return cached data if still valid
    if (bookCache.data && now - bookCache.timestamp < bookCache.duration) {
      return bookCache.data;
    }
    // Fetch new data and update cache
    const response = await axiosInstance.get("book");
    bookCache.data = response.data;
    bookCache.timestamp = now;
    return response.data;
  },

  getBookById: async (id: string): Promise<BookType | null> => {
    try {
      const response = await axiosInstance.get(`book/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch book:', error);
      return null;
    }
  },

  addBook: async (bookPayload: CreateBookType, email?: string, password?: string): Promise<BookType> => {
    if (!email || !password) {
      throw new Error('Admin credentials required');
    }
    const response = await fetch('/api/books/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...bookPayload, email, password }),
    });
    if (!response.ok) {
      throw new Error('Failed to add book');
    }
    const result = await response.json();
    return result.data;
  },

  updateBook: async (id: string, bookPayload: UpdateBookType, email?: string, password?: string): Promise<BookType> => {
    if (!email || !password) {
      throw new Error('Admin credentials required');
    }
    const response = await fetch('/api/books/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...bookPayload, email, password }),
    });
    if (!response.ok) {
      throw new Error('Failed to update book');
    }
    const result = await response.json();
    return result.data;
  },

  deleteBook: async (id: string, email?: string, password?: string): Promise<void> => {
    if (!email || !password) {
      throw new Error('Admin credentials required');
    }
    const response = await fetch('/api/books/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, email, password }),
    });
    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
  },
};

export default bookService;
