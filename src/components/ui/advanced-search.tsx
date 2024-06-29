import React, {useState} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {NetworkIcon, TableIcon} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

const searchTypes = [
    {value: 'epoch', label: 'Epoch'},
    {value: 'block', label: 'Block'},
    {value: 'address', label: 'Address'},
    {value: 'token', label: 'Token'},
    {value: 'transaction', label: 'Transaction'},
    {value: 'scriptHash', label: 'Script Hash'},
];

interface AdvancedSearchProps {
    onSearch: (type: string, term: string, view: 'table' | 'graph') => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({onSearch}) => {
    const [searchType, setSearchType] = useState(searchTypes[0].value);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'table' | 'graph'>('table');

    const handleSearch = () => {
        onSearch(searchType, searchTerm, view);
    };

    return (
        <TooltipProvider>
            <div className="flex items-center space-x-2">
                <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select search type"/>
                    </SelectTrigger>
                    <SelectContent>
                        {searchTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input
                    type="text"
                    placeholder={`Search for ${searchType}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                setView('table');
                                handleSearch();
                            }}
                        >
                            <TableIcon className={view === 'table' ? 'text-primary' : 'text-muted-foreground'}/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Query for table</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                setView('graph');
                                handleSearch();
                            }}
                        >
                            <NetworkIcon className={view === 'graph' ? 'text-primary' : 'text-muted-foreground'}/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Query with visualizer</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
};

export default AdvancedSearch;