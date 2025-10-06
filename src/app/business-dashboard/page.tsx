"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Table from "@/components/bizness/table"

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
  const router = useRouter()
  const searchParams = useSearchParams()
  const isMountedRef = useRef(true)
  
  // Get page from URL parameters on component mount
  useEffect(() => {
    const pageParam = searchParams.get('page')
    if (pageParam) {
      const pageNumber = parseInt(pageParam, 10)
      if (!isNaN(pageNumber) && pageNumber > 0) {
        setCurrentPage(pageNumber)
      }
    }
  }, [searchParams])

  // Cleanup function to prevent state updates after unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const { data: businessData, isLoading, isFetching, refetch } = useGetBusinessByCurrentUserQuery({ all: false, limit: 10, page: currentPage }, { skip: !isAuth })
console.log(businessData)
  const columns = [
    {
      text: "Name",
      dataField: "name",
      formatter: (value: any) => value,
    },
  ];

  const tableRows = (businessData?.business ?? []).map((b: IBusiness) => ({
    id: b.id,
    name: b.name,
    slug: b.slug, // Add slug to the row data
    status: b.isApproved ? "Active" : "Pending",
  }))

  const handleEditClick = (row: any) => {
    try {
      router.push(`/business-dashboard/edit-business/${row.slug}`)
    } catch (error) {
      console.warn('Navigation error handled:', error)
      window.location.href = `/business-dashboard/edit-business/${row.slug}`
    }
  }

  const handlePageChange = (page: number) => {
    if (!isMountedRef.current) return
    
    setCurrentPage(page)
    // Update URL with new page parameter
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('page', page.toString())
      router.push(url.pathname + url.search)
    } catch (error) {
      console.warn('Navigation error handled:', error)
    }
  }

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
              try {
                router.push("/business-dashboard/setup-business");
              } catch (error) {
                console.warn('Navigation error handled:', error)
                window.location.href = "/business-dashboard/setup-business"
              }
            }}
          >
            + Add Business
          </button>
        }
        onEdit={handleEditClick}
        indexed
        pagination
        totalPages={businessData?.totalPages ?? 1}
        page={businessData?.currentPage ?? currentPage}
        setPage={handlePageChange}
      />
    </main>
  )
}
