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
  ['evaluation_metrics', 'factual_accuracy'],
] as const satisfies readonly (
  | keyof DataEntry
  // TODO: NonNullable isn't a great option, but works in a pinch. Make this stricter
  | [keyof DataEntry, keyof NonNullable<DataEntry['evaluation_metrics']>]
)[];

function Row({ dataEntry }: { dataEntry: DataEntry }) {
  return (
    <div className="flex gap-1">
      {COLUMNS_TO_SHOW.map((column) => (
        // TODO: make the width dynamic based on the content
        <div key={column.toString()} className="w-60">
          {Array.isArray(column)
            ? dataEntry[column[0]]?.[column[1]]
            : dataEntry[column]}
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
    count: dataEntries.data.responses.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <>
      {/* Fixed Header */}
      <div className="flex gap-1 border border-gray-700 border-b-0 bg-gray-800 p-2 font-semibold">
        {COLUMNS_TO_SHOW.map((column) => (
          <div key={column.toString()} className="w-60">
            {Array.isArray(column) ? column.join('.') : column}
          </div>
        ))}
      </div>
      {/* Scrollable Content */}
      <div
        ref={parentRef}
        className="h-1/3 overflow-auto border border-gray-700 p-2"
      >
        <div
          className="w-full relative"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              className="absolute top-0 left-0 w-full"
              style={{
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <Row dataEntry={dataEntries.data.responses[virtualItem.index]} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
