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
import { ArrowLeft, Save, Eye, Heart, MessageCircle, Code2, FileText, Tag, Globe, Lock } from 'lucide-react';

interface Question {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  lang: string;
  solution: string;
  notes: string;
  isPublic: boolean;
  createdBy: string | { _id: string; username?: string; avatar?: string };
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

export default function QuestionPreviewRedesigned() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [question, setQuestion] = useState<Question | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE_URL}/questions/${id}`, {
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
      const res = await fetch(`${API_BASE_URL}/questions/${id}`, {
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

  // Check if current user is the owner
  const isOwner = (() => {
    let currentUserId: string | undefined;
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const u = JSON.parse(userStr);
        currentUserId = u?._id || u?.id;
      }
    } catch { }

    const createdBy: any = editedQuestion?.createdBy as any;
    const createdById: string | undefined = typeof createdBy === "string" ? createdBy : (createdBy?._id || createdBy?.id);

    return !!currentUserId && !!createdById && currentUserId === createdById;
  })();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Code2 className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" />
          <p className="text-slate-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (!editedQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-slate-600">Question not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-slate-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <p className="text-sm text-slate-600">
              Uploaded by: <span className="font-semibold">{typeof question?.createdBy === 'object' ? question.createdBy.username : 'Unknown'}</span>
            </p>

            {hasChanges && isOwner && (
              <Button onClick={handleSave} disabled={isSaving} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          {/* Left Side - Question Details (40%) */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Question Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Title</Label>
                  <Input
                    value={editedQuestion.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Question title"
                    className="font-medium border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                    disabled={!isOwner}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Description</Label>
                  <Textarea
                    value={editedQuestion.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Describe the problem or challenge..."
                    rows={6}
                    className="resize-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                    disabled={!isOwner}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Tag className="h-4 w-4" />
                    Tags
                  </Label>
                  <Input
                    value={editedQuestion.tags.join(", ")}
                    onChange={(e) =>
                      handleChange("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))
                    }
                    placeholder="algorithm, arrays, sorting..."
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                    disabled={!isOwner}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editedQuestion.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className="bg-slate-200" />

                {/* Notes */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Additional Notes</Label>
                  <Textarea
                    value={editedQuestion.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Explanation, approach, time/space complexity..."
                    rows={4}
                    className="resize-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                    disabled={!isOwner}
                  />
                </div>

                {/* Privacy */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Visibility</Label>
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      {editedQuestion.isPublic ? (
                        <Globe className="h-4 w-4 text-green-600" />
                      ) : (
                        <Lock className="h-4 w-4 text-orange-600" />
                      )}
                      <span className="text-sm font-medium">
                        {editedQuestion.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                    <Switch
                      checked={editedQuestion.isPublic}
                      onCheckedChange={(checked) => handleChange("isPublic", checked)}
                      disabled={!isOwner}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    {editedQuestion.isPublic
                      ? "Anyone can view this question"
                      : "Only you can view this question"
                    }
                  </p>
                </div>

                {/* Metadata */}
                {question && (
                  <div className="pt-4 border-t border-slate-200 space-y-1">
                    <div className="text-xs text-slate-500">
                      <p>Created: {new Date(question.createdAt).toLocaleDateString()}</p>
                      {question.updatedAt !== question.createdAt && (
                        <p>Updated: {new Date(question.updatedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Code Editor (60%) */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Code2 className="h-5 w-5 text-blue-600" />
                    Solution
                  </CardTitle>
                  <Select
                    value={editedQuestion.lang}
                    onValueChange={(value) => handleChange("lang", value)}
                    disabled={!isOwner}
                  >
                    <SelectTrigger className="w-32 border-slate-200">
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
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[785px] rounded-b-lg overflow-hidden">
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
                      readOnly: !isOwner,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="py-4">
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2 text-slate-600">
                <Eye className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{editedQuestion.views}</span>
                <span className="text-sm">views</span>
              </div>
              <Separator orientation="vertical" className="h-6 bg-slate-300" />
              <div className="flex items-center gap-2 text-slate-600">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="font-medium">{editedQuestion.likes?.length || 0}</span>
                <span className="text-sm">likes</span>
              </div>
              <Separator orientation="vertical" className="h-6 bg-slate-300" />
              <div className="flex items-center gap-2 text-slate-600">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">{editedQuestion.commentsCount}</span>
                <span className="text-sm">comments</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
