import React from "react";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import { Pagination } from "@/components/shared/pagination";
import LivePreviewButton from "@/components/shared/live-preview-button";

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
            ) : data && data.length > 0 ? (
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
                      <LivePreviewButton 
                        slug={row.slug} 
                        status={row.status} 
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (indexed ? 2 : 1) + 1} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-900">No businesses found</p>
                    <p className="text-sm text-gray-500">Get started by adding your first business</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && setPage && data && data.length > 0 && (
       <div className="flex justify-center items-center mt-12">
         <Pagination totalPages={totalPages} page={page} setPage={setPage} dataLength={data.length} />
         </div>
      )}
    </div>
  );
}
