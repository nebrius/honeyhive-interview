'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { StoredDataEntry } from '@/types';
import { InternalError } from '@/util/error';

const ENTRY_REGEX = /^document-([0-9a-f-]*)$/;

export function Nav() {
  const [entries, setEntries] = useState<Array<{
    name: string;
    url: string;
  }> | null>(null);

  useEffect(() => {
    const numKeys = localStorage.length;
    const entries: Array<{ name: string; url: string }> = [];
    for (let i = 0; i < numKeys; i++) {
      const entry = localStorage.key(i);
      if (!entry?.startsWith(`document-`)) {
        continue;
      }
      const rawEntryData = localStorage.getItem(entry);
      if (!rawEntryData) {
        throw new InternalError('entry is unexpectedly null');
      }
      try {
        const entryData = JSON.parse(rawEntryData) as StoredDataEntry;
        const match = ENTRY_REGEX.exec(entry);
        if (!match) {
          throw new InternalError('match is unexpectedly undefined');
        }
        entries.push({
          name: entryData.name,
          url: `/${match[1]}`,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        throw new InternalError(('message' in e && e.message) || e);
      }
    }
    setTimeout(() => {
      setEntries(entries);
    }, 0);
  }, []);

  return (
    <div>
      <Link href="/">New</Link>
      <h2>Datasets</h2>
      <ul>
        {entries ? (
          entries.map((e) => (
            <li key={e.url}>
              <Link href={e.url}>{e.name}</Link>
            </li>
          ))
        ) : (
          <div>Loading</div>
        )}
      </ul>
    </div>
  );
}
