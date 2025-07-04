import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const legalGuides = [
  {
    id: 1,
    title: "Understanding Your Rights as a Tenant",
    category: "Housing Law",
    description: "Learn about your rights and responsibilities as a tenant in Kenya, including rent laws, eviction procedures, and landlord obligations.",
    steps: 5,
    readTime: "8 min read",
    difficulty: "Beginner"
  },
  {
    id: 2,
    title: "Starting a Small Business in Kenya",
    category: "Business Law",
    description: "Step-by-step guide to legally register and operate a small business, including licensing, tax requirements, and compliance.",
    steps: 7,
    readTime: "12 min read",
    difficulty: "Intermediate"
  },
  {
    id: 3,
    title: "Employment Rights and Termination",
    category: "Labor Law",
    description: "Know your rights in the workplace, understanding wrongful termination, severance pay, and filing complaints.",
    steps: 6,
    readTime: "10 min read",
    difficulty: "Beginner"
  },
  {
    id: 4,
    title: "Family Law: Divorce and Child Custody",
    category: "Family Law",
    description: "Navigate divorce proceedings, child custody arrangements, and property division under Kenyan law.",
    steps: 8,
    readTime: "15 min read",
    difficulty: "Advanced"
  },
  {
    id: 5,
    title: "Consumer Protection Rights",
    category: "Consumer Law",
    description: "Understand your rights when purchasing goods and services, returning defective products, and seeking compensation.",
    steps: 4,
    readTime: "6 min read",
    difficulty: "Beginner"
  },
  {
    id: 6,
    title: "Understanding Criminal Defense Rights",
    category: "Criminal Law",
    description: "Know your rights when arrested, during police questioning, and throughout criminal proceedings.",
    steps: 9,
    readTime: "18 min read",
    difficulty: "Advanced"
  }
];

const categories = ["All", "Housing Law", "Business Law", "Labor Law", "Family Law", "Consumer Law", "Criminal Law"];

const LegalGuides = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredGuides = legalGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Guides</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Step-by-step guides to help you understand your legal rights and navigate common legal situations in Kenya.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search legal guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <Card key={guide.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {guide.category}
                  </Badge>
                  <Badge className={getDifficultyColor(guide.difficulty)}>
                    {guide.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{guide.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {guide.steps} steps
                  </div>
                  <span>{guide.readTime}</span>
                </div>

                <Button className="w-full" size="sm">
                  Start Guide
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No guides found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default LegalGuides;