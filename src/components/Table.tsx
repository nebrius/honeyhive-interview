'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useAtomValue } from 'jotai';
import { useRef } from 'react';

import { dataEntriesAtom } from '@/state';
import { DataEntry } from '@/types';
import { InternalError } from '@/util/error';

// Store these in an array so that one day we can make them dynamic
const COLUMNS_TO_SHOW = [
  'model',
  'response_time_ms',
] as const satisfies readonly (keyof DataEntry)[];

function Row({ dataEntry }: { dataEntry: DataEntry }) {
  return (
    <div className="flex gap-1">
      {COLUMNS_TO_SHOW.map((column) => (
        // TODO: make the width dynamic based on the content
        <div key={column} className="w-30">
          {dataEntry[column]}
        </div>
      ))}
    </div>
  );
}

export function Table() {
  const dataEntries = useAtomValue(dataEntriesAtom);

  // This should never happen, but check just in case and to make TypeScript happy
  if (!dataEntries) {
    throw new InternalError('No data entries found');
  }

  const parentRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: dataEntries?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <>
      <div
        ref={parentRef}
        className="h-1/3 overflow-auto border border-gray-700"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <Row dataEntry={dataEntries[virtualItem.index]} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
