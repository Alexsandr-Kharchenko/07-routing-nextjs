'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import { fetchNotes } from '@/lib/api';
import { Toaster } from 'react-hot-toast';
import { useDebouncedCallback } from 'use-debounce';
import css from './NotesPage.module.css';
import type { FetchNotesResponse } from '@/lib/api';
import type { NoteTag } from '@/types/note';

// --- Опис пропсів ---
interface NotesClientProps {
  category?: NoteTag | 'All';
}

export default function NotesClient({ category }: NotesClientProps) {
  const [selectedTag, setSelectedTag] = useState<NoteTag | 'All'>(
    category || 'All'
  );
  const [topic, setTopic] = useState(''); // пошуковий запит
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const perPage = 12;

  // --- Оновлюємо тег при зміні пропса category ---
  useEffect(() => {
    setSelectedTag(category || 'All');
    setCurrentPage(1);
  }, [category]);

  // --- Debounce для пошуку ---
  const updateSearchWord = useDebouncedCallback((searchWord: string) => {
    setTopic(searchWord);
    setSearchQuery(searchWord);
    setCurrentPage(1);
  }, 500);

  // --- React Query для нотаток ---
  const query = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', selectedTag, currentPage, perPage, searchQuery],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage,
        ...(searchQuery ? { search: searchQuery } : {}),
        ...(selectedTag !== 'All' ? { tag: selectedTag as NoteTag } : {}),
      }),
    placeholderData: () => {
      const prev = queryClient.getQueryData<FetchNotesResponse>([
        'notes',
        selectedTag,
        currentPage - 1 > 0 ? currentPage - 1 : 1,
        perPage,
        searchQuery,
      ]);
      return prev ?? { notes: [], totalPages: 0 };
    },
    refetchOnWindowFocus: false,
  });

  const notes = query.data?.notes ?? [];
  const totalPages = query.data?.totalPages ?? 0;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <Toaster position="top-right" />

      <header className={css.toolbar}>
        <SearchBox value={topic} onChange={updateSearchWord} />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            pageCount={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      <main className={css.content}>
        {query.isLoading || (query.isFetching && !notes.length) ? (
          <p>Loading...</p>
        ) : query.isError ? (
          <p>Failed to load notes.</p>
        ) : notes.length === 0 ? (
          <p className={css.empty}>No notes found</p>
        ) : (
          <NoteList notes={notes} />
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} />
        </Modal>
      )}
    </div>
  );
}
