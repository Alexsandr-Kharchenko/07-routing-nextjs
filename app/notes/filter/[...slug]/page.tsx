import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import type { NoteTag } from '@/types/note';

interface Props {
  params: { slug: string[] };
}

export default async function Notes({ params }: Props) {
  const queryClient = new QueryClient();

  const category: NoteTag | 'All' =
    (params.slug?.[0] as NoteTag | undefined) || 'All';

  // SSR: отримуємо початкові дані
  const initialData = await fetchNotes({
    searchWord: '',
    page: 1,
    tag: category,
  });

  await queryClient.prefetchQuery({
    queryKey: ['notes', category],
    queryFn: () => fetchNotes({ searchWord: '', page: 1, tag: category }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient category={category} initialNotes={initialData.notes} />
    </HydrationBoundary>
  );
}
