import { fetchNotes } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';

interface Props {
  params: Promise<{ slug: string[] }>;
}

const topic = '';
const page = 1;

export default async function Notes({ params }: Props) {
  const queryClient = new QueryClient();

  const { slug } = await params;
  const category = slug[0];

  await queryClient.prefetchQuery({
    queryKey: ['notes', topic, page, category],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        ...(topic ? { search: topic } : {}),
        ...(category ? { tag: category } : {}),
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient category={category} />
    </HydrationBoundary>
  );
}
