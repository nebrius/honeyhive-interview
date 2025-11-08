'use client';

import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { dataEntriesAtom } from '@/state';
import { StoredDataEntry } from '@/types';
import { InternalError } from '@/util/error';

import { FactualAccuracy } from './FactualAccuracy';
import { ResponseTime } from './ResponseTime';
import { Table } from './Table';

export function Document({ documentId }: { documentId: string }) {
  const [data, setData] = useAtom(dataEntriesAtom);
  const router = useRouter();

  const onEdit = useCallback(() => {
    const newName = prompt('New name', data?.name);
    setData((data) => ({
      ...data!,
      name: newName,
    }));
    localStorage.setItem(
      `document-${documentId}`,
      JSON.stringify({
        ...data!,
        name: newName,
      })
    );
    console.log(newName);
  }, [data?.name]);

  const onDelete = useCallback(() => {
    localStorage.removeItem(`document-${documentId}`);
    router.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const numKeys = localStorage.length;
    for (let i = 0; i < numKeys; i++) {
      const entry = localStorage.key(i);
      if (entry === `document-${documentId}`) {
        const rawEntryData = localStorage.getItem(entry);
        if (!rawEntryData) {
          throw new InternalError('entry is unexpectedly null');
        }
        try {
          const entryData = JSON.parse(rawEntryData) as StoredDataEntry;
          setTimeout(() => {
            setData(entryData);
          }, 0);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          throw new InternalError(('message' in e && e.message) || e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) {
    return <div>Loading</div>;
  }

  return (
    <>
      <header className="flex min-h-12 items-center gap-2 border-b border-gray-700 pb-3 mb-3">
        <div className="grow flex">
          <h1 className="grow">{data.name}</h1>
          <div>
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
          </div>
        </div>
      </header>
      <main>
        <div className="flex flex-col">
          <div className="grow">
            <h2 className="text-2xl font-bold mb-3">Response Time</h2>
            <ResponseTime />
            <h2 className="text-2xl font-bold mb-3 mt-6">Factual Accuracy</h2>
            <FactualAccuracy />
            <h2 className="text-2xl font-bold mb-3 mt-6">Data</h2>
            <Table />
          </div>
        </div>
      </main>
    </>
  );
}
