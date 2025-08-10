import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  username: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing token and validate it on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsLoading(false);
        navigate("/login");
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
        
        // Set user data
        setUser({ 
          username: userData.username,
          avatar: userData.avatar
        });
        
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const login = (username: string) => {
    setUser({ username });
    navigate("/dashboard");
  };

  const logout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("lastPage");
    
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};