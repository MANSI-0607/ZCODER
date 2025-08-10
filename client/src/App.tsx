import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { MyQuestions } from "./pages/MyQuestions";
import QuestionPreview from "./pages/QuestionPreview";
import { Dashboard } from "./pages/Dashboard";
import { UploadQuestion } from "./pages/UploadQuestion";
import { Explore } from "./pages/Explore";
import { CodeLive } from "./pages/CodeLive";
import { Settings } from "./pages/Settings";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import{ProtectedLayout} from "@/components/layout/ProtectedLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />

          {/* Protected Pages */}
          <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadQuestion />} />
          <Route path="/my-questions" element={<MyQuestions />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/code-live" element={<CodeLive />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/questionpreview/:id" element={<QuestionPreview />} />
          </Route>
         
          {/* Other */}
        
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
