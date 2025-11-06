import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import { useComputedWindow } from '@/hooks/useComputedWindow';
import { dataEntriesAtom } from '@/state';
import { InternalError } from '@/util/error';

import { Graph } from './Graph';

export function FactualAccuracy() {
  const dataEntries = useAtomValue(dataEntriesAtom);

  // This should never happen, but check just in case and to make TypeScript happy
  if (!dataEntries) {
    throw new InternalError('No data entries found');
  }

  const responseTimeData = useMemo(() => {
    return dataEntries
      .filter((entry) => entry.evaluation_metrics !== null)
      .map((entry) => ({
        value: entry.evaluation_metrics!.factual_accuracy ?? 0,
        // TODO: this date object should be created at atom hydration time instead of here
        date: new Date(entry.timestamp),
      }));
  }, [dataEntries]);

  // Compute the start and end date of data.
  // TODO: make this a default value in the UI that can be configured by the user.
  const { startDate, endDate } = useMemo(() => {
    if (responseTimeData.length === 0) {
      const now = new Date();
      return { startDate: now, endDate: now };
    }

    const dates = responseTimeData.map((d) => d.date.getTime());
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    return { startDate: minDate, endDate: maxDate };
  }, [responseTimeData]);

  // Set there to be 100 buckets
  // TODO: make this dynamic based on viewport size
  const bucketSize = (endDate.getTime() - startDate.getTime()) / 100;

  const computedWindow = useComputedWindow(
    responseTimeData,
    bucketSize, // TODO: compute this based on
    startDate,
    endDate
  );

  // TODO: make beginAtZero user configurable
  return <Graph title="Response Time" data={computedWindow} />;
}
