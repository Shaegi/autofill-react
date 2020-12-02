import { useCallback, useState } from "react";

type SetState<T> = (action: T | ((prev: T) => T)) => void

export default function usePersistedState<T = undefined>(key: string, initialValue: T): {
    state: T,
    setState: SetState<T>}
    {
    
    const [state, dispatchState] = useState<T>(() => {
        const localStorageItem = localStorage.getItem(key)
        if(localStorageItem ) {
            try {
                return JSON.parse(localStorageItem)
            } catch (e) {
                return initialValue || null
            }
        }
        return localStorageItem !== undefined ? localStorageItem : initialValue
    })

    const setState = useCallback<SetState<T>>((dispatch) => {
        const persist = (value: T) => {
            localStorage.setItem(key, JSON.stringify(value))
        }
            dispatchState(prev => {
                if(typeof dispatch === 'function') {
                    const next = (dispatch as any)(prev)
                    persist(next)
                    return next
                } else {
                    const next = dispatch
                    persist(next)
                    return next
                }
            })
    }, [key])

    return {
        state, 
        setState
    }
}