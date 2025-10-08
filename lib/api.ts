import axios from 'axios';
import type { Note, NoteFormData } from '../types/note';

// --- Типи для API ---
export interface ResponseAPI {
  notes: Note[];
  totalPages: number;
}

// Тип для створення нотатки
export interface CreateNote {
  title: string;
  content?: string;
  tag: string;
}

// Параметри запиту нотаток
export interface FetchNotesParams {
  searchWord: string;
  page: number;
  tag?: string;
}

// --- Налаштування axios ---
axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
axios.defaults.headers.common['Authorization'] = `Bearer ${
  process.env.NEXT_PUBLIC_NOTEHUB_TOKEN
}`;

// --- API функції ---
export async function fetchNotes(
  searchWord: string,
  page: number,
  tag?: string
): Promise<ResponseAPI> {
  if (tag === 'All') tag = undefined;

  const res = await axios.get<ResponseAPI>('/notes', {
    params: {
      search: searchWord,
      tag,
      page,
      perPage: 12,
    },
  });

  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await axios.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function createNote(
  data: CreateNote | NoteFormData
): Promise<Note> {
  const res = await axios.post<Note>('/notes', data);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await axios.delete<Note>(`/notes/${id}`);
  return res.data;
}
