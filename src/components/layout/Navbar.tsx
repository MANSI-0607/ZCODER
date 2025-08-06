import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Settings, 
  Upload, 
  FileText, 
  Compass, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  user: {
    username: string;
    avatar?: string;
  };
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Navbar = ({ user, currentPage, onNavigate, onLogout }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Code },
    { id: "code-live", label: "Code Live", icon: Code },
    { id: "upload", label: "Upload Question", icon: Upload },
    { id: "my-questions", label: "My Questions", icon: FileText },
    { id: "explore", label: "Explore", icon: Compass },
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => handleNavigation("dashboard")}
          >
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">ZCODER</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center gap-2 ${
                    isActive ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground">Competitive Programmer</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigation("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border mt-2 pt-2 pb-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full justify-start gap-2 ${
                      isActive ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};