/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FilterState, Language } from '../types';
import { FilterPanel } from './FilterPanel';

interface FiltersSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  lang: Language;
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({ filters, setFilters, lang }) => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm sticky top-24">
      <FilterPanel filters={filters} setFilters={setFilters} lang={lang} />
    </div>
  );
};
