import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X, MapPin, Star, Clock, DollarSign } from "lucide-react";
import { useTranslation } from "@/components/i18n/translations";

interface AdvancedSearchProps {
  onSearch: (filters: any) => void;
  onClear: () => void;
  className?: string;
}

export const AdvancedSearch = ({ onSearch, onClear, className = "" }: AdvancedSearchProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    specialty: "",
    location: "",
    availability: "",
    priceRange: [0, 5000],
    rating: 0,
    experience: "",
    languages: [] as string[],
    proBono: false,
    verified: false,
    responseTime: ""
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const specialties = [
    "Employment Law", "Civil Rights", "Property Law", "Land Disputes", 
    "Family Law", "Consumer Rights", "Criminal Defense", "Business Law", 
    "Small Claims", "Immigration Law", "Contract Law", "Personal Injury"
  ];

  const locations = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", 
    "Kakamega", "Nyeri", "Machakos", "Kisii", "Kericho", "Embu"
  ];

  const languages = [
    "English", "Swahili", "Kikuyu", "Luo", "Kalenjin", "Kamba", 
    "Luhya", "Kisii", "Meru", "Somali", "Turkana", "Maasai"
  ];

  const responseTimes = [
    "Within 1 hour", "Within 2 hours", "Within 4 hours", 
    "Within 6 hours", "Within 24 hours", "Next day"
  ];

  // Search suggestions
  useEffect(() => {
    if (searchTerm.length > 2) {
      const filtered = [...specialties, ...locations].filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleLanguageToggle = (language: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleSearch = () => {
    onSearch({ searchTerm, ...filters });
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilters({
      specialty: "",
      location: "",
      availability: "",
      priceRange: [0, 5000],
      rating: 0,
      experience: "",
      languages: [],
      proBono: false,
      verified: false,
      responseTime: ""
    });
    onClear();
  };

  const activeFiltersCount = Object.values(filters).filter(v => 
    v !== "" && v !== 0 && (Array.isArray(v) ? v.length > 0 : v !== false)
  ).length + (searchTerm ? 1 : 0);

  return (
    <div className={className}>
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder={`${t('common.search')} ${t('nav.lawyers').toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount}
            </Badge>
          )}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Filter className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t('common.advancedSearch')}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Filters */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('lawyer.specialization')}
                    </label>
                    <Select value={filters.specialty} onValueChange={(value) => handleFilterChange('specialty', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.selectSpecialty')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t('common.all')}</SelectItem>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('common.location')}
                    </label>
                    <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.selectLocation')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t('common.all')}</SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('common.priceRange')} (KES {filters.priceRange[0]} - {filters.priceRange[1]})
                  </label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                    max={5000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('common.minimumRating')} ({filters.rating}+ {t('common.stars')})
                  </label>
                  <Slider
                    value={[filters.rating]}
                    onValueChange={(value) => handleFilterChange('rating', value[0])}
                    max={5}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                {/* Languages */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t('common.languages')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {languages.map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={language}
                          checked={filters.languages.includes(language)}
                          onCheckedChange={() => handleLanguageToggle(language)}
                        />
                        <label htmlFor={language} className="text-sm">
                          {language}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Filters */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('common.responseTime')}
                    </label>
                    <Select value={filters.responseTime} onValueChange={(value) => handleFilterChange('responseTime', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.selectResponseTime')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t('common.any')}</SelectItem>
                        {responseTimes.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('common.experience')}
                    </label>
                    <Select value={filters.experience} onValueChange={(value) => handleFilterChange('experience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.selectExperience')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t('common.any')}</SelectItem>
                        <SelectItem value="1-3">1-3 {t('lawyer.years')}</SelectItem>
                        <SelectItem value="4-7">4-7 {t('lawyer.years')}</SelectItem>
                        <SelectItem value="8-15">8-15 {t('lawyer.years')}</SelectItem>
                        <SelectItem value="15+">15+ {t('lawyer.years')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="proBono"
                      checked={filters.proBono}
                      onCheckedChange={(checked) => handleFilterChange('proBono', checked)}
                    />
                    <label htmlFor="proBono" className="text-sm">
                      {t('common.proBonoOnly')}
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={filters.verified}
                      onCheckedChange={(checked) => handleFilterChange('verified', checked)}
                    />
                    <label htmlFor="verified" className="text-sm">
                      {t('common.verifiedOnly')}
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={handleSearch} className="flex-1">
                    {t('common.search')}
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    {t('common.clear')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1">
          <CardContent className="p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md flex items-center gap-2"
                onClick={() => {
                  setSearchTerm(suggestion);
                  setShowSuggestions(false);
                }}
              >
                <Search className="w-3 h-3 text-muted-foreground" />
                {suggestion}
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 