import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useUser();

    // Show a proper loading screen
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <p className="text-white/70 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    // If not loading and no user, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // User is authenticated
    return children;
};

export default ProtectedRoute;