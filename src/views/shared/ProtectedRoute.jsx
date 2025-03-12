// ProtectedRoute
// Not required... Depends.
function ProtectedRoute({children}) {
    // Add a middleware protection for front-end, idk
    return (
        <div className="layout">
             {children}
        </div>
    )
}

export default ProtectedRoute