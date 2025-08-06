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

          {/* Quick Links */}
          {user.platforms && (user.platforms.github || user.platforms.linkedin) && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Quick Links</h3>
              <div className="flex gap-3">
                {user.platforms.github && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start gap-2 h-auto p-3"
                    asChild
                  >
                    <a href={`https://github.com/${user.platforms.github}`} target="_blank" rel="noopener noreferrer">
                      <div className="p-1 rounded-md bg-gray-800">
                        <Github className="h-3 w-3 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-medium">GitHub</p>
                        <p className="text-xs text-muted-foreground truncate">@{user.platforms.github}</p>
                      </div>
                    </a>
                  </Button>
                )}
                {user.platforms.linkedin && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start gap-2 h-auto p-3"
                    asChild
                  >
                    <a href={`https://linkedin.com/in/${user.platforms.linkedin}`} target="_blank" rel="noopener noreferrer">
                      <div className="p-1 rounded-md bg-blue-600">
                        <Linkedin className="h-3 w-3 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-medium">LinkedIn</p>
                        <p className="text-xs text-muted-foreground truncate">@{user.platforms.linkedin}</p>
                      </div>
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Coding Platforms */}
          {user.platforms && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Coding Platforms</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(user.platforms)
                  .filter(([platform]) => platform !== 'github' && platform !== 'linkedin')
                  .map(([platform, username]) => {
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
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-primary">{user.stats?.questionsUploaded || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Questions</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg border border-secondary/20">
                <div className="text-2xl font-bold text-secondary">{user.stats?.solutionsShared || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Solutions</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-lg border border-success/20">
                <div className="text-2xl font-bold text-success">{user.stats?.likes || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Likes</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border border-accent/20">
                <div className="text-2xl font-bold text-accent">{user.stats?.followers || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Followers</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};