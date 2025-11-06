'use client';

import { useAtomValue } from 'jotai';

import { FileUpload } from '@/components/Empty';
import { ResponseTime } from '@/components/ResponseTime';
import { Table } from '@/components/Table';
import { dataEntriesAtom } from '@/state';

export default function Home() {
  const dataEntries = useAtomValue(dataEntriesAtom);

  if (!dataEntries) {
    return <FileUpload />;
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-3">Response Time</h2>
      <ResponseTime />
      <h2 className="text-2xl font-bold mb-3 mt-6">Data</h2>
      <Table />
    </>
  );
}
