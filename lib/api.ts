import axios from 'axios';
import type { Note, NoteFormData, NoteTag } from '../types/note';

export interface ResponseAPI {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  searchWord: string;
  page: number;
  tag?: NoteTag | 'All';
}

export interface CreateNote {
  title: string;
  content?: string;
  tag: NoteTag;
}

// Axios базові налаштування
axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
axios.defaults.headers.common['Authorization'] =
  `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`;

// --- API функції ---
export async function fetchNotes(
  params: FetchNotesParams
): Promise<ResponseAPI> {
  const { searchWord, page, tag } = params;
  const queryTag = tag === 'All' ? undefined : tag;

  const res = await axios.get<ResponseAPI>('/notes', {
    params: {
      search: searchWord,
      page,
      perPage: 12,
      tag: queryTag,
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
