import { TableMeta, RowData } from "@tanstack/react-table";
import { Session } from "next-auth";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    session?: Session | null;
    editable?: boolean;
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
    removeRow?: (rowIndex: number) => void;
  }

  interface ColumnMeta<TData, TValue> {
    getCellContext: (
      context: CellContext<TData, TValue>
    ) => TableCellProps | void;
  }
}
