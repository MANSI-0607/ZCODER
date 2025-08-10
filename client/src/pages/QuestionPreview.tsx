import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Editor from "@monaco-editor/react";
import { ArrowLeft, Save, Eye, Heart, MessageCircle, Code2, FileText, Tag, Globe, Lock } from "lucide-react";

interface Question {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  lang: string;
  solution: string;
  notes: string;
  isPublic: boolean;
  createdBy: string;
  likes: string[];
  views: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "kotlin", label: "Kotlin" },
  { value: "swift", label: "Swift" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
];

export default function QuestionPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [question, setQuestion] = useState<Question | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:8000/api/questions/${id}`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch question");
        const data = await res.json();
        const questionData = data.data || data;
        setQuestion(questionData);
        setEditedQuestion(questionData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load question.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchQuestion();
    }
  }, [id, toast]);

  const handleChange = (field: keyof Question, value: any) => {
    if (!editedQuestion) return;
    setEditedQuestion({ ...editedQuestion, [field]: value });
  };

  const hasChanges = JSON.stringify(question) !== JSON.stringify(editedQuestion);

  const handleSave = async () => {
    if (!editedQuestion) return;
    setIsSaving(true);
    try {
      const res = await fetch(`http://localhost:8000/api/questions/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editedQuestion),
      });
      if (!res.ok) throw new Error("Failed to save changes");
      const updated = await res.json();
      const updatedData = updated.data || updated;
      setQuestion(updatedData);
      setEditedQuestion(updatedData);

      toast({
        title: "Success",
        description: "Question updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save changes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Code2 className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading question...</p>
        </div>
      </div>
    );
  }

  if (!editedQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <p className="text-muted-foreground">Question not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                {editedQuestion.views} views
                <Heart className="h-4 w-4 ml-2" />
                {editedQuestion.likes?.length || 0} likes
                <MessageCircle className="h-4 w-4 ml-2" />
                {editedQuestion.commentsCount} comments
              </div>
            </div>
            {hasChanges && (
              <Button onClick={handleSave} disabled={isSaving} size="sm">
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Side - Code Editor */}
        <div className="flex-1 border-r">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-6 py-3 border-b bg-card">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                <span className="font-medium">Solution</span>
              </div>
              <Select 
                value={editedQuestion.lang} 
                onValueChange={(value) => handleChange("lang", value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                language={editedQuestion.lang}
                value={editedQuestion.solution}
                onChange={(value) => handleChange("solution", value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  tabSize: 2,
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side - Question Details */}
        <div className="w-96 bg-card">
          <div className="h-full overflow-y-auto p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                Title
              </Label>
              <Input
                value={editedQuestion.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Question title"
                className="font-medium"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={editedQuestion.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the problem or challenge..."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Tag className="h-4 w-4" />
                Tags
              </Label>
              <Input
                value={editedQuestion.tags.join(", ")}
                onChange={(e) =>
                  handleChange("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))
                }
                placeholder="algorithm, arrays, sorting..."
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {editedQuestion.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Additional Notes</Label>
              <Textarea
                value={editedQuestion.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Explanation, approach, time/space complexity..."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Privacy */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Visibility</Label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {editedQuestion.isPublic ? (
                    <Globe className="h-4 w-4 text-green-600" />
                  ) : (
                    <Lock className="h-4 w-4 text-orange-600" />
                  )}
                  <span className="text-sm">
                    {editedQuestion.isPublic ? "Public" : "Private"}
                  </span>
                </div>
                <Switch
                  checked={editedQuestion.isPublic}
                  onCheckedChange={(checked) => handleChange("isPublic", checked)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {editedQuestion.isPublic 
                  ? "Anyone can view this question" 
                  : "Only you can view this question"
                }
              </p>
            </div>

            {/* Metadata */}
            {question && (
              <div className="pt-4 border-t space-y-2">
                <div className="text-xs text-muted-foreground">
                  <p>Created: {new Date(question.createdAt).toLocaleDateString()}</p>
                  {question.updatedAt !== question.createdAt && (
                    <p>Updated: {new Date(question.updatedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}