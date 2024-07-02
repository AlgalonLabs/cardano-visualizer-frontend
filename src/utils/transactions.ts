import {UTXOInfo} from "@/types/transaction";

export const calculateTotal = (items: UTXOInfo[]): number => {
    return items.reduce((sum, item) => sum + item.amount, 0);
};