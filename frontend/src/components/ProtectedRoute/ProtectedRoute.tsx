import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { Spinner } from "../ui/Spinner";

interface ProtectedRouteProps {
    children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <Spinner />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />
    }

    return children ? <>{children}</> : <Outlet />
}
