import { Outlet, Navigate } from "react-router-dom";
import {Navbar} from "@/components/layout/Navbar";

export const ProtectedLayout = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <Outlet /> {/* renders the nested route */}
      </div>
    </div>
  );
};
