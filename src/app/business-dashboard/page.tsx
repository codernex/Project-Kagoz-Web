"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Table from "@/components/bizness/table"
import { Button } from "@/components/ui/button"
import { useGetBusinessByCurrentUserQuery } from "@/redux/api/business"
import { useAuth } from "@/context/AuthContext"

interface Business {
  id: number
  name: string
  status: "Pending" | "Active"
}


export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const { isAuth } = useAuth()
  const { data: businessData, isLoading, isFetching, refetch } = useGetBusinessByCurrentUserQuery({ all: false, limit: 10, page: currentPage }, { skip: !isAuth })
console.log(businessData)
  const columns = [
    {
      text: "Name",
      dataField: "name",
      formatter: (value: any) => value,
    },
  ];

  const tableRows = (businessData?.business ?? []).map((b) => ({
    id: b.id,
    name: b.name,
    status: b.isApproved ? "Active" : "Pending",
  }))

  const route = useRouter();
  return (
    <main className="p-4 lg:p-8">
      <Table
        columns={columns}
        data={tableRows}
        loading={isLoading || isFetching}
        onReload={() => refetch()}
        action={
          <button
            className="bg-[#6F00FF] text-white px-[20px] py-[10px] rounded-[8px] font-medium text-sm flex items-center gap-2  transition"
            onClick={() => {
              route.push("/business-dashboard/setup-business");
            }}
          >
            + Add Business
          </button>
        }
        onEdit={(row) => route.push(`/business-dashboard/edit-business/${row.name}-${row.id}`)}
        indexed
        pagination
        totalPages={businessData?.totalPages ?? 1}
        page={businessData?.currentPage ?? currentPage}
        setPage={setCurrentPage}
      />
    </main>
  )
}
