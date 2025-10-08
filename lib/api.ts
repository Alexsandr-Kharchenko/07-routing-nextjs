import axios from 'axios';
import type { Note, NoteTag } from '@/types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const NOTEHUB_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!NOTEHUB_TOKEN) {
  throw new Error('Authorization token required');
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${NOTEHUB_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8',
  },
});

export interface CreateNote {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: NoteTag | 'All'; // додано тег
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// Функція для отримання нотаток по тегу
export const getNotes = async (tag?: NoteTag | 'All'): Promise<Note[]> => {
  const params: Record<string, string> = {};

  if (tag && tag !== 'All') {
    params.tag = tag;
  }

  const { data } = await api.get<Note[]>('/notes', { params });
  return data;
};

// Функція для отримання нотатки по ID
export const fetchNoteById = async (id: string): Promise<Note> => {
  if (!id) throw new Error('Note id is required');
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

// Функція для отримання нотаток з параметрами пошуку, пагінації і тегу
export const fetchNotes = async ({
  search = '',
  page = 1,
  perPage = 12,
  tag = 'All', // додано тег
}: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { search, page, perPage };

  if (tag && tag !== 'All') {
    params.tag = tag;
  }

  const { data } = await api.get<FetchNotesResponse>('/notes', { params });
  return data;
};

// Створення нотатки
export const createNote = async (note: CreateNote): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', note);
  return data;
};

// Видалення нотатки
export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};
