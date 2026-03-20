import { createContext, useContext, useState } from 'react'

const UserCtx = createContext()

export function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        const s = localStorage.getItem('eg_user_v2')
        return s ? JSON.parse(s) : null
    })

    const saveUser = (data) => {
        setUser(data)
        localStorage.setItem('eg_user_v2', JSON.stringify(data))
    }

    const clearUser = () => {
        setUser(null)
        localStorage.removeItem('eg_user_v2')
    }

    return (
        <UserCtx.Provider value={{ user, saveUser, clearUser }}>
            {children}
        </UserCtx.Provider>
    )
}

export const useUser = () => useContext(UserCtx)
