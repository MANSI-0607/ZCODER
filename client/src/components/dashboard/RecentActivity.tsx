import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Eye, Heart, MessageSquare, ArrowRight } from "lucide-react";

interface Question {
  id: string;
  title: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  views: number;
  likes: number;
  comments: number;
}

interface RecentActivityProps {
  questions: Question[];
  onViewAll: () => void;
  onViewQuestion: (id: string) => void;
}

export const RecentActivity = ({ questions, onViewAll, onViewQuestion }: RecentActivityProps) => {
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

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Questions</CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewAll} className="btn-ghost">
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {questions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground text-sm">
              No questions uploaded yet. Start sharing your coding problems!
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.slice(0, 3).map((question) => (
              <div
                key={question.id}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => onViewQuestion(question.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                    {question.title}
                  </h3>
                  <Badge variant={question.isPublic ? "default" : "secondary"} className="ml-2 shrink-0">
                    {question.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {question.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {question.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{question.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(question.createdAt)}
                  </div>
                  
                  {question.isPublic && (
                    <div className="flex items-center gap-4">
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
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};