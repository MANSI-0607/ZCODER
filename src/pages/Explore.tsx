import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Eye, 
  Heart, 
  MessageSquare, 
  Clock,
  TrendingUp,
  Code,
  ThumbsUp
} from "lucide-react";

// Mock data
const mockQuestions = [
  {
    id: "1",
    title: "Binary Search Tree Validation",
    tags: ["Binary Tree", "BST", "Recursion"],
    author: {
      username: "codeMaster",
      avatar: "/lovable-uploads/d4807de6-0bc6-4782-b5f3-24161edbbefd.png",
      institute: "MIT"
    },
    createdAt: "2024-01-15T10:30:00Z",
    views: 145,
    likes: 32,
    comments: 15,
    difficulty: "Medium",
    isLiked: false
  },
  {
    id: "2",
    title: "Dynamic Programming - Longest Common Subsequence",
    tags: ["Dynamic Programming", "Strings", "LCS"],
    author: {
      username: "algoPro",
      avatar: "",
      institute: "Stanford"
    },
    createdAt: "2024-01-14T14:20:00Z",
    views: 267,
    likes: 78,
    comments: 23,
    difficulty: "Hard",
    isLiked: true
  },
  {
    id: "3",
    title: "Two Pointer Technique - Container With Most Water",
    tags: ["Two Pointers", "Array", "Greedy"],
    author: {
      username: "dataStruct",
      avatar: "",
      institute: "CMU"
    },
    createdAt: "2024-01-13T09:15:00Z",
    views: 189,
    likes: 45,
    comments: 18,
    difficulty: "Medium",
    isLiked: false
  },
  {
    id: "4",
    title: "Sliding Window Maximum",
    tags: ["Sliding Window", "Deque", "Array"],
    author: {
      username: "windowMaster",
      avatar: "",
      institute: "Berkeley"
    },
    createdAt: "2024-01-12T16:45:00Z",
    views: 123,
    likes: 29,
    comments: 8,
    difficulty: "Hard",
    isLiked: false
  },
  {
    id: "5",
    title: "Graph Shortest Path - Dijkstra Implementation",
    tags: ["Graph", "Dijkstra", "Shortest Path"],
    author: {
      username: "graphGuru",
      avatar: "",
      institute: "Caltech"
    },
    createdAt: "2024-01-11T11:20:00Z",
    views: 156,
    likes: 41,
    comments: 12,
    difficulty: "Hard",
    isLiked: true
  }
];

interface ExploreProps {
  onNavigate: (page: string) => void;
}

export const Explore = ({ onNavigate }: ExploreProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [questions, setQuestions] = useState(mockQuestions);

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

  const handleLike = (questionId: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, isLiked: !q.isLiked, likes: q.isLiked ? q.likes - 1 : q.likes + 1 }
        : q
    ));
  };

  const filteredQuestions = questions
    .filter(q => {
      if (difficultyFilter !== "all" && q.difficulty !== difficultyFilter) return false;
      return q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
             q.author.username.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "trending") return (b.likes + b.views/10) - (a.likes + a.views/10);
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "popular") return b.likes - a.likes;
      if (sortBy === "views") return b.views - a.views;
      return 0;
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Explore Questions</span>
          </h1>
          <p className="text-muted-foreground">
            Discover coding problems and solutions from the community
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions, tags, or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-focus"
                />
              </div>
              
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">
                    <div className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Trending
                    </div>
                  </SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Liked</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
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
                No questions match your search criteria. Try adjusting your filters.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredQuestions.map((question) => (
              <Card key={question.id} className="card-hover cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Author Avatar */}
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={question.author.avatar} alt={question.author.username} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {question.author.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Question Content */}
                    <div className="flex-1 min-w-0">
                      {/* Author Info */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">{question.author.username}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{question.author.institute}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(question.createdAt)}
                        </div>
                      </div>

                      {/* Question Title */}
                      <h3 className="text-lg font-semibold mb-3 hover:text-primary transition-colors">
                        {question.title}
                      </h3>

                      {/* Tags and Difficulty */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {question.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        <Badge className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </Badge>
                      </div>

                      {/* Engagement Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {question.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {question.comments}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(question.id);
                            }}
                            className={`gap-1 ${question.isLiked ? 'text-primary' : ''}`}
                          >
                            <Heart className={`h-4 w-4 ${question.isLiked ? 'fill-current' : ''}`} />
                            {question.likes}
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Code className="h-4 w-4" />
                            View Solution
                          </Button>
                        </div>
                      </div>
                    </div>
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