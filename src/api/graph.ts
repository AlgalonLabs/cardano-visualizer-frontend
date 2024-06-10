import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { type, start_time, end_time } = req.query;

    try {
        const response = await axios.get(`http://localhost:8001/graph/${type}`, {
            params: { start_time, end_time }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}