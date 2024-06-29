import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";

interface DetailItem {
    label: string;
    value: string | number;
}

interface DetailCardProps {
    title: string;
    details: DetailItem[];
}

const DetailCard: React.FC<DetailCardProps> = ({title, details}) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        {details.map((detail, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{detail.label}</TableCell>
                                <TableCell>{detail.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default DetailCard;