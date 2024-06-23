import { Block, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Block[]> {
  // Fetch data from your API here.
  return [
    {
      hash: "abc123",
      block_no: 1,
      epoch_no: 1,
      slot_no: 123,
      size: 1024,
      tx_count: 10,
      time: "2023-01-01T00:00:00Z",
    },
    // ...
  ];
}

export default async function BlocksPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}