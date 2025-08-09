import { useEffect, useState } from "react";
import { UserProfile } from "@/components/dashboard/UserProfile";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

// 1. DEFINE THE USER INTERFACE (as shown above)
interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  institute?: string;
  bio?: string;
  location?: string;
  createdAt: string;
  skills: string[];
  platforms: {
    codeforces?: string;
    leetcode?: string;
    codechef?: string;
    geeksforgeeks?: string;
    github?: string;
    linkedin?: string;
  };
  stats: {
    questionsUploaded: 42;

    solutionsShared: 78;
    likes: 234;

    followers: 89;
  };
}



interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  // 2. ADD STATE FOR USER, LOADING, AND ERRORS
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
useEffect(() => {
  const fetchUserAndQuestions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please log in to continue.");
      setIsLoading(false);
      return;
    }

    try {
      // Fetch profile & questions in parallel
      const [userRes, questionsRes] = await Promise.all([
        fetch("http://localhost:8000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8000/api/questions/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!userRes.ok) {
        const errData = await userRes.json();
        throw new Error(errData.message || "Could not fetch user profile.");
      }
      if (!questionsRes.ok) {
        const errData = await questionsRes.json();
        throw new Error(errData.message || "Could not fetch user questions.");
      }

      const userData = await userRes.json();
      const questionsData = await questionsRes.json();
      console.log(questionsData)
      setUser(userData);

      const recentFive = questionsData.data.slice(0, 5);



      setQuestions(recentFive);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchUserAndQuestions();
}, []);

  // 4. HANDLE LOADING STATE
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // 5. HANDLE ERROR STATE
  if (error || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-semibold text-destructive mb-4">
          An Error Occurred
        </h2>
        <p className="text-muted-foreground">
          {error || "Could not load user data."}
        </p>
        <Button onClick={() => onNavigate("login")} className="mt-6">
          Go to Login
        </Button>
      </div>
    );
  }

  // 6. CHECK IF PROFILE IS COMPLETE AND RENDER CONDITIONALLY
  const isProfileComplete = user.institute;

  if (!isProfileComplete) {
    // Render the "New User" welcome screen if bio or institute is missing
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to ZCODER,{" "}
              <span className="gradient-text">{user.username}!</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              Let's personalize your experience by completing your profile. It
              only takes a minute.
            </p>
            <Button
              className="btn-primary"
              size="lg"
              onClick={() => onNavigate("settings")}
            >
              Complete Your Profile
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER THE FULL DASHBOARD IF PROFILE IS COMPLETE ---

  // Format the join date from the backend's `createdAt` field
  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  // Prepare the props object for the UserProfile component
  const userProfileProps = {
    ...user,
    joinedDate,
    // Note: In a real app, you'd fetch stats from another API endpoint
    stats: {
      questionsUploaded: 0,
      solutionsShared: 0,
      likes: 0,
      followers: 0,
    },
  };

  const handleViewAllQuestions = () => {
    onNavigate("my-questions");
  };

  const handleViewQuestion = (id: string) => {
    console.log("Viewing question:", id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back,{" "}
            <span className="gradient-text">{user.username}!</span>
          </h1>
          <p className="text-muted-foreground">
            Continue your coding journey and share your knowledge with the
            community.
          </p>
        </div>
        <div className="space-y-8">
          {/* 7. PASS THE REAL, FETCHED USER DATA TO THE UserProfile COMPONENT */}
          <UserProfile user={userProfileProps} />
          <RecentActivity
            questions={questions}
            onViewAll={handleViewAllQuestions}
            onViewQuestion={handleViewQuestion}
          />
        </div>
      </div>
    </div>
  );
};
