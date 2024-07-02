import {InputUTXOInfo, OutputUTXOInfo} from "@/types/transaction";

export const calculateTotal = (items: InputUTXOInfo[] | OutputUTXOInfo[]): number => {
    return items.reduce((sum, item) => sum + item.amount, 0);
};