import React from 'react';
import {useFetchAddressDetails} from "../hooks";


interface AddressDetailsProps {
    address: string;
    onClose: () => void;
}

const AddressDetails: React.FC<AddressDetailsProps> = ({ address, onClose }) => {
    const { addressDetails, isLoading, error, fetchAddressDetails } = useFetchAddressDetails();

    React.useEffect(() => {
        fetchAddressDetails(address);
    }, [address]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <button onClick={onClose} style={{ float: 'right', marginBottom: '10px' }}>Close</button>
            <h2>Address Details</h2>
            {addressDetails && (
                <div>
                    <p>Address: {addressDetails.address}</p>
                    <p>Balance: {addressDetails.balance}</p>
                    {/* Render other addresses details */}
                </div>
            )}
        </div>
    );
};

export default AddressDetails;