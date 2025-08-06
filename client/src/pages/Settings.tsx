import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, User, Link as LinkIcon, Save, X, Plus } from "lucide-react";

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  institute: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().optional(),
  skills: z.array(z.string()).optional(),
  platforms: z.object({
    codeforces: z.string().optional(),
    leetcode: z.string().optional(),
    codechef: z.string().optional(),
    geeksforgeeks: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface SettingsProps {
  onNavigate: (page: string) => void;
}

export const Settings = ({ onNavigate }: SettingsProps) => {
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState([
    "Dynamic Programming",
    "Graph Algorithms", 
    "Data Structures",
    "Binary Search",
    "C++",
    "Python"
  ]);
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "codeMaster",
      email: "codemaster@example.com",
      institute: "MIT Computer Science",
      bio: "Passionate competitive programmer with 3+ years of experience. Love solving algorithmic challenges and sharing knowledge with the community.",
      location: "Boston, MA",
      skills: skills,
      platforms: {
        codeforces: "codeMaster2024",
        leetcode: "codeMaster_dev",
        codechef: "codemaster99",
        geeksforgeeks: "codeMaster",
        github: "codeMaster2024",
        linkedin: "code-master"
      },
    },
  });

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      form.setValue("skills", updatedSkills);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);
    form.setValue("skills", updatedSkills);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-muted-foreground">
            Manage your profile and account preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Picture Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/lovable-uploads/d4807de6-0bc6-4782-b5f3-24161edbbefd.png" alt="Profile" />
                  <AvatarFallback className="bg-gradient-primary text-white text-xl">
                    CM
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Upload a new profile picture or update your existing one
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Upload New
                    </Button>
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input className="input-focus" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" className="input-focus" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="institute"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institute/Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., MIT Computer Science" className="input-focus" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Boston, MA" className="input-focus" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about yourself..."
                            className="min-h-[100px] input-focus"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description about yourself and your coding journey
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Skills Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Skills & Technologies</h3>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a skill (e.g., Dynamic Programming)"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                          className="input-focus"
                        />
                        <Button 
                          type="button" 
                          onClick={addSkill}
                          disabled={!newSkill.trim()}
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="tag">
                              {skill}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="ml-1 h-auto p-0 hover:bg-transparent"
                                onClick={() => removeSkill(skill)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Coding Platforms */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <LinkIcon className="h-5 w-5" />
                      Coding Platforms
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="platforms.codeforces"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Codeforces</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Codeforces username" className="input-focus" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="platforms.leetcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LeetCode</FormLabel>
                            <FormControl>
                              <Input placeholder="Your LeetCode username" className="input-focus" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="platforms.codechef"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CodeChef</FormLabel>
                            <FormControl>
                              <Input placeholder="Your CodeChef username" className="input-focus" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="platforms.geeksforgeeks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GeeksforGeeks</FormLabel>
                            <FormControl>
                              <Input placeholder="Your GeeksforGeeks username" className="input-focus" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="platforms.github"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GitHub</FormLabel>
                            <FormControl>
                              <Input placeholder="Your GitHub username" className="input-focus" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="platforms.linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn</FormLabel>
                            <FormControl>
                              <Input placeholder="Your LinkedIn username" className="input-focus" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-6">
                    <Button 
                      type="submit" 
                      className="btn-primary"
                      disabled={form.formState.isSubmitting}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
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
    </div>
  );
};