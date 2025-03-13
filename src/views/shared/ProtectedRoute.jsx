// ProtectedRoute
// Not required... Depends.

import { UserProvider } from "../../context/UserContext"

function ProtectedRoute({children}) {
    // Add a middleware protection for front-end, idk
    return (
        <UserProvider>
            <div className="layout">
                {children}
            </div>
        </UserProvider>
    )
}

export default ProtectedRoute