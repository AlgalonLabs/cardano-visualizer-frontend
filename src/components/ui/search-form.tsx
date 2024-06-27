import React from 'react';
import {Button} from "@/components/ui/button";

interface SearchFormProps {
    onSubmit: (e: React.FormEvent) => void;
    searchInputRef: React.RefObject<HTMLInputElement>;
}

const SearchForm: React.FC<SearchFormProps> = ({onSubmit, searchInputRef}) => (
    <form onSubmit={onSubmit}>
        <input
            type="text"
            ref={searchInputRef}
            placeholder="Search for an asset, block, address, epoch, or transaction."
            style={{width: '70%', padding: '10px', marginBottom: '10px'}}
        />
        <Button type="submit" style={{padding: '10px'}}>Search</Button>
    </form>
);

export default SearchForm;