import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Play, Square, Clock, CheckCircle2, XCircle, Code2 } from "lucide-react";
import Editor from "@monaco-editor/react";

const LANGUAGES = [
  { value: "cpp", label: "C++", extension: "cpp" },
  { value: "python", label: "Python", extension: "py" },
  { value: "java", label: "Java", extension: "java" },
  { value: "javascript", label: "JavaScript", extension: "js" },
  { value: "c", label: "C", extension: "c" },
];

const DEFAULT_CODE = {
  cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Your code here
    cout << "Hello, World!" << endl;
    return 0;
}`,
  python: `# Your Python code here
def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
        System.out.println("Hello, World!");
        sc.close();
    }
}`,
  javascript: `// Your JavaScript code here
function main() {
    console.log("Hello, World!");
}

main();`,
  c: `#include <stdio.h>

int main() {
    // Your code here
    printf("Hello, World!\\n");
    return 0;
}`,
};

interface CodeLiveProps {
  onNavigate: (page: string) => void;
}

export const CodeLive = ({ onNavigate }: CodeLiveProps) => {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(DEFAULT_CODE.cpp);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const { toast } = useToast();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(DEFAULT_CODE[newLanguage as keyof typeof DEFAULT_CODE]);
    setOutput("");
    setStatus("idle");
    setExecutionTime(null);
  };

const handleRunCode = async () => {
  if (!code.trim()) {
    toast({
      title: "No code to run",
      description: "Please write some code before running.",
      variant: "destructive",
    });
    return;
  }

  setIsRunning(true);
  setStatus("idle");
  setExecutionTime(null);

  try {
    const res = await fetch("http://localhost:8000/api/code/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, code, input })
    });

    const data = await res.json();

    setOutput(data.output);
    setStatus(data.success ? "success" : "error");
    setExecutionTime(data.executionTime);

    toast({
      title: data.success ? "Code executed successfully" : "Execution failed",
      description: data.success
        ? `Completed in ${data.executionTime}ms`
        : "Check the output for error details",
      variant: data.success ? "default" : "destructive",
    });

  } catch (error) {
    setOutput("Unexpected error occurred during execution.");
    setStatus("error");
    toast({
      title: "Execution error",
      description: "Something went wrong while running your code.",
      variant: "destructive",
    });
  } finally {
    setIsRunning(false);
  }
};


  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Code2 className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-success";
      case "error":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Code Live</span>
          </h1>
          <p className="text-muted-foreground">
            Write, run, and test your code in real-time with multiple language support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Code Editor */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  Code Editor
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="btn-primary"
                  >
                    {isRunning ? (
                      <>
                        <Square className="h-4 w-4 mr-1" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Run Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] border border-border rounded-b-lg overflow-hidden">
                <Editor
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  language={language === "cpp" ? "cpp" : language}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: false,
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Input/Output Panel */}
          <div className="space-y-6">
            {/* Input */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Test Input</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter test case input here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[120px] font-mono text-sm input-focus"
                />
              </CardContent>
            </Card>

            {/* Output */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getStatusIcon()}
                    Output
                  </CardTitle>
                  {executionTime && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {executionTime}ms
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className={`min-h-[120px] p-3 bg-muted/30 rounded-lg border font-mono text-sm whitespace-pre-wrap ${getStatusColor()}`}>
                  {output || "Output will appear here after running your code..."}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      setCode(DEFAULT_CODE[language as keyof typeof DEFAULT_CODE]);
                      setOutput("");
                      setInput("");
                      setStatus("idle");
                      setExecutionTime(null);
                    }}
                  >
                    Reset Code
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      setInput("");
                      setOutput("");
                      setStatus("idle");
                      setExecutionTime(null);
                    }}
                  >
                    Clear I/O
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onNavigate("upload")}
                  >
                    Save as Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};