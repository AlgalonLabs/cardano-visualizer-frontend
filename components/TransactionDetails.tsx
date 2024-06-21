import React from 'react';
import {useFetchTransactionDetails} from "../hooks";

interface TransactionDetailsProps {
    txHash: string;
    onClose: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ txHash, onClose }) => {
    const { transactionDetails, isLoading, error, fetchTransactionDetails } = useFetchTransactionDetails();

    React.useEffect(() => {
        fetchTransactionDetails(txHash);
    }, [txHash]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <button onClick={onClose} style={{ float: 'right', marginBottom: '10px' }}>Close</button>
            <h2>Transaction Details</h2>
            {transactionDetails && (
                <div>
                    <p>Transaction Hash: {transactionDetails.txHash}</p>
                    <p>Timestamp: {transactionDetails.timestamp}</p>
                    {/* Render other transaction details */}
                </div>
            )}
        </div>
    );
};

export default TransactionDetails;