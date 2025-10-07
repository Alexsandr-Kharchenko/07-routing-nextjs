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
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const getNotes = async (tag?: NoteTag | 'All'): Promise<Note[]> => {
  const params: Record<string, string> = {};

  if (tag && tag !== 'All') {
    params.tag = tag;
  }

  const { data } = await api.get<Note[]>('/notes', { params });
  return data;
};

export const getNoteById = async (id: string): Promise<Note> => {
  if (!id) throw new Error('Note id is required');
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const fetchNotes = async ({
  search = '',
  page = 1,
  perPage = 12,
}: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: { search, page, perPage },
  });
  return data;
};

export const createNote = async (note: CreateNote): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};
