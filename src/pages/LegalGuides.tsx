import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, FileText, Download, Search, Filter, CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/components/i18n/translations";

const LegalGuides = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<any>(null);
  const { t } = useTranslation();

  const guides = [
    {
      title: "Employment Rights Guide",
      description: "Know your rights as an employee and how to handle workplace issues",
      category: "Employment Law",
      readTime: "12 min",
      difficulty: "Beginner",
      steps: 8,
      popular: true,
      detailedSteps: [
        {
          step: 1,
          title: "Understand Your Contract",
          description: "Review your employment contract thoroughly",
          details: "Check your terms of employment, salary, working hours, and termination clauses."
        },
        {
          step: 2,
          title: "Know Your Rights",
          description: "Learn about your basic employment rights",
          details: "Understand minimum wage, working hours, leave entitlements, and safety regulations."
        },
        {
          step: 3,
          title: "Document Everything",
          description: "Keep records of all workplace interactions",
          details: "Save emails, contracts, payslips, and any communication with your employer."
        },
        {
          step: 4,
          title: "Address Issues Internally",
          description: "Try to resolve problems with your employer first",
          details: "Schedule a meeting with HR or your supervisor to discuss the issue professionally."
        },
        {
          step: 5,
          title: "Seek Legal Advice",
          description: "Consult with an employment lawyer if needed",
          details: "Get professional advice before taking any legal action against your employer."
        },
        {
          step: 6,
          title: "File a Complaint",
          description: "Submit formal complaints to relevant authorities",
          details: "File complaints with the Ministry of Labour or relevant trade unions."
        },
        {
          step: 7,
          title: "Consider Mediation",
          description: "Use mediation services to resolve disputes",
          details: "Many employment disputes can be resolved through mediation before going to court."
        },
        {
          step: 8,
          title: "Legal Action",
          description: "Take legal action if other methods fail",
          details: "File a case in the Employment and Labour Relations Court if necessary."
        }
      ],
      resources: [
        "Employment Act, 2007",
        "Labour Relations Act, 2007",
        "Work Injury Benefits Act, 2007"
      ]
    },
    {
      title: "Land Dispute Resolution",
      description: "Navigate land ownership conflicts and property disputes",
      category: "Property Law",
      readTime: "18 min",
      difficulty: "Intermediate",
      steps: 10,
      popular: true,
      detailedSteps: [
        {
          step: 1,
          title: "Gather Documentation",
          description: "Collect all relevant land documents",
          details: "Gather title deeds, survey maps, purchase agreements, and any court documents."
        },
        {
          step: 2,
          title: "Verify Ownership",
          description: "Confirm your legal ownership status",
          details: "Check with the Lands Registry to verify your title and any encumbrances."
        },
        {
          step: 3,
          title: "Identify the Dispute",
          description: "Clearly define what the dispute is about",
          details: "Determine if it's a boundary dispute, ownership claim, or other property issue."
        },
        {
          step: 4,
          title: "Attempt Negotiation",
          description: "Try to resolve the issue through discussion",
          details: "Meet with the other party to discuss the dispute and find common ground."
        },
        {
          step: 5,
          title: "Engage a Surveyor",
          description: "Get professional land surveying done",
          details: "Hire a licensed surveyor to determine accurate boundaries and measurements."
        },
        {
          step: 6,
          title: "Seek Legal Counsel",
          description: "Consult with a property lawyer",
          details: "Get legal advice on your rights and the best course of action."
        },
        {
          step: 7,
          title: "Alternative Dispute Resolution",
          description: "Consider mediation or arbitration",
          details: "Use ADR methods to resolve the dispute without going to court."
        },
        {
          step: 8,
          title: "File with Lands Tribunal",
          description: "Submit your case to the Lands Tribunal",
          details: "File a formal complaint with the National Lands Commission or Lands Tribunal."
        },
        {
          step: 9,
          title: "Court Proceedings",
          description: "Take the matter to court if necessary",
          details: "File a case in the Environment and Land Court for resolution."
        },
        {
          step: 10,
          title: "Enforce Judgment",
          description: "Ensure court orders are implemented",
          details: "Work with authorities to enforce any court judgments in your favor."
        }
      ],
      resources: [
        "Land Act, 2012",
        "Land Registration Act, 2012",
        "National Land Commission Act, 2012"
      ]
    },
    {
      title: "Divorce Process Guide",
      description: "Step-by-step guide to filing for divorce in Kenya",
      category: "Family Law",
      readTime: "15 min",
      difficulty: "Intermediate",
      steps: 12,
      popular: false,
      detailedSteps: [
        {
          step: 1,
          title: "Consider Counseling",
          description: "Explore reconciliation options first",
          details: "Many courts require evidence that reconciliation has been attempted."
        },
        {
          step: 2,
          title: "Gather Documents",
          description: "Collect all necessary documentation",
          details: "Marriage certificate, children's birth certificates, financial records, and property documents."
        },
        {
          step: 3,
          title: "Attempt Reconciliation",
          description: "Consider counseling or mediation before proceeding with divorce",
          details: "Many courts require attempts at reconciliation. Consider marriage counseling or mediation services."
        },
        {
          step: 4,
          title: "File Petition",
          description: "Submit the divorce petition to the appropriate court",
          details: "File your petition at the Family Division of the High Court or Magistrate's Court depending on your circumstances."
        },
        {
          step: 5,
          title: "Serve Papers",
          description: "Ensure the other party is properly served with court documents",
          details: "The court will arrange for your spouse to be served with the divorce papers and summons."
        },
        {
          step: 6,
          title: "Response Period",
          description: "Wait for the other party to respond to the petition",
          details: "Your spouse has 21 days to file a response. If they don't respond, you may get a default judgment."
        },
        {
          step: 7,
          title: "Interim Orders",
          description: "Request temporary orders for custody, support, and property",
          details: "File for interim orders to address immediate needs like child custody, maintenance, and property division."
        },
        {
          step: 8,
          title: "Discovery",
          description: "Exchange financial and other relevant information",
          details: "Both parties must disclose all financial information, assets, and other relevant documents."
        },
        {
          step: 9,
          title: "Mediation",
          description: "Participate in court-ordered mediation to reach agreement",
          details: "The court may order mediation to help you reach agreement on contested issues."
        },
        {
          step: 10,
          title: "Trial Preparation",
          description: "Prepare for trial if mediation fails to resolve all issues",
          details: "If mediation doesn't resolve all issues, prepare for trial by gathering evidence and witnesses."
        },
        {
          step: 11,
          title: "Trial",
          description: "Present your case in court if necessary",
          details: "Attend all court hearings and present your evidence and arguments to the judge."
        },
        {
          step: 12,
          title: "Judgment",
          description: "Receive and implement the court's final decision",
          details: "Once the judge makes a decision, ensure all orders are properly implemented and followed."
        }
      ],
      resources: [
        "Marriage Act, 2014",
        "Matrimonial Property Act, 2013",
        "Children Act, 2001"
      ]
    },
    {
      title: "Small Claims Court Guide",
      description: "Recover debts and damages through small claims procedures",
      category: "Civil Procedure",
      readTime: "8 min",
      difficulty: "Beginner",
      steps: 4,
      popular: true,
      detailedSteps: [
        {
          step: 1,
          title: "Assess Your Claim",
          description: "Determine if your claim qualifies for small claims court (under KES 1 million)",
          details: "Small claims court handles cases up to KES 1 million. Ensure your claim falls within this limit."
        },
        {
          step: 2,
          title: "Prepare Documentation",
          description: "Gather all evidence supporting your claim including contracts, receipts, and correspondence",
          details: "Collect all relevant documents: contracts, invoices, receipts, emails, text messages, and any other evidence."
        },
        {
          step: 3,
          title: "File Your Claim",
          description: "Submit your claim form and pay the filing fee at the nearest court",
          details: "Visit your local court and file a claim form. Pay the required filing fee (usually KES 100-500)."
        },
        {
          step: 4,
          title: "Attend Hearing",
          description: "Present your case at the scheduled hearing date",
          details: "Attend the hearing with all your evidence. The process is informal and you can represent yourself."
        }
      ],
      resources: [
        "Small Claims Court Act, 2016",
        "Civil Procedure Act, Cap 21"
      ]
    },
    {
      title: "Consumer Rights Protection",
      description: "Protect yourself from fraudulent businesses and unfair practices",
      category: "Consumer Law",
      readTime: "14 min",
      difficulty: "Intermediate",
      steps: 7,
      popular: false,
      detailedSteps: [
        {
          step: 1,
          title: "Document the Issue",
          description: "Keep detailed records of the transaction and the problem",
          details: "Save all receipts, contracts, warranties, and correspondence related to the transaction."
        },
        {
          step: 2,
          title: "Contact the Business",
          description: "First, try to resolve the issue directly with the business",
          details: "Write a formal complaint letter to the business explaining the problem and what you want resolved."
        },
        {
          step: 3,
          title: "Contact Consumer Protection",
          description: "Report the issue to the Competition Authority of Kenya",
          details: "File a complaint with the Competition Authority of Kenya through their website or office."
        },
        {
          step: 4,
          title: "Use Alternative Dispute Resolution",
          description: "Consider mediation or arbitration services",
          details: "Many consumer disputes can be resolved through mediation services offered by consumer organizations."
        },
        {
          step: 5,
          title: "File with Small Claims Court",
          description: "If the amount is under KES 1 million, use small claims court",
          details: "For smaller amounts, file a claim in small claims court which is faster and cheaper than regular court."
        },
        {
          step: 6,
          title: "Report to Authorities",
          description: "Report fraud or criminal activity to the police",
          details: "If the business committed fraud or other crimes, report to the police and get a police abstract."
        },
        {
          step: 7,
          title: "Public Awareness",
          description: "Share your experience to help others avoid similar issues",
          details: "Consider sharing your experience on consumer review platforms to warn others about problematic businesses."
        }
      ],
      resources: [
        "Consumer Protection Act, 2012",
        "Competition Act, 2010",
        "Sale of Goods Act, Cap 31"
      ]
    }
  ];

  const categories = ["Employment Law", "Property Law", "Family Law", "Civil Procedure", "Consumer Law"];
  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || !selectedCategory || guide.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || !selectedDifficulty || guide.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-success/10 text-success";
      case "Intermediate": return "bg-warning/10 text-warning";  
      case "Advanced": return "bg-destructive/10 text-destructive";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  const handleStartGuide = (guide: any) => {
    setSelectedGuide(guide);
    setIsDialogOpen(true);
  };

  const handleDownloadGuide = (guide: any) => {
    const guideText = `
${guide.title}
${'='.repeat(guide.title.length)}

${guide.description}

Difficulty: ${guide.difficulty}
Estimated Time: ${guide.readTime}
Category: ${guide.category}

STEP-BY-STEP GUIDE:
${guide.detailedSteps.map((step: any) => `
${step.step}. ${step.title}
   ${step.description}
   
   Details: ${step.details}
`).join('\n')}

LEGAL RESOURCES:
${guide.resources.map((resource: string) => `- ${resource}`).join('\n')}

---
Generated by Haki Kenya Legal Aid Platform
This guide is for reference only and should not replace professional legal advice.
    `;
    
    const blob = new Blob([guideText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${guide.title.replace(/\s+/g, '_')}_Guide.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-hero rounded-full mx-auto mb-6 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('page.guides.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('page.guides.subtitle')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={`${t('common.search')} ${t('nav.guides').toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={`${t('common.filter')} ${t('guide.category').toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')} {t('guide.category')}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder={`${t('common.filter')} ${t('guide.difficulty').toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')} {t('guide.difficulty')}</SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {t('common.filter')}
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {t('common.found')} {filteredGuides.length} {t('nav.guides').toLowerCase()}{filteredGuides.length !== 1 ? 's' : ''} 
            {searchTerm && ` ${t('common.matching')} "${searchTerm}"`}
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide, index) => (
            <Card 
              key={index} 
              className="hover:shadow-medium transition-smooth cursor-pointer bg-white"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {guide.category}
                  </Badge>
                  {guide.popular && (
                    <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
                      {t('common.popular')}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight">
                  {guide.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {guide.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {guide.readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {guide.steps} {t('common.steps')}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getDifficultyColor(guide.difficulty)}`}
                  >
                    {guide.difficulty}
                  </Badge>
                  <div className="flex gap-2">
                    <Button 
                      variant="trust" 
                      size="sm"
                      onClick={() => handleStartGuide(guide)}
                    >
                      <BookOpen className="w-4 h-4 mr-1" />
                      {t('guide.startGuide')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadGuide(guide)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('common.noGuidesFound')}</h3>
            <p className="text-muted-foreground">
              {t('common.tryAdjustingSearch')}
            </p>
          </div>
        )}

        {/* Detailed Guide Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedGuide?.title}</DialogTitle>
              <DialogDescription className="text-lg">
                {selectedGuide?.description}
              </DialogDescription>
            </DialogHeader>
            
            {selectedGuide && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedGuide.readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {selectedGuide.steps} {t('common.steps')}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getDifficultyColor(selectedGuide.difficulty)}`}
                  >
                    {selectedGuide.difficulty}
                  </Badge>
                </div>

                <Tabs defaultValue="steps" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="steps">{t('guide.stepByStep')}</TabsTrigger>
                    <TabsTrigger value="resources">{t('guide.legalResources')}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="steps" className="space-y-4">
                    {selectedGuide.detailedSteps.map((step: any, index: number) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                              {step.step}
                            </div>
                            <CardTitle className="text-lg">{step.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-3">{step.description}</p>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm font-medium mb-2">{t('guide.detailedInstructions')}:</p>
                            <p className="text-sm">{step.details}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="resources" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t('guide.relevantLaws')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedGuide.resources.map((resource: string, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span>{resource}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={() => {
                      setIsDialogOpen(false);
                      window.location.href = '/lawyers';
                    }}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {t('hero.findLawyer')}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadGuide(selectedGuide)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('guide.download')}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LegalGuides; 