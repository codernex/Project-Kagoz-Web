"use client"
import { Provider } from "react-redux"
import { store } from "."

export default function ReduxWrapper({ children }: React.PropsWithChildren) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}