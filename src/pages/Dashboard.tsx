import { UserProfile } from "@/components/dashboard/UserProfile";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

// Mock data - in a real app, this would come from an API
const mockUser = {
  username: "codeMaster",
  email: "codemaster@example.com",
  avatar: "/lovable-uploads/d4807de6-0bc6-4782-b5f3-24161edbbefd.png",
  institute: "MIT Computer Science",
  bio: "Passionate competitive programmer with 3+ years of experience. Love solving algorithmic challenges and sharing knowledge with the community.",
  location: "Boston, MA",
  joinedDate: "March 2023",
  skills: [
    "Dynamic Programming",
    "Graph Algorithms", 
    "Data Structures",
    "Binary Search",
    "Greedy Algorithms",
    "C++",
    "Python",
    "JavaScript"
  ],
  platforms: {
    codeforces: "codeMaster2024",
    leetcode: "codeMaster_dev",
    codechef: "codemaster99",
    geeksforgeeks: "codeMaster",
    github: "codeMaster2024",
    linkedin: "code-master"
  },
  stats: {
    questionsUploaded: 42,
    solutionsShared: 78,
    likes: 234,
    followers: 89
  }
};

const mockQuestions = [
  {
    id: "1",
    title: "Binary Search Tree Validation",
    tags: ["Binary Tree", "BST", "Recursion"],
    isPublic: true,
    createdAt: "2024-01-15T10:30:00Z",
    views: 45,
    likes: 12,
    comments: 5
  },
  {
    id: "2", 
    title: "Dynamic Programming - Longest Common Subsequence",
    tags: ["Dynamic Programming", "Strings", "LCS"],
    isPublic: true,
    createdAt: "2024-01-14T14:20:00Z",
    views: 67,
    likes: 23,
    comments: 8
  },
  {
    id: "3",
    title: "Graph Traversal - DFS Implementation",
    tags: ["Graph", "DFS", "Traversal"],
    isPublic: false,
    createdAt: "2024-01-13T09:15:00Z",
    views: 12,
    likes: 3,
    comments: 1
  }
];

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const handleViewAllQuestions = () => {
    onNavigate("my-questions");
  };

  const handleViewQuestion = (id: string) => {
    // In a real app, this would navigate to the question detail page
    console.log("Viewing question:", id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{mockUser.username}!</span>
          </h1>
          <p className="text-muted-foreground">
            Continue your coding journey and share your knowledge with the community.
          </p>
        </div>

        <div className="space-y-8">
          {/* User Profile Section */}
          <UserProfile user={mockUser} />

          {/* Recent Activity Section */}
          <RecentActivity 
            questions={mockQuestions}
            onViewAll={handleViewAllQuestions}
            onViewQuestion={handleViewQuestion}
          />
        </div>
      </div>
    </div>
  );
};