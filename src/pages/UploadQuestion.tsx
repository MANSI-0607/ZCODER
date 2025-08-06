import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Plus } from "lucide-react";

const uploadSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  solution: z.string().min(10, "Solution must be at least 10 characters"),
  notes: z.string().optional(),
  isPublic: z.boolean().default(true),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface UploadQuestionProps {
  onNavigate: (page: string) => void;
}

export const UploadQuestion = ({ onNavigate }: UploadQuestionProps) => {
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      tags: [],
      solution: "",
      notes: "",
      isPublic: true,
    },
  });

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      form.setValue("tags", updatedTags);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    form.setValue("tags", updatedTags);
  };

  const onSubmit = async (data: UploadFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Question uploaded!",
        description: "Your question has been shared with the community.",
      });
      
      // Reset form
      form.reset();
      setTags([]);
      
      // Navigate to my questions
      onNavigate("my-questions");
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Upload Question</span>
          </h1>
          <p className="text-muted-foreground">
            Share your coding problem and solution with the community.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Question Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Binary Search Tree Validation" 
                          className="input-focus"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Give your question a clear, descriptive title
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={() => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add tags (e.g., Binary Tree, DFS)"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                              className="input-focus"
                            />
                            <Button 
                              type="button" 
                              onClick={addTag}
                              disabled={!newTag.trim()}
                              size="sm"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="tag">
                                  {tag}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="ml-1 h-auto p-0 hover:bg-transparent"
                                    onClick={() => removeTag(tag)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Add relevant tags to help others find your question
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Solution */}
                <FormField
                  control={form.control}
                  name="solution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solution Code</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Paste your solution code here..."
                          className="min-h-[300px] font-mono text-sm input-focus"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Share your complete solution with proper formatting
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any explanations, time/space complexity, or approach details..."
                          className="min-h-[100px] input-focus"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Provide context, explanations, or approach details
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Public/Private Toggle */}
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Make Public</FormLabel>
                        <FormDescription>
                          Allow other users to view and interact with this question
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex gap-3 pt-6">
                  <Button 
                    type="submit" 
                    className="btn-primary"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Uploading..." : "Upload Question"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => onNavigate("dashboard")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};