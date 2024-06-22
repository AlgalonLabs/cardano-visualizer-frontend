import React from 'react';
import { TimeRange } from '../../types';

interface SearchFormProps {
    onSubmit: (e: React.FormEvent) => void;
    timeRange: TimeRange;
    setTimeRange: React.Dispatch<React.SetStateAction<{ start: string, end: string }>>;
    searchInputRef: React.RefObject<HTMLInputElement>;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSubmit, timeRange, setTimeRange, searchInputRef }) => (
    <form onSubmit={onSubmit}>
        <input
            type="text"
            ref={searchInputRef}
            placeholder="Search for an asset, block, address or transaction."
            style={{ marginRight: '10px' }}
        />
        <input
            type="date"
            value={timeRange.start}
            onChange={(e) => setTimeRange({ ...timeRange, start: e.target.value })}
            style={{ marginRight: '10px' }}
        />
        <input
            type="date"
            value={timeRange.end}
            onChange={(e) => setTimeRange({ ...timeRange, end: e.target.value })}
        />
        <button type="submit" style={{ marginLeft: '10px' }}>Search</button>
    </form>
);

export default SearchForm;