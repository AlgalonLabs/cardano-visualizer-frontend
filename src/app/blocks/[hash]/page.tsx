'use client'

import React, {useEffect, useState} from 'react';

const BlockDetailsPage = ({params}: { params: { hash: string } }) => {
    const {hash} = params;
    const [blockDetails, setBlockDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (hash) {
            fetch(`http://localhost:8002/blocks/${hash}`)
                .then((response) => response.json())
                .then((data) => {
                    setBlockDetails(data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Failed to fetch block details', error);
                    setIsLoading(false);
                });
        }
    }, [hash]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!blockDetails) {
        return <div>No details available for this block.</div>;
    }

    return (
        <div>
            <h1>Block Details for {hash}</h1>
            <pre>{JSON.stringify(blockDetails, null, 2)}</pre>
        </div>
    );
};

export default BlockDetailsPage;