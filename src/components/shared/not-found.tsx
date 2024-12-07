import Link from "next/link"

export const NotFound = () => {
    return (
        <div className="container min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-y-8">
                <h2 className="text-xl font-bold text-black">Requested resource not found</h2>
                <Link href={'/'} className="bg-primary text-white py-3 px-8 rounded-xs">
                    Go Back
                </Link>
            </div>
        </div>
    )
}