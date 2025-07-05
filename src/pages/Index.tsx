import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LegalGuides from "@/components/LegalGuides";
import DocumentTemplates from "@/components/DocumentTemplates";
import LawyerDirectory from "@/components/LawyerDirectory";
import ConsultationSection from "@/components/ConsultationSection";
import Footer from "@/components/Footer";

const Index = () => {
  console.log('Index page is rendering...')
  
  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Haki Kenya Legal Aid Platform</h1>
        <p className="text-lg text-muted-foreground">Testing basic rendering...</p>
      </div>
      <Header />
      <Hero />
      <LegalGuides />
      <DocumentTemplates />
      <LawyerDirectory />
      <ConsultationSection />
      <Footer />
    </div>
  );
};

export default Index;
