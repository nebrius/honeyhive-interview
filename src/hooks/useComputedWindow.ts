import { useMemo } from 'react';

// This function computes the average of data values grouped by the specified
// bucket size. TODO: this is pretty specific to the sample data, given even the
// largest data set happens in a single day. Really though, we should also
// support an optional time window to compute a moving average.
//
// We would need this if, say, we wanted to create SLAs, and alerts on them,
// based on seasonal data (aka daily, weekly, etc). As-is, this setup is subject
// to seasonal affects, such as reduced traffic (and likely decreased response
// time) on weekends vs weekdays.
export function useComputedWindow(
  data: Array<{ value: number; date: Date }>,
  bucketSizeMs: number,
  startDate: Date,
  endDate: Date
): Array<{ value: number; date: Date }> {
  return useMemo(() => {
    // Filter data to the date range
    const filtered = data.filter(
      (item) => item.date >= startDate && item.date <= endDate
    );

    // Group values by bucket
    const buckets = new Map<
      string,
      { values: number[]; bucketStartDate: Date }
    >();

    filtered.forEach((item) => {
      const bucketStartDate = getBucketStartDate(item.date, bucketSizeMs);
      const bucketKey = bucketStartDate.toISOString();

      if (!buckets.has(bucketKey)) {
        buckets.set(bucketKey, { values: [], bucketStartDate });
      }
      buckets.get(bucketKey)!.values.push(item.value);
    });

    // Compute average for each bucket and format result
    const result: Array<{ value: number; date: Date }> = [];
    buckets.forEach(({ values, bucketStartDate }) => {
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      result.push({
        value: average,
        date: bucketStartDate,
      });
    });
    result.sort((a, b) => a.date.getTime() - b.date.getTime());

    return result;
  }, [data, bucketSizeMs, startDate, endDate]);
}

function getBucketStartDate(date: Date, bucketSizeMs: number): Date {
  // Calculate which bucket this date falls into by dividing timestamp by bucket size
  const timestamp = date.getTime();
  const bucketIndex = Math.floor(timestamp / bucketSizeMs);
  const bucketStartTimestamp = bucketIndex * bucketSizeMs;

  return new Date(bucketStartTimestamp);
}
