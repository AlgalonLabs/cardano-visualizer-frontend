'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import AdvancedSearch from "@/components/advanced-search";

const GraphPage: React.FC = () => {
    const router = useRouter();

    const handleSearch = (type: string, term: string, view: 'table' | 'graph') => {
        if (view === 'graph') {
            switch (type) {
                case 'block':
                    router.push(`/graph/blocks/${term}`);
                    break;
                case 'address':
                    router.push(`/graph/addresses/${term}`);
                    break;
                case 'transaction':
                    router.push(`/graph/transactions/${term}`);
                    break;
                case 'epoch':
                    router.push(`/graph/epochs/${term}`);
                    break;
                case 'asset':
                    router.push(`/graph/assets/${term}`);
                    break;
                default:
                    console.error('Unknown search type:', type);
            }
        } else {
            // Handle table view (you might want to redirect to a table page)
            console.log('Show table view for', type, term);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Cardano Graph Explorer</h1>
            <AdvancedSearch onSearch={handleSearch}/>
        </div>
    );
};

export default GraphPage;