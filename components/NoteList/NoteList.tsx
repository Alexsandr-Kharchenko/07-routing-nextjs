'use client';

import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api';
import type { Note } from '@/types/note';
import { toast } from 'react-hot-toast';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const {
    mutate: handleDelete,
    isPending: isDeleting,
    variables: deletingId,
  } = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await deleteNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted');
    },
    onError: (err: Error) => {
      console.error('Failed to delete note:', err);
      toast.error('Failed to delete note');
    },
  });

  if (!notes || notes.length === 0) {
    return (
      <div className={css.emptyState}>
        <h3>No notes found</h3>
        <p>Create your first note to get started!</p>
      </div>
    );
  }

  return (
    <ul className={css.list}>
      {notes.map(note => {
        const isThisDeleting = isDeleting && deletingId === note.id;

        return (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>
              {note.content?.substring(0, 100) ?? 'No content'}
            </p>
            <div className={css.footer}>
              {note.tag && <span className={css.tag}>{note.tag}</span>}

              <Link href={`/notes/${note.id}`} className={css.link}>
                View details
              </Link>

              <button
                className={css.button}
                onClick={() => handleDelete(note.id)}
                disabled={isThisDeleting}
                aria-label={`Delete note titled ${note.title}`}
              >
                {isThisDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
