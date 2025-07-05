import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Clock, Video, MessageCircle, Calendar } from "lucide-react";
import consultationIcon from "@/assets/consultation-icon.png";

const ConsultationSection = () => {
  const navigate = useNavigate();
  
  const consultationTypes = [
    {
      title: "Quick Legal Query",
      description: "Get immediate answers to simple legal questions",
      duration: "15 minutes",
      price: "KES 500",
      method: "Chat",
      icon: MessageCircle,
      popular: false,
      features: ["Instant messaging", "Basic legal guidance", "Follow-up questions"]
    },
    {
      title: "Standard Consultation", 
      description: "Detailed discussion of your legal issue with an advocate",
      duration: "30 minutes",
      price: "KES 1,200",
      method: "Video Call",
      icon: Video,
      popular: true,
      features: ["Video consultation", "Document review", "Action plan", "Recording provided"]
    },
    {
      title: "Extended Session",
      description: "Comprehensive legal consultation for complex matters",
      duration: "60 minutes", 
      price: "KES 2,000",
      method: "Video Call",
      icon: Calendar,
      popular: false,
      features: ["Extended discussion", "Multiple documents", "Detailed legal strategy", "Follow-up email summary"]
    }
  ];

  const availableSlots = [
    { time: "9:00 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "2:00 PM", available: false },
    { time: "4:00 PM", available: true },
    { time: "6:00 PM", available: true }
  ];

  return (
    <section id="consultation" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-6">
            <img 
              src={consultationIcon} 
              alt="Legal consultation" 
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Affordable Legal Consultations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Schedule virtual consultations with qualified lawyers at transparent, 
            affordable rates. Get the legal advice you need without breaking the bank.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {consultationTypes.map((consultation, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-medium transition-smooth cursor-pointer border ${
                consultation.popular ? 'border-primary shadow-soft' : 'border-border/50'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <consultation.icon className="w-6 h-6 text-primary" />
                  </div>
                  {consultation.popular && (
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-xl leading-tight">
                  {consultation.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {consultation.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {consultation.duration}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">{consultation.price}</div>
                      <div className="text-xs text-muted-foreground">per session</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">What's included:</p>
                    <ul className="space-y-1">
                      {consultation.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    variant={consultation.popular ? "default" : "outline"} 
                    className="w-full"
                    onClick={() => {
                      // Store consultation type in localStorage for the booking form
                      localStorage.setItem('selectedConsultationType', JSON.stringify(consultation));
                      navigate('/consultations');
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-muted/50 border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Available Today</CardTitle>
              <CardDescription>
                Next available consultation slots for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-3">
                {availableSlots.map((slot, index) => (
                                  <Button
                  key={index}
                  variant={slot.available ? "outline" : "ghost"}
                  size="sm"
                  disabled={!slot.available}
                  className={`${slot.available ? 'hover:bg-primary hover:text-primary-foreground' : 'opacity-50'}`}
                  onClick={() => {
                    if (slot.available) {
                      localStorage.setItem('selectedTimeSlot', slot.time);
                      navigate('/consultations');
                    }
                  }}
                >
                  {slot.time}
                </Button>
                ))}
              </div>
              <div className="text-center mt-6">
                <Button 
                  variant="trust" 
                  size="lg"
                  onClick={() => navigate('/consultations')}
                >
                  Schedule Free 5-min Call
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Quick call to understand your needs and match you with the right lawyer
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ConsultationSection;