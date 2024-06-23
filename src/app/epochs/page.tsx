import { Epoch, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Epoch[]> {
  // Fetch data from your API here.
  return [
    {
      no: 1,
      start_time: "2023-01-01T00:00:00Z",
      end_time: "2023-01-02T00:00:00Z",
      blk_count: 100,
      tx_count: 1000,
      out_sum: 1000000,
      fees: 100,
    },
    // ...
  ];
}

export default async function EpochsPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}