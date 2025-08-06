import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { Navbar } from "@/components/layout/Navbar";
import { Dashboard } from "./Dashboard";
import { UploadQuestion } from "./UploadQuestion";
import { MyQuestions } from "./MyQuestions";
import { Explore } from "./Explore";
import { CodeLive } from "./CodeLive";
import { Settings } from "./Settings";

const Index = () => {
  const [currentView, setCurrentView] = useState<"login" | "signup" | "dashboard">("login");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState<{ username: string; avatar?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token and validate it on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Validate token by fetching user profile
        const response = await fetch("http://localhost:8000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Token is invalid, clear it
          localStorage.removeItem("token");
          throw new Error("Invalid token");
        }

        const userData = await response.json();
        
        // Set user data and view state
        setCurrentUser({ 
          username: userData.username,
          avatar: userData.avatar
        });
        setCurrentView("dashboard");
        
        // Restore last visited page if available
        const lastPage = localStorage.getItem("lastPage");
        if (lastPage) {
          setCurrentPage(lastPage);
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = (username: string) => {
    setCurrentUser({ username });
    setCurrentView("dashboard");
    setCurrentPage("dashboard");
  };

  const handleSignupSuccess = () => {
    setCurrentView("login");
  };

  const handleSwitchToSignup = () => {
    setCurrentView("signup");
  };

  const handleSwitchToLogin = () => {
    setCurrentView("login");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    // Save current page to localStorage for persistence
    localStorage.setItem("lastPage", page);
  };

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("lastPage");
    
    setCurrentUser(null);
    setCurrentView("login");
    setCurrentPage("dashboard");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Auth views
  if (currentView === "login") {
    return <LoginForm onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} />;
  }

  if (currentView === "signup") {
    return <SignupForm onSignupSuccess={handleSignupSuccess} onSwitchToLogin={handleSwitchToLogin} />;
  }

  // Main app with navbar
  if (!currentUser) return null;

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />;
      case "upload":
        return <UploadQuestion onNavigate={handleNavigate} />;
      case "my-questions":
        return <MyQuestions onNavigate={handleNavigate} />;
      case "explore":
        return <Explore onNavigate={handleNavigate} />;
      case "code-live":
        return <CodeLive onNavigate={handleNavigate} />;
      case "settings":
        return <Settings onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        user={currentUser}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      {renderCurrentPage()}
    </div>
  );
};

export default Index;
