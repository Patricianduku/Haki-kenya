import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Users, MapPin, Star, Phone, Mail } from "lucide-react";

const LawyerDirectory = () => {
  const navigate = useNavigate();
  
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
      email: "s.kimani@lawfirm.co.ke"
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
      email: "j.mwangi@advocates.co.ke"
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
      email: "g.wanjiku@legal.co.ke"
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
      email: "p.ochieng@lawchambers.co.ke"
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
      email: "m.cheptoo@advocates.co.ke"
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
      email: "d.kiprotich@lawfirm.co.ke"
    }
  ];

  return (
    <section id="lawyers" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-hero rounded-full mx-auto mb-6 flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Verified Pro Bono Lawyers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with qualified lawyers who offer pro bono services or affordable 
            consultations to help with your legal needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.map((lawyer, index) => (
            <Card 
              key={index} 
              className="hover:shadow-medium transition-smooth cursor-pointer bg-gradient-card border-0"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-lg">
                        {lawyer.name.split(' ')[1]?.[0] || lawyer.name[0]}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      {lawyer.proBono && (
                        <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20 mb-1">
                          Pro Bono
                        </Badge>
                      )}
                      {lawyer.available ? (
                        <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/20">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">
                          Busy
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-lg leading-tight">
                  {lawyer.name}
                </CardTitle>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {lawyer.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-current" />
                    {lawyer.rating} ({lawyer.reviews})
                  </div>
                </div>
                
                <CardDescription className="text-sm">
                  {lawyer.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-1">
                      {lawyer.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Experience: {lawyer.experience}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="trust" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        // Show phone number and make call
                        alert(`Calling ${lawyer.phone}`);
                        window.open(`tel:${lawyer.phone}`, '_self');
                      }}
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call {lawyer.phone}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        // Show email and open email client
                        const subject = encodeURIComponent(`Legal Consultation Request - ${lawyer.name}`);
                        const body = encodeURIComponent(`Dear ${lawyer.name},\n\nI would like to schedule a legal consultation with you.\n\nPlease let me know your available times.\n\nBest regards,\n[Your Name]`);
                        window.open(`mailto:${lawyer.email}?subject=${subject}&body=${body}`, '_self');
                      }}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/lawyers')}
          >
            View All Lawyers
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LawyerDirectory;