import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Search, Filter, Eye, Star, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import legalDocsIcon from "@/assets/legal-docs-icon.png";

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const { toast } = useToast();

  const templates = [
    {
      title: "Demand Letter Template",
      description: "Professional demand letter for unpaid debts or services",
      category: "Debt Recovery",
      format: "PDF",
      pages: 2,
      downloads: 1247,
      popular: true,
      price: "Free",
      lastUpdated: "2024-01-15",
      rating: 4.8,
      reviews: 89,
      tags: ["debt", "payment", "legal notice"],
      preview: "This template helps you create a formal demand letter..."
    },
    {
      title: "Affidavit Template",
      description: "Standard affidavit format for court proceedings",
      category: "Court Documents", 
      format: "DOCX",
      pages: 1,
      downloads: 892,
      popular: true,
      price: "Free",
      lastUpdated: "2024-01-10",
      rating: 4.7,
      reviews: 67,
      tags: ["court", "sworn statement", "legal document"],
      preview: "Use this template to create a properly formatted affidavit..."
    },
    {
      title: "Employment Contract",
      description: "Basic employment agreement template for small businesses",
      category: "Employment",
      format: "DOCX", 
      pages: 4,
      downloads: 634,
      popular: false,
      price: "Free",
      lastUpdated: "2024-01-05",
      rating: 4.6,
      reviews: 45,
      tags: ["employment", "contract", "business"],
      preview: "Comprehensive employment contract template compliant with Kenyan law..."
    },
    {
      title: "Tenancy Agreement",
      description: "Residential rental agreement compliant with Kenyan law",
      category: "Property",
      format: "PDF",
      pages: 6,
      downloads: 1156,
      popular: true,
      price: "Free",
      lastUpdated: "2024-01-12",
      rating: 4.9,
      reviews: 123,
      tags: ["rental", "property", "lease"],
      preview: "Complete tenancy agreement template with all necessary clauses..."
    },
    {
      title: "Power of Attorney",
      description: "General power of attorney document template",
      category: "Legal Authorization",
      format: "PDF",
      pages: 3,
      downloads: 445,
      popular: false,
      price: "Free",
      lastUpdated: "2024-01-08",
      rating: 4.5,
      reviews: 34,
      tags: ["authorization", "legal power", "delegation"],
      preview: "Standard power of attorney template for general legal matters..."
    },
    {
      title: "Notice to Quit",
      description: "Formal notice for tenant eviction proceedings",
      category: "Property",
      format: "DOCX",
      pages: 1,
      downloads: 378,
      popular: false,
      price: "Free",
      lastUpdated: "2024-01-03",
      rating: 4.4,
      reviews: 28,
      tags: ["eviction", "notice", "property"],
      preview: "Properly formatted notice to quit for legal eviction proceedings..."
    },
    {
      title: "Will Template",
      description: "Simple will template for basic estate planning",
      category: "Estate Planning",
      format: "PDF",
      pages: 3,
      downloads: 567,
      popular: true,
      price: "Free",
      lastUpdated: "2024-01-20",
      rating: 4.8,
      reviews: 78,
      tags: ["will", "estate", "inheritance"],
      preview: "Basic will template to help you plan your estate distribution..."
    },
    {
      title: "Business Registration Form",
      description: "Template for business name registration application",
      category: "Business Law",
      format: "DOCX",
      pages: 2,
      downloads: 789,
      popular: true,
      price: "Free",
      lastUpdated: "2024-01-18",
      rating: 4.7,
      reviews: 92,
      tags: ["business", "registration", "company"],
      preview: "Complete business registration form template with instructions..."
    }
  ];

  const categories = ["Debt Recovery", "Court Documents", "Employment", "Property", "Legal Authorization", "Estate Planning", "Business Law"];
  const formats = ["PDF", "DOCX"];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || !selectedCategory || template.category === selectedCategory;
    const matchesFormat = selectedFormat === "all" || !selectedFormat || template.format === selectedFormat;
    
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const getFormatColor = (format: string) => {
    switch (format) {
      case "PDF": return "bg-destructive/10 text-destructive";
      case "DOCX": return "bg-primary/10 text-primary";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  const handleDownload = (template: any) => {
    const templateContent = `[This is a sample template content for ${template.title}]

In a real application, this would contain the actual legal document template.

${template.title} Template

Date: _________________

To: [Recipient Name]
    [Recipient Address]

From: [Your Name]
     [Your Address]

Subject: ${template.title}

Dear [Recipient Name],

[Main content of the document would go here]

Sincerely,
[Your Name]
[Your Contact Information]

---
Generated by Haki Kenya Legal Aid Platform
This template is for reference only and should be reviewed by a legal professional before use.
    `;
    
    const blob = new Blob([templateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title.replace(/\s+/g, '_')}_Template.${template.format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: `Downloading ${template.title}`,
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6">
            <img 
              src={legalDocsIcon} 
              alt="Legal documents" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Legal Document Templates
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Download professionally drafted legal document templates that comply 
            with Kenyan law. Save time and money with our ready-to-use forms.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                {formats.map((format) => (
                  <SelectItem key={format} value={format}>{format}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Found {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} 
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <Card 
              key={index} 
              className="hover:shadow-medium transition-smooth cursor-pointer border border-border/50 bg-white"
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
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
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

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-current" />
                      <span className="text-sm font-medium">{template.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({template.reviews} reviews)</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">Updated {template.lastUpdated}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Preview */}
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">{template.preview}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-success">{template.price}</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // In a real app, this would show a preview
                          toast({
                            title: "Preview",
                            description: `Previewing ${template.title}`,
                          });
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="flex items-center gap-2"
                        onClick={() => handleDownload(template)}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or contact us for assistance.
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-foreground mb-4">About Our Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Legally Compliant</h4>
              <p className="text-sm text-muted-foreground">
                All templates are reviewed by legal professionals and comply with Kenyan law.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Download className="w-6 h-6 text-success" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Free Downloads</h4>
              <p className="text-sm text-muted-foreground">
                All templates are completely free to download and use for your legal needs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Regular Updates</h4>
              <p className="text-sm text-muted-foreground">
                Templates are regularly updated to reflect changes in laws and regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates; 