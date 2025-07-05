import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Menu, 
  Home, 
  Users, 
  BookOpen, 
  FileText, 
  Calendar, 
  User, 
  Settings,
  Search,
  Bell,
  Globe,
  LogOut,
  ChevronRight
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "@/components/i18n/translations";
import { useAuth } from "@/hooks/useAuth";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

interface MobileNavProps {
  className?: string;
}

export const MobileNav = ({ className = "" }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const navigationItems = [
    { 
      icon: Home, 
      label: 'Home', 
      path: '/', 
      active: location.pathname === '/' 
    },
    { 
      icon: Users, 
      label: 'Lawyers', 
      path: '/lawyers', 
      active: location.pathname === '/lawyers' 
    },
    { 
      icon: BookOpen, 
      label: 'Guides', 
      path: '/legal-guides', 
      active: location.pathname === '/legal-guides' 
    },
    { 
      icon: FileText, 
      label: 'Templates', 
      path: '/templates', 
      active: location.pathname === '/templates' 
    },
    { 
      icon: Calendar, 
      label: 'Consultations', 
      path: '/consultations', 
      active: location.pathname === '/consultations' 
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="text-left">
              Menu
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {/* User Section */}
            {user ? (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {user.name?.[0] || user.email?.[0] || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.role || 'User'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleNavigation('/auth')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button 
                  variant="default" 
                  className="w-full justify-start"
                  onClick={() => handleNavigation('/auth?mode=signup')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </div>
            )}

            <Separator />

            {/* Navigation Items */}
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                    item.active 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </nav>

            <Separator />

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  // Quick search functionality
                  setIsOpen(false);
                  navigate('/lawyers');
                }}
              >
                <Search className="w-4 h-4 mr-2" />
                Quick Search
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  // Notifications
                  setIsOpen(false);
                  // Add notification center logic
                }}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                <Badge variant="secondary" className="ml-auto text-xs">
                  3
                </Badge>
              </Button>
            </div>

            <Separator />

            {/* Settings & Language */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <Globe className="w-4 h-4" />
                <span className="flex-1">Language</span>
                <LanguageSwitcher />
              </div>
              
              {user && (
                <>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/dashboard')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="flex justify-around py-2">
          {navigationItems.slice(0, 4).map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                item.active 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
          
          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs">More</span>
          </button>
        </div>
      </div>
    </>
  );
}; 