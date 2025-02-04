import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

type PaginationProps = {
    currentPage?: number;
    totalPages?: number;
    setPage: (page: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({ currentPage = 1, totalPages = 1, setPage }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const visiblePages = 2; // Maximum visible pages set to 2

    const updateQueryParam = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`?${params.toString()}`);
        setPage(page);
    };

    const getPageNumbers = () => {
        let pages: (number | string)[] = [];
        if (totalPages <= visiblePages) {
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
            if (currentPage === 1) {
                pages = [1, 2, '...', totalPages];
            } else if (currentPage === totalPages) {
                pages = [1, '...', totalPages - 1, totalPages];
            } else {
                pages = [1, '...', currentPage, '...', totalPages];
            }
        }
        return pages;
    };

    return (
        <div className="flex justify-center items-center space-x-2 mt-4">
            <button
                className="px-1 py-2 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => updateQueryParam(currentPage - 1)}
            >
                <ChevronLeft />
            </button>

            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    className={`px-3 py-2 rounded border ${page === currentPage
                        ? 'bg-blue-500 text-white'
                        : 'border-gray-300 bg-white hover:bg-gray-100'
                        } ${page === '...' ? 'cursor-default' : ''}`}
                    onClick={() => typeof page === 'number' && updateQueryParam(page)}
                    disabled={page === '...'}
                >
                    {page}
                </button>
            ))}

            <button
                className="px-1 py-2 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => updateQueryParam(currentPage + 1)}
            >
                <ChevronRight />
            </button>
        </div>
    );
};
