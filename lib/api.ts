import axios from 'axios';
import type { Note, NoteFormData, NoteTag } from '../types/note';

// Беремо токен
const BASE_URL = 'https://notehub-public.goit.study/api';
const NOTEHUB_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!NOTEHUB_TOKEN) throw new Error('Authorization token required');

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${NOTEHUB_TOKEN}`,
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// --- Типи ---
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

// --- API функції ---
export async function fetchNotes(
  params: FetchNotesParams
): Promise<ResponseAPI> {
  const { searchWord, page, tag } = params;
  const queryTag = tag === 'All' ? undefined : tag;

  try {
    const res = await api.get<ResponseAPI>('/notes', {
      params: {
        search: searchWord,
        page,
        perPage: 12,
        tag: queryTag,
      },
    });
    return res.data;
  } catch (error) {
    console.error('fetchNotes error:', error);
    throw new Error('Failed to fetch notes');
  }
}

export async function fetchNoteById(id: string): Promise<Note> {
  try {
    const res = await api.get<Note>(`/notes/${id}`);
    return res.data;
  } catch (error) {
    console.error(`fetchNoteById(${id}) error:`, error);
    throw new Error('Failed to fetch note by ID');
  }
}

export async function createNote(
  data: CreateNote | NoteFormData
): Promise<Note> {
  try {
    const res = await api.post<Note>('/notes', data);
    return res.data;
  } catch (error) {
    console.error('createNote error:', error);
    throw new Error('Failed to create note');
  }
}

export async function deleteNote(id: string): Promise<Note> {
  try {
    const res = await api.delete<Note>(`/notes/${id}`);
    return res.data;
  } catch (error) {
    console.error(`deleteNote(${id}) error:`, error);
    throw new Error('Failed to delete note');
  }
}
