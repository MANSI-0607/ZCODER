import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Eye,
  Heart,
  MessageSquare,
  Clock,
  TrendingUp,
  Code,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export const Explore = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8000/api/questions/public?search=${encodeURIComponent(
            searchTerm
          )}`
        );
        const data = await res.json();
       
        setQuestions(data.data || []);
      } catch (err) {
        console.error("Failed to fetch questions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [searchTerm]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-success/10 text-success border-success/20";
      case "Medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "Hard":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleLike = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q._id === questionId
          ? {
              ...q,
              isLiked: !q.isLiked,
              likes: q.isLiked ? q.likes - 1 : q.likes + 1,
            }
          : q
      )
    );
  };

  const filteredQuestions = [...questions]
    .filter((q) => {
      if (difficultyFilter !== "all" && q.difficulty !== difficultyFilter)
        return false;
      return (
        q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        q.createdBy?.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === "trending")
        return b.likes + b.views / 10 - (a.likes + a.views / 10);
      if (sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
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

              <Select
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
              >
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
        {loading ? (
          <div className="text-center py-10 text-muted-foreground">
            Loading...
          </div>
        ) : filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-muted-foreground">
                No questions match your search criteria. Try adjusting your
                filters.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredQuestions.map((question) => (
              <Card key={question._id} className="card-hover cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Author Avatar */}
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage
                        src={question.createdBy?.avatar}
                        alt={question.createdBy?.username}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {question.createdBy?.username
                          ?.slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Question Content */}
                    <div className="flex-1 min-w-0">
                      {/* Author Info */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">
                          {question.createdBy?.username}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(question.createdAt)}
                        </div>
                      </div>

                      {/* Question Title + Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                          {question.title}
                        </h3>
                        {question.tags?.map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {question.difficulty && (
                          <Badge
                            className={`text-xs ${getDifficultyColor(
                              question.difficulty
                            )}`}
                          >
                            {question.difficulty}
                          </Badge>
                        )}
                      </div>

                      {/* Question Description */}
                      {question.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {question.description}
                        </p>
                      )}

                      {/* Engagement Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {question.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {question.comments?.length || 0}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(question._id);
                            }}
                            className={`gap-1 ${
                              question.isLiked ? "text-primary" : ""
                            }`}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                question.isLiked ? "fill-current" : ""
                              }`}
                            />
                            {question.likes}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => navigate(`/questionpreview/${question._id}`)}
                          >
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
