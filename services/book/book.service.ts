import axiosInstance from "@/utils/axios";

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
    const response = await axiosInstance.get("book");
    return response.data;
  },

  addBook: async (bookPayload: CreateBookType): Promise<BookType> => {
    const response = await axiosInstance.post("book", bookPayload);
    return response.data;
  },

  updateBook: async (id: string, bookPayload: UpdateBookType): Promise<BookType> => {
    const response = await axiosInstance.put(`book/${id}`, bookPayload);
    return response.data;
  },

  deleteBook: async (id: string): Promise<void> => {
    await axiosInstance.delete(`book/${id}`);
  },
};

export default bookService;
