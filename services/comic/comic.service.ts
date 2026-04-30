import axiosInstance from "@/utils/axios";

export type ComicType = {
  id: string;
  comicName: string;
  comicCover: string;
  comicDescription: string;
  comicAuthor: string;
  comicGenre: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateComicType = {
  comicName: string;
  comicCover: string;
  comicDescription: string;
  comicAuthor: string;
  comicGenre: string;
};

export type UpdateComicType = {
  comicName?: string;
  comicCover?: string;
  comicDescription?: string;
  comicAuthor?: string;
  comicGenre?: string;
};

// Khai báo các dịch vụ CRUD (Create, Read, Update, Delete) - xem, thêm, sửa, xóa dữ liệu
const comicService = {

  getAllComics: async (): Promise<ComicType[]> => {
    const response = await axiosInstance.get("comic");
    return response.data;
  },

  addComic: async (comicPayload: CreateComicType, email?: string, password?: string): Promise<ComicType> => {
    if (!email || !password) {
      throw new Error('Admin credentials required');
    }
    const response = await fetch('/api/comics/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...comicPayload, email, password }),
    });
    if (!response.ok) {
      throw new Error('Failed to add comic');
    }
    const result = await response.json();
    return result.data;
  },

  updateComic: async (id: string, comicPayload: UpdateComicType, email?: string, password?: string): Promise<ComicType> => {
    if (!email || !password) {
      throw new Error('Admin credentials required');
    }
    const response = await fetch('/api/comics/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...comicPayload, email, password }),
    });
    if (!response.ok) {
      throw new Error('Failed to update comic');
    }
    const result = await response.json();
    return result.data;
  },

  deleteComic: async (id: string, email?: string, password?: string): Promise<void> => {
    if (!email || !password) {
      throw new Error('Admin credentials required');
    }
    const response = await fetch('/api/comics/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, email, password }),
    });
    if (!response.ok) {
      throw new Error('Failed to delete comic');
    }
  },
};

export default comicService;
