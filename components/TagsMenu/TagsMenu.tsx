// components/Header/TagsMenu.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
import styles from './TagsMenu.module.css';

const TAGS = ['All', 'Work', 'Personal', 'Todo', 'Meeting', 'Shopping'];

export default function TagsMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.menuContainer}>
      <button className={styles.menuButton} onClick={() => setOpen(!open)}>
        Notes ▾
      </button>
      {open && (
        <ul className={styles.menuList}>
          {TAGS.map(t => (
            <li key={t} className={styles.menuItem}>
              <Link
                href={`/notes/filter/${t}`}
                className={styles.menuLink}
                onClick={() => setOpen(false)}
              >
                {t}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
