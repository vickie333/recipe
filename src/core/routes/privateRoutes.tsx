
import { Navigate } from "react-router-dom";
import type { Props } from "@/core/types";
import { useAuth } from "@/core/hooks/useAuth";

export function PrivateRoutes({ children }: Props) {
    const { user, isLoading: loading } = useAuth()


    if (loading) return <p>...Loading</p>
    if (!user) return <Navigate to="/login" replace />

    return children
}
