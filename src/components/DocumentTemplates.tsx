import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download } from "lucide-react";
import legalDocsIcon from "@/assets/legal-docs-icon.png";

const DocumentTemplates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDownload = (templateTitle: string) => {
    toast({
      title: "Download started",
      description: `Downloading ${templateTitle}`,
    });
  };
  
  const templates = [
    {
      title: "Demand Letter Template",
      description: "Professional demand letter for unpaid debts or services",
      category: "Debt Recovery",
      format: "PDF",
      pages: 2,
      downloads: 1247,
      popular: true
    },
    {
      title: "Affidavit Template",
      description: "Standard affidavit format for court proceedings",
      category: "Court Documents", 
      format: "DOCX",
      pages: 1,
      downloads: 892,
      popular: true
    },
    {
      title: "Employment Contract",
      description: "Basic employment agreement template for small businesses",
      category: "Employment",
      format: "DOCX", 
      pages: 4,
      downloads: 634,
      popular: false
    },
    {
      title: "Tenancy Agreement",
      description: "Residential rental agreement compliant with Kenyan law",
      category: "Property",
      format: "PDF",
      pages: 6,
      downloads: 1156,
      popular: true
    },
    {
      title: "Power of Attorney",
      description: "General power of attorney document template",
      category: "Legal Authorization",
      format: "PDF",
      pages: 3,
      downloads: 445,
      popular: false
    },
    {
      title: "Notice to Quit",
      description: "Formal notice for tenant eviction proceedings",
      category: "Property",
      format: "DOCX",
      pages: 1,
      downloads: 378,
      popular: false
    }
  ];

  const getFormatColor = (format: string) => {
    switch (format) {
      case "PDF": return "bg-destructive/10 text-destructive";
      case "DOCX": return "bg-primary/10 text-primary";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <section id="templates" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-6">
            <img 
              src={legalDocsIcon} 
              alt="Legal documents" 
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Legal Document Templates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Download professionally drafted legal document templates that comply 
            with Kenyan law. Save time and money with our ready-to-use forms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <Card 
              key={index} 
              className="hover:shadow-medium transition-smooth cursor-pointer border border-border/50"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                  {template.popular && (
                    <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                      Popular
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  {template.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <span>{template.pages} page{template.pages > 1 ? 's' : ''}</span>
                    <span>{template.downloads.toLocaleString()} downloads</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getFormatColor(template.format)}`}
                  >
                    {template.format}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Free Download</span>
                  <Button 
                    variant="success" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => handleDownload(template.title)}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/dashboard')}
          >
            Browse All Templates
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DocumentTemplates;