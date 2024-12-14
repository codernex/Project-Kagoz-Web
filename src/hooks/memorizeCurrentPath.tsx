import { useMemo } from "react"

export const useMemorizedPath = (path: string) => {
    return useMemo(() => {
        const pathArr = path.split('/')
        const actPath = pathArr[pathArr.length - 1]

        if (actPath === 'dashboard') {
            return '/'
        } else {
            return actPath
        }
    }, [path])
}