import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LegalGuides from "@/components/LegalGuides";
import DocumentTemplates from "@/components/DocumentTemplates";
import LawyerDirectory from "@/components/LawyerDirectory";
import ConsultationSection from "@/components/ConsultationSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
