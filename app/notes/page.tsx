'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNotes, type ResponseAPI } from '@/lib/api';
import Link from 'next/link';
import type { Note, NoteTag } from '@/types/note';
import css from './filter/LayoutNotes.module.css';

interface NotesClientProps {
  category?: NoteTag | 'All';
  initialNotes?: Note[];
}

export default function NotesClient({
  category = 'All',
  initialNotes = [],
}: NotesClientProps) {
  const { data: notes = [] } = useQuery<Note[]>({
    queryKey: ['notes', category],
    queryFn: () =>
      fetchNotes({ searchWord: '', page: 1, tag: category }).then(
        (res: ResponseAPI) => res.notes
      ),
    initialData: initialNotes,
  });

  return (
    <div className={css.container}>
      <h1 className={css.title}>
        {category === 'All' ? 'All Notes' : `${category} Notes`}
      </h1>
      <ul className={css.list}>
        {notes.map(note => (
          <li key={note.id} className={css.item}>
            <Link href={`/notes/${note.id}`} className={css.link}>
              <h2 className={css.noteTitle}>{note.title}</h2>
              <p className={css.noteContent}>{note.content}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
