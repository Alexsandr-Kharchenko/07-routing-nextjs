// app/notes/layout.tsx
import React from 'react';
import styles from '../Home.module.css';

export default function NotesLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}) {
  // Тут layout з місцем під паралельний маршрут @sidebar
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>{sidebar}</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
