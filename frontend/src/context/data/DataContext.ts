import type { DataContextType } from '@types';
import { createContext } from 'react';

export const DataContext = createContext<DataContextType | undefined>(undefined);
