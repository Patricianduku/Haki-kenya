import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FileText, Users, Search } from "lucide-react";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Haki Kenya</h1>
              <p className="text-sm text-muted-foreground">Legal Aid Platform</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('guides')} 
              className="text-foreground hover:text-primary transition-smooth"
            >
              Legal Guides
            </button>
            <button 
              onClick={() => scrollToSection('templates')} 
              className="text-foreground hover:text-primary transition-smooth"
            >
              Documents
            </button>
            <button 
              onClick={() => scrollToSection('lawyers')} 
              className="text-foreground hover:text-primary transition-smooth"
            >
              Find Lawyers
            </button>
            <button 
              onClick={() => scrollToSection('consultation')} 
              className="text-foreground hover:text-primary transition-smooth"
            >
              Consultation
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            {user && <NotificationCenter />}
            <Button variant="ghost" size="sm" onClick={() => navigate(user ? '/dashboard' : '/auth')}>
              {user ? 'Dashboard' : 'Login'}
            </Button>
            <Button variant="hero" size="sm" onClick={() => navigate('/dashboard')}>
              Get Help Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;