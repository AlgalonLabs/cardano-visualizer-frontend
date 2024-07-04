export type Address = {
    id: string
    label: string
    type: 'Address'
}

export interface AddressRow {
  address: string;
  balance: number;
  transactionCount: number;
}

export interface AddressResponse {
  addresses: {
    address: string;
    balance: number;
    transactionCount: number;
  }[];
  totalCount: number;
  page: number;
  pageSize: number;
}