'use client';

import { useAtom } from 'jotai';
import { useCallback } from 'react';

import { dataEntriesAtom } from '@/state';

export function New() {
  const [dataEntries, setDataEntries] = useAtom(dataEntriesAtom);
  const handleNew = useCallback(() => {
    setDataEntries(null);
  }, [setDataEntries]);

  if (!dataEntries) {
    return null;
  }

  return (
    <button
      onClick={handleNew}
      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      New
    </button>
  );
}
