import axiosInstance from "@/utils/axios";

// Simple cache mechanism
const comicCache = {
  data: null as any,
  timestamp: 0,
  duration: 30000, // 30 seconds cache
};

export type ComicType = {
  id: string;
  comicName: string;
  comicCover: string;
  comicDescription: string;
  comicAuthor: string;
  comicGenre: string;
  views?: number;
  followers?: number;
  rating?: number;
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
    const now = Date.now();
    // Return cached data if still valid
    if (comicCache.data && now - comicCache.timestamp < comicCache.duration) {
      return comicCache.data;
    }
    // Fetch new data and update cache
    const response = await axiosInstance.get("comic");
    comicCache.data = response.data;
    comicCache.timestamp = now;
    return response.data;
  },

  getComicById: async (id: string): Promise<ComicType | null> => {
    try {
      const response = await axiosInstance.get(`comic/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch comic:', error);
      return null;
    }
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
