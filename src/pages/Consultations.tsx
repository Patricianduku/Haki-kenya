import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Video, MessageCircle, Calendar, CreditCard, Phone, Mail, MapPin, Star, Users } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import consultationIcon from "@/assets/consultation-icon.png";

const Consultations = () => {
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    issue: "",
    preferredDate: "",
    preferredTime: "",
    paymentMethod: ""
  });
  const { toast } = useToast();

  const consultationTypes = [
    {
      title: "Quick Legal Query",
      description: "Get immediate answers to simple legal questions",
      duration: "15 minutes",
      price: "KES 500",
      method: "Chat",
      icon: MessageCircle,
      popular: false,
      features: ["Instant messaging", "Basic legal guidance", "Follow-up questions"],
      availableSlots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"]
    },
    {
      title: "Standard Consultation", 
      description: "Detailed discussion of your legal issue with an advocate",
      duration: "30 minutes",
      price: "KES 1,200",
      method: "Video Call",
      icon: Video,
      popular: true,
      features: ["Video consultation", "Document review", "Action plan", "Recording provided"],
      availableSlots: ["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"]
    },
    {
      title: "Extended Session",
      description: "Comprehensive legal consultation for complex matters",
      duration: "60 minutes", 
      price: "KES 2,000",
      method: "Video Call",
      icon: Calendar,
      popular: false,
      features: ["Extended discussion", "Multiple documents", "Detailed legal strategy", "Follow-up email summary"],
      availableSlots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"]
    }
  ];

  const availableLawyers = [
    {
      name: "Advocate Sarah Kimani",
      specialties: ["Employment Law", "Civil Rights"],
      rating: 4.8,
      reviews: 32,
      available: true,
      phone: "+254 712 345 678",
      email: "s.kimani@lawfirm.co.ke"
    },
    {
      name: "Advocate James Mwangi",
      specialties: ["Property Law", "Land Disputes"],
      rating: 4.9,
      reviews: 45,
      available: true,
      phone: "+254 722 456 789",
      email: "j.mwangi@advocates.co.ke"
    },
    {
      name: "Advocate Grace Wanjiku",
      specialties: ["Family Law", "Consumer Rights"],
      rating: 4.7,
      reviews: 28,
      available: true,
      phone: "+254 733 567 890",
      email: "g.wanjiku@legal.co.ke"
    }
  ];

  const paymentMethods = [
    { id: "mpesa", name: "M-Pesa", icon: "📱" },
    { id: "card", name: "Credit/Debit Card", icon: "💳" },
    { id: "bank", name: "Bank Transfer", icon: "🏦" },
    { id: "cash", name: "Cash on Arrival", icon: "💰" }
  ];

  const handleBookConsultation = (consultation: any) => {
    setSelectedConsultation(consultation);
    setIsBookingOpen(true);
  };

  const handleSubmitBooking = () => {
    // In a real app, this would submit to a backend
    toast({
      title: "Booking Submitted",
      description: `Your consultation with ${selectedConsultation.title} has been booked successfully!`,
    });
    setIsBookingOpen(false);
    setBookingData({
      name: "",
      email: "",
      phone: "",
      issue: "",
      preferredDate: "",
      preferredTime: "",
      paymentMethod: ""
    });
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = (email: string, name: string) => {
    const subject = encodeURIComponent(`Consultation Request - ${name}`);
    const body = encodeURIComponent(`Dear ${name},\n\nI would like to schedule a consultation with you.\n\nPlease let me know your available times.\n\nBest regards,\n[Your Name]`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6">
            <img 
              src={consultationIcon} 
              alt="Legal consultation" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Legal Consultations
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Schedule virtual consultations with qualified lawyers at transparent, 
            affordable rates. Get the legal advice you need without breaking the bank.
          </p>
        </div>

        {/* Consultation Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Choose Your Consultation Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {consultationTypes.map((consultation, index) => (
              <Card 
                key={index} 
                className={`hover:shadow-medium transition-smooth cursor-pointer border ${
                  consultation.popular ? 'border-primary shadow-soft' : 'border-border/50'
                } bg-white`}
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
                      onClick={() => handleBookConsultation(consultation)}
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Available Lawyers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Available Lawyers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableLawyers.map((lawyer, index) => (
              <Card key={index} className="bg-white">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-lg">
                        {lawyer.name.split(' ')[1]?.[0] || lawyer.name[0]}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{lawyer.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 text-warning fill-current" />
                        {lawyer.rating} ({lawyer.reviews} reviews)
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Specialties</p>
                      <div className="flex flex-wrap gap-1">
                        {lawyer.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="trust" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleCall(lawyer.phone)}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEmail(lawyer.email, lawyer.name)}
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
        </div>

        {/* Free Consultation Call */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Free 5-Minute Consultation Call</CardTitle>
              <CardDescription className="text-lg">
                Not sure which consultation is right for you? Schedule a free 5-minute call to discuss your needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {["9:00 AM", "2:00 PM", "6:00 PM"].map((time, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary hover:text-primary-foreground"
                      onClick={() => {
                        toast({
                          title: "Free Call Scheduled",
                          description: `Your free 5-minute call has been scheduled for ${time}. We'll contact you shortly.`,
                        });
                      }}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Quick call to understand your needs and match you with the right lawyer
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Dialog */}
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Book Consultation - {selectedConsultation?.title}</DialogTitle>
              <DialogDescription>
                Fill in your details to schedule your consultation
              </DialogDescription>
            </DialogHeader>
            
            {selectedConsultation && (
              <div className="space-y-6">
                {/* Consultation Summary */}
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{selectedConsultation.title}</h4>
                        <p className="text-sm text-muted-foreground">{selectedConsultation.duration} • {selectedConsultation.method}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{selectedConsultation.price}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name"
                    value={bookingData.name}
                    onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                  />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                  />
                  <Select value={bookingData.preferredDate} onValueChange={(value) => setBookingData({...bookingData, preferredDate: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Preferred Date" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Today", "Tomorrow", "Next Week"].map((date) => (
                        <SelectItem key={date} value={date}>{date}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={bookingData.preferredTime} onValueChange={(value) => setBookingData({...bookingData, preferredTime: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Preferred Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedConsultation.availableSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={bookingData.paymentMethod} onValueChange={(value) => setBookingData({...bookingData, paymentMethod: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.icon} {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Textarea
                  placeholder="Briefly describe your legal issue..."
                  value={bookingData.issue}
                  onChange={(e) => setBookingData({...bookingData, issue: e.target.value})}
                  rows={4}
                />

                {/* Payment Methods Info */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Payment Methods</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center gap-2 text-sm">
                        <span>{method.icon}</span>
                        <span>{method.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsBookingOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={handleSubmitBooking}
                    className="flex-1"
                  >
                    Confirm Booking
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

export default Consultations; 