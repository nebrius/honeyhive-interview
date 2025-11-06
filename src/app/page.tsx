'use client';

import { useAtomValue } from 'jotai';

import { FileUpload } from '@/components/Empty';
import { Table } from '@/components/Table';
import { dataEntriesAtom } from '@/state';

export default function Home() {
  const dataEntries = useAtomValue(dataEntriesAtom);

  if (!dataEntries) {
    return <FileUpload />;
  }

  return (
    <>
      <h2>Data</h2>
      <Table />
    </>
  );
}
