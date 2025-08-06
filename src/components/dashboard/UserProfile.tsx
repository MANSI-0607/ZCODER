import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  Linkedin, 
  ExternalLink, 
  MapPin, 
  Calendar,
  Trophy,
  Target,
  Code2
} from "lucide-react";

interface UserProfileProps {
  user: {
    username: string;
    email: string;
    avatar?: string;
    institute?: string;
    bio?: string;
    location?: string;
    joinedDate?: string;
    skills?: string[];
    platforms?: {
      codeforces?: string;
      leetcode?: string;
      codechef?: string;
      geeksforgeeks?: string;
      github?: string;
      linkedin?: string;
    };
    stats?: {
      questionsUploaded: number;
      solutionsShared: number;
      likes: number;
      followers: number;
    };
  };
}

export const UserProfile = ({ user }: UserProfileProps) => {
  const platformIcons = {
    codeforces: Code2,
    leetcode: Target,
    codechef: Trophy,
    geeksforgeeks: Code2,
    github: Github,
    linkedin: Linkedin,
  };

  const platformColors = {
    codeforces: "bg-blue-500",
    leetcode: "bg-orange-500", 
    codechef: "bg-amber-500",
    geeksforgeeks: "bg-green-500",
    github: "bg-gray-800",
    linkedin: "bg-blue-600",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Profile Card */}
      <Card className="lg:col-span-2 card-hover">
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="bg-gradient-primary text-white text-xl">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
              {user.institute && (
                <p className="text-sm text-primary font-medium mt-1">{user.institute}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {user.location}
                  </div>
                )}
                {user.joinedDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Joined {user.joinedDate}
                  </div>
                )}
              </div>
            </div>
          </div>
          {user.bio && (
            <p className="text-muted-foreground mt-4">{user.bio}</p>
          )}
        </CardHeader>
        <CardContent>
          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="tag">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Coding Platforms */}
          {user.platforms && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Coding Platforms</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(user.platforms).map(([platform, username]) => {
                  if (!username) return null;
                  const Icon = platformIcons[platform as keyof typeof platformIcons] || ExternalLink;
                  const colorClass = platformColors[platform as keyof typeof platformColors];
                  
                  return (
                    <Button
                      key={platform}
                      variant="outline"
                      size="sm"
                      className="justify-start gap-2 h-auto p-3"
                      asChild
                    >
                      <a href={`#${platform}-${username}`} target="_blank" rel="noopener noreferrer">
                        <div className={`p-1 rounded-md ${colorClass}`}>
                          <Icon className="h-3 w-3 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-medium capitalize">{platform}</p>
                          <p className="text-xs text-muted-foreground truncate">@{username}</p>
                        </div>
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg">Community Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Questions</span>
              <span className="font-semibold">{user.stats?.questionsUploaded || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Solutions</span>
              <span className="font-semibold">{user.stats?.solutionsShared || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Likes</span>
              <span className="font-semibold text-success">{user.stats?.likes || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Followers</span>
              <span className="font-semibold text-primary">{user.stats?.followers || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};