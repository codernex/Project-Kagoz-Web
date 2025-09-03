import React from "react";
import { Button } from "@/components/ui/button";
import { PenLine, SquareArrowOutUpRight } from "lucide-react";
import { Pagination } from "@/components/shared/pagination";

const statusColors: Record<"Pending" | "Active", string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Active: "bg-green-100 text-green-700",
};

type TableColumn = {
  text: string;
  dataField: string;
  formatter?: (value: any, row: any) => React.ReactNode;
};

type TableProps = {
  columns: TableColumn[];
  data: any[];
  loading: boolean;
  action?: React.ReactNode;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onReload?: () => void;
  indexed?: boolean;
  pagination?: boolean;
  // pagination controls (when pagination is true)
  totalPages?: number;
  page?: number;
  setPage?: (page: number) => void;
};

export default function Table({
  columns,
  data,
  loading,
  action,
  onEdit,
  indexed,
  pagination,
  totalPages = 1,
  page = 1,
  setPage,
}: TableProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-[32px] font-semibold text-[#111827]">Business Lists</h2>
          <p className="text-[#6F6D71] text-sm">
            Easily manage and explore the businesses listed here
          </p>
        </div>
        <div>{action}</div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white  overflow-hidden shadow">
          <thead>
            <tr className="bg-purple-50">
              {indexed && (
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">#</th>
              )}
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-3 text-left text-sm font-medium text-gray-700">{col.text}</th>
              ))}
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (indexed ? 2 : 1) + 1} className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : (
              data?.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="border-b border-[#0000001A]  ">
                  {/* Index */}
                  {indexed && (
                    <td className="px-6 py-4 text-sm text-gray-500">{rowIndex + 1}</td>
                  )}
                  {/* Dynamic columns */}
                  {columns.map((col, idx) => (
                    <td key={idx} className="px-6 py-4 text-sm text-gray-800">
                      {col.formatter ? col.formatter(row[col.dataField], row) : row[col.dataField]}
                    </td>
                  ))}
                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs rounded-full ${statusColors[row.status as "Pending" | "Active"] ?? ""}`}>{row.status}</span>
                  </td>
                  {/* Action Buttons */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-4 justify-center">
                      <button
                        className="border border-[#6F00FF] text-[#6F00FF] bg-white px-5 py-2 rounded-[8px] font-medium text-sm flex items-center gap-2 hover:bg-purple-50 transition"
                        onClick={() => onEdit && onEdit(row)}
                      >
                        <PenLine className="w-[16px] h-[16px]" /> Edit
                      </button>
                      {row.status === "Pending" ? (
                        <button className="bg-[#6F00FF] text-white px-5 py-2 rounded-[8px] font-medium text-sm flex items-center gap-2  transition">
                          <SquareArrowOutUpRight className="w-[16px] h-[16px]" /> Preview
                        </button>
                      ) : (
                        <button className="bg-[#6F00FF] text-white px-5 py-2 rounded-[8px] font-medium text-sm flex items-center gap-2  transition">
                          <SquareArrowOutUpRight className="w-[16px] h-[16px]" /> Live Preview
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && setPage && (
       <div className="flex justify-center items-center absolute bottom-0 left-0 right-0">
         <Pagination totalPages={totalPages} page={page} setPage={setPage} />
         </div>
      )}
    </div>
  );
}
