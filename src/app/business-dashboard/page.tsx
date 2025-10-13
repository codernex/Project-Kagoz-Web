"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Table from "@/components/bizness/table"
import DeleteConfirmationModal from "@/components/shared/delete-confirmation-modal"

import { useGetBusinessByCurrentUserQuery, useDeleteBusinessMutation } from "@/redux/api/business"
import { useAuth } from "@/context/AuthContext"

interface Business {
  id: number
  name: string
  status: "Pending" | "Active"
}


export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [businessToDelete, setBusinessToDelete] = useState<{ id: number; name: string; slug: string } | null>(null)
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
  const [deleteBusiness, { isLoading: isDeleting }] = useDeleteBusinessMutation()
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

  const handleDeleteClick = (row: any) => {
    setBusinessToDelete({
      id: row.id,
      name: row.name,
      slug: row.slug
    })
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!businessToDelete) return

    try {
      await deleteBusiness({ id: businessToDelete.id }).unwrap()
      setDeleteModalOpen(false)
      setBusinessToDelete(null)
      // The toast message is already handled by the mutation
    } catch (error) {
      console.error('Failed to delete business:', error)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setBusinessToDelete(null)
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
        onDelete={handleDeleteClick}
        indexed
        pagination
        totalPages={businessData?.totalPages ?? 1}
        page={businessData?.currentPage ?? currentPage}
        setPage={handlePageChange}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        businessName={businessToDelete?.name || ""}
        isLoading={isDeleting}
      />
    </main>
  )
}
