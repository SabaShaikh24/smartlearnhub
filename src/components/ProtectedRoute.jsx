import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

export default function ProtectedRoute({ children }) {
  const { user,loading} = useContext(UserContext);
  if (loading) {
    return (
      <div
        role="status"
        aria-label="Checking authentication"
        className="flex justify-center items-center h-screen"
      >
        <span className="h-6 w-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mr-2"></span>
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    // not logged in → send to login
    return <Navigate to="/login" replace />;
  }

  return children; // logged in → show the page
}
