import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Users } from "lucide-react";

const LegalGuides = () => {
  const guides = [
    {
      title: "Land Disputes Resolution",
      description: "Step-by-step guide to resolving land ownership conflicts in Kenya",
      category: "Property Law",
      readTime: "15 min",
      difficulty: "Intermediate",
      steps: 8,
      popular: true
    },
    {
      title: "Employment Rights Protection", 
      description: "Know your rights as an employee and how to file complaints",
      category: "Labor Law",
      readTime: "12 min", 
      difficulty: "Beginner",
      steps: 6,
      popular: true
    },
    {
      title: "Police Harassment Response",
      description: "Legal steps to take when facing police misconduct or harassment",
      category: "Civil Rights",
      readTime: "10 min",
      difficulty: "Beginner", 
      steps: 5,
      popular: false
    },
    {
      title: "Family Court Procedures",
      description: "Navigate divorce, custody, and maintenance cases effectively",
      category: "Family Law",
      readTime: "20 min",
      difficulty: "Advanced",
      steps: 12,
      popular: false
    },
    {
      title: "Small Claims Court Guide",
      description: "Recover debts and damages through small claims procedures",
      category: "Civil Procedure", 
      readTime: "8 min",
      difficulty: "Beginner",
      steps: 4,
      popular: true
    },
    {
      title: "Consumer Rights Protection",
      description: "Protect yourself from fraudulent businesses and unfair practices",
      category: "Consumer Law",
      readTime: "14 min",
      difficulty: "Intermediate",
      steps: 7,
      popular: false
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-success/10 text-success";
      case "Intermediate": return "bg-warning/10 text-warning";  
      case "Advanced": return "bg-destructive/10 text-destructive";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <section id="guides" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Legal Guides for Common Issues
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get step-by-step guidance on how to handle the most common legal challenges 
            faced by Kenyans every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <Card 
              key={index} 
              className="hover:shadow-medium transition-smooth cursor-pointer bg-gradient-card border-0"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {guide.category}
                  </Badge>
                  {guide.popular && (
                    <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
                      Popular
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
                    {guide.steps} steps
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getDifficultyColor(guide.difficulty)}`}
                  >
                    {guide.difficulty}
                  </Badge>
                  <Button variant="trust" size="sm">
                    Start Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Legal Guides
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LegalGuides;