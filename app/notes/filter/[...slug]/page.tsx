import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import type { NoteTag } from '@/types/note';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function Notes({ params }: Props) {
  const { slug } = await params;
  const category: NoteTag | 'All' = (slug?.[0] as NoteTag | undefined) || 'All';

  const queryClient = new QueryClient();

  // Prefetch notes для SSR
  await queryClient.prefetchQuery({
    queryKey: ['notes', category],
    queryFn: () => fetchNotes({ searchWord: '', page: 1, tag: category }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient category={category} />
    </HydrationBoundary>
  );
}
