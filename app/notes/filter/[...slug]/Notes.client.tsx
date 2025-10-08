'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import { fetchNotes, type ResponseAPI } from '@/lib/api';
import { Toaster } from 'react-hot-toast';
import css from './NotesPage.module.css';

import type { Note, NoteTag } from '@/types/note';

interface NotesClientProps {
  category?: string; // або NoteTag | 'All'
  initialNotes?: Note[];
}

export default function NotesClient({
  category,
  initialNotes = [],
}: NotesClientProps) {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState(category || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const perPage = 12;

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const query = useQuery<ResponseAPI, Error>({
    queryKey: ['notes', currentPage, perPage, searchQuery, category],
    queryFn: () => {
      const tag = (category ?? 'All') as NoteTag | 'All';
      return fetchNotes({
        searchWord: searchQuery,
        page: currentPage,
        tag,
      });
    },
    placeholderData: () => {
      const previousData = queryClient.getQueryData<ResponseAPI>([
        'notes',
        currentPage - 1 > 0 ? currentPage - 1 : 1,
        perPage,
        searchQuery,
        category,
      ]);

      return previousData ?? { notes: initialNotes, totalPages: 0 };
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
        <SearchBox value={searchInput} onChange={setSearchInput} />
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
          <p>Loading, please wait...</p>
        ) : query.isError ? (
          <p>Something went wrong: Failed to load notes.</p>
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
