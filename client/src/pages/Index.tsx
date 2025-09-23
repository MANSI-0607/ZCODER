import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        await res.json();
        navigate("/dashboard"); // redirect if logged in
      } catch {
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-hero p-6">
      <h1 className="text-4xl font-bold gradient-text mb-4">Welcome to ZCODER</h1>
      <p className="text-muted-foreground mb-6">Your coding community awaits 🚀</p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="btn-primary px-6 py-2 rounded-lg font-semibold"
        >
          Log In
        </Link>
        <Link
          to="/signup"
          className="btn-secondary px-6 py-2 rounded-lg font-semibold"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Index;
