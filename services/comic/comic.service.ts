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

  addComic: async (comicPayload: CreateComicType): Promise<ComicType> => {
    const response = await axiosInstance.post("comic", comicPayload);
    return response.data;
  },

  updateComic: async (id: string, comicPayload: UpdateComicType): Promise<ComicType> => {
    const response = await axiosInstance.put(`comic/${id}`, comicPayload);
    return response.data;
  },

  deleteComic: async (id: string): Promise<void> => {
    await axiosInstance.delete(`comic/${id}`);
  },
};

export default comicService;
