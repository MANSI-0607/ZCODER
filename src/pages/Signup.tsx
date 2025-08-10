import { SignupForm } from "@/components/auth/SignupForm";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Signup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSignupSuccess = () => {
    navigate("/login");
  };

  const handleSwitchToLogin = () => {
    navigate("/login");
  };

  return <SignupForm onSignupSuccess={handleSignupSuccess} onSwitchToLogin={handleSwitchToLogin} />;
};

export default Signup;