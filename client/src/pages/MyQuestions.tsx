import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Eye, 
  Heart, 
  MessageSquare, 
  Edit, 
  Trash2, 
  Plus,
  Globe,
  Lock,
  Clock
} from "lucide-react";

// Mock data
const mockQuestions = [
  {
    id: "1",
    title: "Binary Search Tree Validation",
    tags: ["Binary Tree", "BST", "Recursion"],
    isPublic: true,
    createdAt: "2024-01-15T10:30:00Z",
    views: 45,
    likes: 12,
    comments: 5,
    difficulty: "Medium"
  },
  {
    id: "2",
    title: "Dynamic Programming - Longest Common Subsequence",
    tags: ["Dynamic Programming", "Strings", "LCS"],
    isPublic: true,
    createdAt: "2024-01-14T14:20:00Z",
    views: 67,
    likes: 23,
    comments: 8,
    difficulty: "Hard"
  },
  {
    id: "3",
    title: "Graph Traversal - DFS Implementation",
    tags: ["Graph", "DFS", "Traversal"],
    isPublic: false,
    createdAt: "2024-01-13T09:15:00Z",
    views: 12,
    likes: 3,
    comments: 1,
    difficulty: "Easy"
  },
  {
    id: "4",
    title: "Two Pointer Technique - Container With Most Water",
    tags: ["Two Pointers", "Array", "Greedy"],
    isPublic: true,
    createdAt: "2024-01-12T16:45:00Z",
    views: 89,
    likes: 34,
    comments: 12,
    difficulty: "Medium"
  }
];

interface MyQuestionsProps {
  onNavigate: (page: string) => void;
}

export const MyQuestions = ({ onNavigate }: MyQuestionsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success/10 text-success border-success/20";
      case "Medium": return "bg-warning/10 text-warning border-warning/20";
      case "Hard": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredQuestions = mockQuestions
    .filter(q => {
      if (filterType === "public") return q.isPublic;
      if (filterType === "private") return !q.isPublic;
      return true;
    })
    .filter(q => 
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "popular") return b.likes - a.likes;
      return 0;
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text">My Questions</span>
            </h1>
            <p className="text-muted-foreground">
              Manage and track your uploaded coding problems
            </p>
          </div>
          <Button 
            onClick={() => onNavigate("upload")}
            className="btn-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Upload Question
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-focus"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Questions</SelectItem>
                  <SelectItem value="public">Public Only</SelectItem>
                  <SelectItem value="private">Private Only</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Questions Grid */}
        {filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-muted-foreground">
                {searchTerm || filterType !== "all" 
                  ? "No questions match your filters. Try adjusting your search."
                  : "You haven't uploaded any questions yet. Start sharing your coding problems!"
                }
              </div>
              {!searchTerm && filterType === "all" && (
                <Button 
                  onClick={() => onNavigate("upload")}
                  className="mt-4 btn-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Your First Question
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestions.map((question) => (
              <Card key={question.id} className="card-hover group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {question.title}
                    </CardTitle>
                    <div className="flex items-center gap-1 ml-2">
                      {question.isPublic ? (
                        <Globe className="h-4 w-4 text-success" />
                      ) : (
                        <Lock className="h-4 w-4 text-warning" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {question.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {question.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{question.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </Badge>
                    <Badge variant={question.isPublic ? "default" : "secondary"} className="text-xs">
                      {question.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(question.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {question.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {question.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {question.comments}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};