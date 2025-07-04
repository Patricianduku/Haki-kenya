import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, MapPin, Phone, Mail, Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const specializations = [
  "All", "Criminal Law", "Family Law", "Corporate Law", "Real Estate", 
  "Labor Law", "Immigration", "Personal Injury", "Tax Law", "Constitutional Law"
];

const Lawyers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  
  const { data: lawyers = [], isLoading } = useQuery({
    queryKey: ['/api/lawyers'],
    queryFn: () => apiClient.getLawyers()
  });

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lawyer.specialization && lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (lawyer.location && lawyer.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialization = selectedSpecialization === "All" || 
                                 (lawyer.specialization && lawyer.specialization === selectedSpecialization);
    return matchesSearch && matchesSpecialization;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const generateRating = () => {
    return (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0 and 5.0
  };

  const generateReviewCount = () => {
    return Math.floor(Math.random() * 50) + 5; // Random reviews between 5 and 55
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-32"></div>
                      <div className="h-3 bg-gray-300 rounded w-24"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Verified Lawyers</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with qualified and verified lawyers across Kenya. All our lawyers are licensed professionals ready to help with your legal needs.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, specialization, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {specializations.map((specialization) => (
              <Button
                key={specialization}
                variant={selectedSpecialization === specialization ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSpecialization(specialization)}
              >
                {specialization}
              </Button>
            ))}
          </div>
        </div>

        {/* Lawyers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLawyers.map((lawyer) => (
            <Card key={lawyer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={`https://api.dicebear.com/7.x/professional/svg?seed=${lawyer.full_name}`} />
                    <AvatarFallback>{getInitials(lawyer.full_name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{lawyer.full_name}</h3>
                    <div className="flex items-center space-x-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(parseFloat(generateRating())) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        {generateRating()} ({generateReviewCount()} reviews)
                      </span>
                    </div>
                    {lawyer.specialization && (
                      <Badge variant="secondary" className="text-xs">
                        {lawyer.specialization}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lawyer.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {lawyer.location}
                    </div>
                  )}
                  
                  {lawyer.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {lawyer.phone}
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {lawyer.email}
                  </div>
                  
                  {lawyer.bar_number && (
                    <div className="text-xs text-gray-500">
                      Bar Number: {lawyer.bar_number}
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" className="flex-1">
                      Contact
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Book Consultation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLawyers.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lawyers found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Lawyers;