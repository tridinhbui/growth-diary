'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, SortAsc, SortDesc, X } from 'lucide-react';

interface Entry {
  _id: string;
  moodScore: number;
  date: Date | string;
  note: string;
}

interface EntrySearchProps {
  entries: Entry[];
  onFilteredEntries: (filtered: Entry[]) => void;
}

interface FilterOptions {
  searchTerm: string;
  moodRange: [number, number];
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: 'date' | 'mood';
  sortOrder: 'asc' | 'desc';
  hasNote: 'all' | 'with-note' | 'no-note';
}

const moodEmojis = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '😊',
  5: '😍'
};

export default function EntrySearch({ entries, onFilteredEntries }: EntrySearchProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    moodRange: [1, 5],
    dateRange: {
      start: '',
      end: ''
    },
    sortBy: 'date',
    sortOrder: 'desc',
    hasNote: 'all'
  });

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let filtered = [...entries];

    // Text search
    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.note.toLowerCase().includes(searchLower)
      );
    }

    // Mood range filter
    filtered = filtered.filter(entry => 
      entry.moodScore >= filters.moodRange[0] && 
      entry.moodScore <= filters.moodRange[1]
    );

    // Date range filter
    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start);
      filtered = filtered.filter(entry => 
        new Date(entry.date) >= startDate
      );
    }

    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(entry => 
        new Date(entry.date) <= endDate
      );
    }

    // Note filter
    if (filters.hasNote === 'with-note') {
      filtered = filtered.filter(entry => entry.note.trim().length > 0);
    } else if (filters.hasNote === 'no-note') {
      filtered = filtered.filter(entry => entry.note.trim().length === 0);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (filters.sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (filters.sortBy === 'mood') {
        comparison = a.moodScore - b.moodScore;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [entries, filters]);

  // Update parent component when filtered entries change
  useMemo(() => {
    onFilteredEntries(filteredEntries);
  }, [filteredEntries, onFilteredEntries]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      moodRange: [1, 5],
      dateRange: {
        start: '',
        end: ''
      },
      sortBy: 'date',
      sortOrder: 'desc',
      hasNote: 'all'
    });
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchTerm.trim() !== '' ||
      filters.moodRange[0] !== 1 ||
      filters.moodRange[1] !== 5 ||
      filters.dateRange.start !== '' ||
      filters.dateRange.end !== '' ||
      filters.hasNote !== 'all' ||
      filters.sortBy !== 'date' ||
      filters.sortOrder !== 'desc'
    );
  }, [filters]);

  // Get quick filter presets
  const quickFilters = [
    {
      label: 'Tuần này',
      action: () => {
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        updateFilter('dateRange', {
          start: weekStart.toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0]
        });
      }
    },
    {
      label: 'Tháng này',
      action: () => {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        updateFilter('dateRange', {
          start: monthStart.toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0]
        });
      }
    },
    {
      label: 'Tâm trạng tốt',
      action: () => updateFilter('moodRange', [4, 5])
    },
    {
      label: 'Tâm trạng không tốt',
      action: () => updateFilter('moodRange', [1, 2])
    },
    {
      label: 'Có ghi chú',
      action: () => updateFilter('hasNote', 'with-note')
    }
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={filters.searchTerm}
          onChange={(e) => updateFilter('searchTerm', e.target.value)}
          placeholder="Tìm kiếm trong nhật ký..."
          className="input-field pl-10 pr-20"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-1 rounded ${
            showFilters ? 'text-blue-600' : 'text-gray-400'
          } hover:text-blue-600`}
        >
          <Filter className="w-5 h-5" />
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded text-gray-400 hover:text-red-600"
            title="Xóa bộ lọc"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Hiển thị {filteredEntries.length} / {entries.length} nhật ký
          {hasActiveFilters && ' (đã lọc)'}
        </span>
        
        <div className="flex items-center gap-2">
          <span>Sắp xếp:</span>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              updateFilter('sortBy', sortBy);
              updateFilter('sortOrder', sortOrder);
            }}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="date-desc">Ngày (mới nhất)</option>
            <option value="date-asc">Ngày (cũ nhất)</option>
            <option value="mood-desc">Tâm trạng (cao nhất)</option>
            <option value="mood-asc">Tâm trạng (thấp nhất)</option>
          </select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter, index) => (
          <button
            key={index}
            onClick={filter.action}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-800">Bộ lọc nâng cao</h3>
          
          {/* Mood Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoảng tâm trạng
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-12">Từ:</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={`min-${score}`}
                      onClick={() => updateFilter('moodRange', [score, Math.max(score, filters.moodRange[1])])}
                      className={`p-2 rounded-lg text-xl transition-colors ${
                        filters.moodRange[0] === score
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      {moodEmojis[score as keyof typeof moodEmojis]}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-12">Đến:</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={`max-${score}`}
                      onClick={() => updateFilter('moodRange', [Math.min(score, filters.moodRange[0]), score])}
                      className={`p-2 rounded-lg text-xl transition-colors ${
                        filters.moodRange[1] === score
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      {moodEmojis[score as keyof typeof moodEmojis]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {/* Note Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'Tất cả' },
                { value: 'with-note', label: 'Có ghi chú' },
                { value: 'no-note', label: 'Không ghi chú' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => updateFilter('hasNote', option.value)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    filters.hasNote === option.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="btn-secondary flex-1"
            >
              Xóa tất cả bộ lọc
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="btn-primary flex-1"
            >
              Áp dụng bộ lọc
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 