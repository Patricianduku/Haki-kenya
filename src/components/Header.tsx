import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "@/components/i18n/translations";
import { useAuth } from "@/hooks/useAuth";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { MobileNav } from "@/components/ui/mobile-nav";
import { AccessibilityPanel } from "@/components/ui/accessibility";
import { AISearch } from "@/components/ui/ai-search";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, User, Search, Menu } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { showInfo } = useNotifications();

  const handleSearch = (query: string) => {
    // Navigate to lawyers page with search query
    navigate(`/lawyers?search=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    logout();
    showInfo("Logged Out", "You have been successfully logged out.");
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center cursor-pointer"
              onClick={() => navigate('/')}
            >
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:block">
              Haki Kenya
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Button
              variant={location.pathname === '/lawyers' ? 'default' : 'ghost'}
              onClick={() => navigate('/lawyers')}
              className="text-sm"
            >
              Lawyers
            </Button>
            <Button
              variant={location.pathname === '/legal-guides' ? 'default' : 'ghost'}
              onClick={() => navigate('/legal-guides')}
              className="text-sm"
            >
              Guides
            </Button>
            <Button
              variant={location.pathname === '/templates' ? 'default' : 'ghost'}
              onClick={() => navigate('/templates')}
              className="text-sm"
            >
              Templates
            </Button>
            <Button
              variant={location.pathname === '/consultations' ? 'default' : 'ghost'}
              onClick={() => navigate('/consultations')}
              className="text-sm"
            >
              Consultations
            </Button>
          </nav>

          {/* Desktop Search */}
          <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-6">
            <AISearch onSearch={handleSearch} />
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                  <User className="w-4 h-4 mr-2" />
                  {user.name || user.email}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                  Login
                </Button>
                <Button size="sm" onClick={() => navigate('/auth?mode=signup')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <MobileNav />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden py-4 border-t">
          <AISearch onSearch={handleSearch} />
        </div>
      </div>

      {/* Accessibility Panel */}
      <AccessibilityPanel />
    </header>
  );
};

export default Header;