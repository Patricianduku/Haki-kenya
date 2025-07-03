import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-legal-aid.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-hero py-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Legal aid in Kenya" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Justice for Every Kenyan
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            Get affordable legal guidance, connect with pro bono lawyers, and access 
            the legal resources you need to protect your rights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button 
              variant="secondary" 
              size="lg" 
              className="flex-1"
              onClick={() => navigate('/legal-guides')}
            >
              Explore Legal Guides
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => navigate('/lawyers')}
            >
              Find a Lawyer
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card 
              className="bg-white/10 border-white/20 p-6 text-center backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => navigate('/legal-guides')}
            >
              <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="font-semibold mb-2">Step-by-Step Guides</h3>
              <p className="text-sm opacity-80">Clear instructions for common legal issues</p>
            </Card>
            
            <Card 
              className="bg-white/10 border-white/20 p-6 text-center backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => navigate('/lawyers')}
            >
              <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-semibold mb-2">Verified Lawyers</h3>
              <p className="text-sm opacity-80">Connect with qualified pro bono attorneys</p>
            </Card>
            
            <Card 
              className="bg-white/10 border-white/20 p-6 text-center backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => navigate('/templates')}
            >
              <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="font-semibold mb-2">Legal Templates</h3>
              <p className="text-sm opacity-80">Download ready-to-use legal documents</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;