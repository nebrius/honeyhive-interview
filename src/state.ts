import { atom } from 'jotai';

import { StoredDataEntry } from './types';

export const dataEntriesAtom = atom<StoredDataEntry | null>(null);
