import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { Navbar } from "@/components/layout/Navbar";
import { Dashboard } from "./Dashboard";
import { UploadQuestion } from "./UploadQuestion";
import { MyQuestions } from "./MyQuestions";
import { Explore } from "./Explore";
import { Settings } from "./Settings";

const Index = () => {
  const [currentView, setCurrentView] = useState<"login" | "signup" | "dashboard">("login");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState<{ username: string; avatar?: string } | null>(null);

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
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("login");
    setCurrentPage("dashboard");
  };

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
