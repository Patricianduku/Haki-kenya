import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Lightbulb,
  ArrowRight,
  X,
  Bot
} from "lucide-react";
import { useTranslation } from "@/components/i18n/translations";
import { useNotifications } from "@/hooks/useNotifications";

interface SearchSuggestion {
  text: string;
  type: 'recent' | 'trending' | 'ai' | 'popular';
  category?: string;
  confidence?: number;
}

interface AISearchProps {
  onSearch: (query: string, filters?: any) => void;
  placeholder?: string;
  className?: string;
}

export const AISearch = ({ onSearch, placeholder, className = "" }: AISearchProps) => {
  const { t } = useTranslation();
  const { showSearchResults, showNoResults } = useNotifications();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAIActive, setIsAIActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock AI suggestions based on query
  const generateAISuggestions = (input: string): SearchSuggestion[] => {
    const legalTerms = [
      'employment law', 'land disputes', 'family law', 'civil rights',
      'property law', 'consumer rights', 'criminal defense', 'business law',
      'immigration law', 'contract law', 'personal injury', 'small claims'
    ];

    const locations = [
      'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'
    ];

    const aiSuggestions: SearchSuggestion[] = [];

    // Smart suggestions based on input
    if (input.toLowerCase().includes('work') || input.toLowerCase().includes('job')) {
      aiSuggestions.push({
        text: 'Employment law issues',
        type: 'ai',
        category: 'Employment Law',
        confidence: 0.95
      });
    }

    if (input.toLowerCase().includes('land') || input.toLowerCase().includes('property')) {
      aiSuggestions.push({
        text: 'Land and property disputes',
        type: 'ai',
        category: 'Property Law',
        confidence: 0.92
      });
    }

    if (input.toLowerCase().includes('family') || input.toLowerCase().includes('marriage')) {
      aiSuggestions.push({
        text: 'Family law and divorce',
        type: 'ai',
        category: 'Family Law',
        confidence: 0.89
      });
    }

    // Location-based suggestions
    locations.forEach(location => {
      if (input.toLowerCase().includes(location.toLowerCase())) {
        aiSuggestions.push({
          text: `Lawyers in ${location}`,
          type: 'ai',
          category: 'Location',
          confidence: 0.85
        });
      }
    });

    // General legal term suggestions
    legalTerms.forEach(term => {
      if (input.toLowerCase().includes(term.split(' ')[0])) {
        aiSuggestions.push({
          text: `${term} specialist`,
          type: 'ai',
          category: 'Specialization',
          confidence: 0.80
        });
      }
    });

    return aiSuggestions.slice(0, 5);
  };

  // Recent searches (mock data)
  const recentSearches: SearchSuggestion[] = [
    { text: 'Employment termination', type: 'recent' },
    { text: 'Land boundary dispute', type: 'recent' },
    { text: 'Divorce proceedings', type: 'recent' },
    { text: 'Consumer rights violation', type: 'recent' }
  ];

  // Trending searches (mock data)
  const trendingSearches: SearchSuggestion[] = [
    { text: 'COVID-19 employment rights', type: 'trending' },
    { text: 'Digital property rights', type: 'trending' },
    { text: 'Online harassment laws', type: 'trending' },
    { text: 'Environmental law violations', type: 'trending' }
  ];

  // Popular searches (mock data)
  const popularSearches: SearchSuggestion[] = [
    { text: 'Free legal consultation', type: 'popular' },
    { text: 'Pro bono lawyers', type: 'popular' },
    { text: 'Legal document templates', type: 'popular' },
    { text: 'Court filing procedures', type: 'popular' }
  ];

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      
      // Simulate AI processing delay
      setTimeout(() => {
        const aiSuggestions = generateAISuggestions(query);
        const allSuggestions = [
          ...aiSuggestions,
          ...recentSearches.filter(s => s.text.toLowerCase().includes(query.toLowerCase())),
          ...trendingSearches.filter(s => s.text.toLowerCase().includes(query.toLowerCase())),
          ...popularSearches.filter(s => s.text.toLowerCase().includes(query.toLowerCase()))
        ];
        
        setSuggestions(allSuggestions.slice(0, 8));
        setIsLoading(false);
        setShowSuggestions(true);
      }, 300);
    } else if (query.length === 0) {
      setSuggestions([
        ...recentSearches.slice(0, 2),
        ...trendingSearches.slice(0, 2),
        ...popularSearches.slice(0, 2)
      ]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setShowSuggestions(false);
    setIsLoading(true);
    
    // Simulate search processing
    setTimeout(() => {
      const results = Math.floor(Math.random() * 50) + 5;
      if (results > 0) {
        showSearchResults(results, searchQuery);
      } else {
        showNoResults(searchQuery);
      }
      onSearch(searchQuery);
      setIsLoading(false);
    }, 500);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.text);
  };

  const clearSearch = () => {
    setQuery("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'ai':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'recent':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'popular':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      default:
        return <Search className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSuggestionLabel = (type: string) => {
    switch (type) {
      case 'ai':
        return t('search.aiSuggestion');
      case 'recent':
        return t('search.recentSearch');
      case 'trending':
        return t('search.trending');
      case 'popular':
        return t('search.popular');
      default:
        return '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          placeholder={placeholder || t('search.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              handleSearch(query.trim());
            }
          }}
          className="pl-10 pr-20"
        />
        
        {/* AI Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAIActive(!isAIActive)}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
            isAIActive ? 'text-purple-600' : 'text-muted-foreground'
          }`}
          title={t('search.aiAssistant')}
        >
          <Bot className="w-4 h-4" />
        </Button>

        {/* Clear Button */}
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* AI Status Indicator */}
      {isAIActive && (
        <div className="flex items-center gap-2 mt-2 text-xs text-purple-600">
          <Sparkles className="w-3 h-3" />
          <span>{t('search.aiActive')}</span>
        </div>
      )}

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-[100] mt-2 shadow-xl border-2 max-h-[60vh] overflow-hidden">
          <CardContent className="p-0">
            {isLoading && (
              <div className="p-6 text-center text-base text-muted-foreground">
                {t('search.aiThinking')}
              </div>
            )}
            
            <div className="max-h-96 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 text-left transition-colors border-b last:border-b-0"
                >
                  {getSuggestionIcon(suggestion.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-medium truncate">
                        {suggestion.text}
                      </span>
                      {suggestion.category && (
                        <Badge variant="outline" className="text-sm px-2 py-1">
                          {suggestion.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-muted-foreground">
                        {getSuggestionLabel(suggestion.type)}
                      </span>
                      {suggestion.confidence && (
                        <span className="text-sm text-muted-foreground">
                          {Math.round(suggestion.confidence * 100)}% {t('search.confidence')}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* AI Enhancement Notice */}
            {isAIActive && (
              <div className="p-4 bg-purple-50 border-t border-purple-200">
                <div className="flex items-center gap-3 text-sm text-purple-700">
                  <Bot className="w-4 h-4" />
                  <span>{t('search.aiEnhancement')}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 