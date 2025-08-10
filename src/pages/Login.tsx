import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = (username: string) => {
    // Login logic is handled in AuthContext
  };

  const handleSwitchToSignup = () => {
    navigate("/signup");
  };

  return <LoginForm onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} />;
};

export default Login;