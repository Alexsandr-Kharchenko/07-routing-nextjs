import { Suspense } from 'react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import type { FetchNotesResponse } from '@/lib/api';

export default async function NotesPage() {
  // Створюємо інстанс клієнта запитів
  const queryClient = new QueryClient();

  // Серверний префетчинг — завантажуємо дані до рендеру
  await queryClient.prefetchQuery<FetchNotesResponse>({
    queryKey: ['notes', '', 1],
    queryFn: () => fetchNotes({ search: '', page: 1, perPage: 12 }),
  });

  // "Зневоднюємо" кеш перед передачею на клієнт
  const dehydratedState = dehydrate(queryClient);

  return (
    <Suspense fallback={<p>Loading notes…</p>}>
      <HydrationBoundary state={dehydratedState}>
        <NotesClient />
      </HydrationBoundary>
    </Suspense>
  );
}
