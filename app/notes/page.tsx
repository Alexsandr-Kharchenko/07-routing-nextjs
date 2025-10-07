'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import Link from 'next/link';
import type { Note } from '@/types/note';
import css from '@/app/notes/filter/[...slug]/NotesPage.module.css';

interface NotesClientProps {
  initialNotes: Note[];
  tag: string;
}

export default function NotesClient({ initialNotes, tag }: NotesClientProps) {
  const { data: notes = [] } = useQuery({
    queryKey: ['notes', tag],
    queryFn: () =>
      fetchNotes(tag === 'All' ? {} : { search: tag }).then(res => res.notes),
    initialData: initialNotes,
  });

  return (
    <div className={css.container}>
      <h1 className={css.title}>
        {tag === 'All' ? 'All Notes' : `${tag} Notes`}
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
