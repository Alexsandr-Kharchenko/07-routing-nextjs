'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import css from './LayoutNotes.module.css';

interface NotesLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export default function NotesLayout({ children, sidebar }: NotesLayoutProps) {
  const pathname = usePathname();

  return (
    <section className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>

      <div key={pathname} className={css.notesWrapper}>
        {children}
      </div>
    </section>
  );
}
