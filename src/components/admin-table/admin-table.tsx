import { columns } from "@/components/admin-table/columns";
import { DataTable } from "@/components/admin-table/data-table";
import { rows } from "@/components/admin-table/rows";

export interface AdminTableProps {}

export function AdminTable(props: AdminTableProps) {
  const {} = props;

  return (
    <>
      <DataTable columns={columns} data={rows} />
    </>
  );
}
