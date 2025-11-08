import { Document } from '@/components/Documents';

export default async function DataPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Document documentId={id} />;
}
