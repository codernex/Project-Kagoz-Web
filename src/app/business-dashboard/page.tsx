"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Table from "@/components/bizness/table"
import { Button } from "@/components/ui/button"

interface Business {
  id: number
  name: string
  status: "Pending" | "Active"
}


export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const columns = [
  {
    text: "Name",
    dataField: "name",
    formatter: (value: any) => value,
  },
];

const data = [
  { id: 1, name: "Kagoz.com", status: "Pending" },
  { id: 2,  name: "Arouse Fashion Store", status: "Pending" },
  { id: 3, name: "Haji Cloth Store", status: "Active" },
  { id: 4, name: "Aarong Eastern Agargaon", status: "Active" },
  { id: 5, name: "Fashion Exclusive bd", status: "Active" },
];
const route = useRouter();
  return (
    <main className="p-4 lg:p-8">
  

  <Table
  columns={columns}
  data={data}
  loading={false}
  onReload={() => console.log("reload")}
  action={
    <Button
    variant={'submit'}
      className=""
      onClick={() => {
        route.push("/business-dashboard/add-business");
        console.log("Add new");
      }}
    >
      + Add Business
    </Button>
  }
  onEdit={(row) => route.push(`/business-dashboard/edit-business/${row.id}`)}
  onDelete={(row) => console.log("delete", row)}
  indexed
  pagination
/>
    </main>
  )
}
