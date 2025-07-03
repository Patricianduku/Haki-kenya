import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-primary/5 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Haki Kenya</h3>
                <p className="text-sm text-muted-foreground">Legal Aid Platform</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering Kenyans with accessible legal resources and affordable professional guidance.
            </p>
          </div>

          {/* Legal Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal Resources</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Legal Guides
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Document Templates
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                FAQ
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Legal News
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Services</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Find Lawyers
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Consultations
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Pro Bono Directory
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Legal Clinic
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Email: info@hakikenya.co.ke
              </p>
              <p className="text-sm text-muted-foreground">
                Phone: +254 700 123 456
              </p>
              <p className="text-sm text-muted-foreground">
                Nairobi, Kenya
              </p>
            </div>
            <div className="space-y-2">
              <Button variant="trust" size="sm" className="w-full">
                Get Help Now
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 Haki Kenya. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
              Disclaimer
            </a>
          </div>
        </div>

        <div className="mt-6 p-4 bg-warning/10 rounded-lg border border-warning/20">
          <p className="text-sm text-warning-foreground">
            <strong>Legal Disclaimer:</strong> This platform provides legal information, not legal advice. 
            For specific legal matters, always consult with a qualified attorney.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;