'use client'

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {AdaData, DashboardProps, DashboardState} from '@/types/dashboard';
import AdvancedSearch from "@/components/advanced-search";

const Dashboard: React.FC<DashboardProps> = () => {
    const [state, setState] = useState<DashboardState>({
        adaData: null,
        transactionData: []
    });

    useEffect(() => {
        const fetchAdaData = async () => {
            try {
                const response = await fetch('http://localhost:8002/cardano/data');
                const data: AdaData = await response.json();
                setState(prevState => ({...prevState, adaData: data}));
            } catch (error) {
                console.error('Error fetching ADA data:', error);
            }
        };

        fetchAdaData();

        const intervalId = setInterval(fetchAdaData, 5 * 60 * 1000); // Refresh every 5 minutes

        return () => clearInterval(intervalId);
    }, []);

    const formatNumber = (num: number | undefined) => {
        return num?.toLocaleString() ?? 'N/A';
    };

    const handleSearch = (type: string, term: string, view: 'list' | 'graph') => {
        console.log(`Searching for ${type}: ${term} in ${view} view`);
        // Implement your search logic here
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Cardano Dashboard</h1>

            <AdvancedSearch onSearch={handleSearch}/>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>ADA Price</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            ${state.adaData?.price ? formatNumber(state.adaData.price) : 'Loading...'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Market Cap</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            ${state.adaData?.market_cap ? formatNumber(state.adaData.market_cap) : 'Loading...'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>24h Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            ${state.adaData?.volume_24h ? formatNumber(state.adaData.volume_24h) : 'Loading...'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>24h Change</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-2xl font-bold ${state.adaData?.percent_change_24h && state.adaData.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {state.adaData?.percent_change_24h ? `${state.adaData.percent_change_24h.toFixed(2)}%` : 'Loading...'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction Types</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={state.transactionData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="timestamp"/>
                                <YAxis/>
                                <Tooltip/>
                                <Line type="monotone" dataKey="count" stroke="#8884d8"/>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;