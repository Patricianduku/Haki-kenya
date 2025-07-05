import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/components/i18n/translations";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-legal-aid.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button 
              variant="secondary" 
              size="lg" 
              className="flex-1"
              onClick={() => scrollToSection('guides')}
            >
              {t('hero.exploreGuides')}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => scrollToSection('lawyers')}
            >
              {t('hero.findLawyer')}
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="bg-white/10 border-white/20 p-6 text-center backdrop-blur-sm">
              <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="font-semibold mb-2">{t('features.guides.title')}</h3>
              <p className="text-sm opacity-80">{t('features.guides.description')}</p>
            </Card>
            
            <Card className="bg-white/10 border-white/20 p-6 text-center backdrop-blur-sm">
              <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-semibold mb-2">{t('features.lawyers.title')}</h3>
              <p className="text-sm opacity-80">{t('features.lawyers.description')}</p>
            </Card>
            
            <Card className="bg-white/10 border-white/20 p-6 text-center backdrop-blur-sm">
              <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="font-semibold mb-2">{t('features.templates.title')}</h3>
              <p className="text-sm opacity-80">{t('features.templates.description')}</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;