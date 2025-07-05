import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, MapPin, Star, Phone, Mail, Search, Filter, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/components/i18n/translations";
import { Loading, LawyerCardSkeleton, SearchSkeleton } from "@/components/ui/loading";

const Lawyers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const lawyers = [
    {
      name: "Advocate Sarah Kimani",
      specialties: ["Employment Law", "Civil Rights"],
      location: "Nairobi",
      rating: 4.8,
      reviews: 32,
      experience: "8 years",
      proBono: true,
      available: true,
      description: "Specializes in worker's rights and civil liberties cases",
      phone: "+254 712 345 678",
      email: "s.kimani@lawfirm.co.ke",
      consultationFee: "KES 1,500",
      languages: ["English", "Swahili"],
      education: "LLB, University of Nairobi",
      barNumber: "L/2023/001",
      availability: ["Monday", "Wednesday", "Friday"],
      responseTime: "Within 2 hours"
    },
    {
      name: "Advocate James Mwangi", 
      specialties: ["Property Law", "Land Disputes"],
      location: "Nairobi",
      rating: 4.9,
      reviews: 45,
      experience: "12 years",
      proBono: true,
      available: false,
      description: "Expert in land ownership and property dispute resolution",
      phone: "+254 722 456 789",
      email: "j.mwangi@advocates.co.ke",
      consultationFee: "KES 2,000",
      languages: ["English", "Swahili", "Kikuyu"],
      education: "LLB, Moi University",
      barNumber: "L/2011/045",
      availability: ["Tuesday", "Thursday", "Saturday"],
      responseTime: "Within 4 hours"
    },
    {
      name: "Advocate Grace Wanjiku",
      specialties: ["Family Law", "Consumer Rights"],
      location: "Mombasa", 
      rating: 4.7,
      reviews: 28,
      experience: "6 years",
      proBono: true,
      available: true,
      description: "Passionate about family law and consumer protection",
      phone: "+254 733 567 890",
      email: "g.wanjiku@legal.co.ke",
      consultationFee: "KES 1,200",
      languages: ["English", "Swahili"],
      education: "LLB, Kenyatta University",
      barNumber: "L/2018/078",
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday"],
      responseTime: "Within 1 hour"
    },
    {
      name: "Advocate Peter Ochieng",
      specialties: ["Criminal Defense", "Police Misconduct"],
      location: "Kisumu",
      rating: 4.6,
      reviews: 19,
      experience: "10 years", 
      proBono: true,
      available: true,
      description: "Defender of civil rights and criminal justice",
      phone: "+254 744 678 901",
      email: "p.ochieng@lawchambers.co.ke",
      consultationFee: "KES 1,800",
      languages: ["English", "Swahili", "Luo"],
      education: "LLB, University of Nairobi",
      barNumber: "L/2014/023",
      availability: ["Monday", "Wednesday", "Friday", "Saturday"],
      responseTime: "Within 3 hours"
    },
    {
      name: "Advocate Mary Cheptoo",
      specialties: ["Employment Law", "Small Claims"],
      location: "Nakuru",
      rating: 4.8,
      reviews: 22,
      experience: "5 years",
      proBono: true,
      available: true,
      description: "Helping workers and small business owners with legal issues",
      phone: "+254 755 789 012", 
      email: "m.cheptoo@advocates.co.ke",
      consultationFee: "KES 1,000",
      languages: ["English", "Swahili", "Kalenjin"],
      education: "LLB, Egerton University",
      barNumber: "L/2019/056",
      availability: ["Tuesday", "Thursday", "Saturday"],
      responseTime: "Within 2 hours"
    },
    {
      name: "Advocate David Kiprotich",
      specialties: ["Property Law", "Business Law"],
      location: "Eldoret",
      rating: 4.5,
      reviews: 15,
      experience: "7 years",
      proBono: false,
      available: true,
      description: "Property and business law consultant with affordable rates",
      phone: "+254 766 890 123",
      email: "d.kiprotich@lawfirm.co.ke",
      consultationFee: "KES 1,500",
      languages: ["English", "Swahili", "Kalenjin"],
      education: "LLB, Moi University",
      barNumber: "L/2017/034",
      availability: ["Monday", "Wednesday", "Friday"],
      responseTime: "Within 5 hours"
    }
  ];

  const specialties = ["Employment Law", "Civil Rights", "Property Law", "Land Disputes", "Family Law", "Consumer Rights", "Criminal Defense", "Business Law", "Small Claims"];
  const locations = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"];

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate search delay
  useEffect(() => {
    if (searchTerm || selectedSpecialty || selectedLocation) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, selectedSpecialty, selectedLocation]);

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === "all" || !selectedSpecialty || lawyer.specialties.includes(selectedSpecialty);
    const matchesLocation = selectedLocation === "all" || !selectedLocation || lawyer.location === selectedLocation;
    
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = (email: string, name: string) => {
    const subject = encodeURIComponent(`Legal Consultation Request - ${name}`);
    const body = encodeURIComponent(`Dear ${name},\n\nI would like to schedule a legal consultation with you.\n\nPlease let me know your available times.\n\nBest regards,\n[Your Name]`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-hero rounded-full mx-auto mb-6 flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('page.lawyers.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('page.lawyers.subtitle')}
          </p>
        </div>

        {/* Search and Filters */}
        {isLoading ? (
          <SearchSkeleton />
        ) : (
          <div className="bg-white rounded-lg p-6 mb-8 shadow-soft">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={`${t('common.search')} ${t('nav.lawyers').toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder={`${t('common.filter')} ${t('lawyer.specialization').toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')} {t('lawyer.specialization')}</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder={`${t('common.filter')} location`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.all')} Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {t('common.filter')}
              </Button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          {isSearching ? (
            <Loading type="dots" text={t('common.searching')} />
          ) : (
            <p className="text-muted-foreground">
              {t('common.found')} {filteredLawyers.length} {t('nav.lawyers').toLowerCase()}{filteredLawyers.length !== 1 ? 's' : ''} 
              {searchTerm && ` ${t('common.matching')} "${searchTerm}"`}
            </p>
          )}
        </div>

        {/* Lawyers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <LawyerCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLawyers.map((lawyer, index) => (
              <Card key={index} className="hover:shadow-medium transition-smooth bg-white">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-xl">
                          {lawyer.name.split(' ')[1]?.[0] || lawyer.name[0]}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">{lawyer.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {lawyer.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {lawyer.proBono && (
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          {t('lawyer.freeConsultation')}
                        </Badge>
                      )}
                      {lawyer.available ? (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                          {t('common.available')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground">
                          {t('common.busy')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-current" />
                      {lawyer.rating} ({lawyer.reviews} {t('common.reviews')})
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {lawyer.experience} {t('lawyer.experience')}
                    </div>
                  </div>
                  
                  <CardDescription className="text-base">
                    {lawyer.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Specialties */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">{t('lawyer.specialization')}</p>
                      <div className="flex flex-wrap gap-2">
                        {lawyer.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t('consultation.fee')}</p>
                        <p className="font-semibold">{lawyer.consultationFee}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('common.responseTime')}</p>
                        <p className="font-semibold">{lawyer.responseTime}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('common.languages')}</p>
                        <p className="font-semibold">{lawyer.languages.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('common.availableDays')}</p>
                        <p className="font-semibold">{lawyer.availability.join(", ")}</p>
                      </div>
                    </div>

                    {/* Contact Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button 
                        variant="trust" 
                        className="flex-1"
                        onClick={() => handleCall(lawyer.phone)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {t('common.call')} {lawyer.phone}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEmail(lawyer.email, lawyer.name)}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        {t('common.email')}
                      </Button>
                    </div>

                    {/* Book Consultation */}
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={() => {
                        localStorage.setItem('selectedLawyer', JSON.stringify(lawyer));
                        navigate('/consultations');
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {t('consultation.book')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredLawyers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('common.noLawyersFound')}</h3>
            <p className="text-muted-foreground">
              {t('common.tryAdjustingSearch')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lawyers; 