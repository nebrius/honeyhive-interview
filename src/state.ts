import { atom } from 'jotai';

import { DataEntry } from './types';

export const dataEntriesAtom = atom<DataEntry[] | null>(null);
