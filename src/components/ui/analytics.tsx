import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Download,
  Phone,
  Mail,
  Calendar,
  Search,
  FileText
} from "lucide-react";
import { useTranslation } from "@/components/i18n/translations";

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  searchQueries: number;
  lawyerClicks: number;
  consultationBookings: number;
  documentDownloads: number;
  phoneCalls: number;
  emails: number;
  popularPages: Array<{ name: string; views: number; percentage: number }>;
  popularSearches: Array<{ query: string; count: number }>;
  userEngagement: {
    avgSessionDuration: number;
    bounceRate: number;
    returnVisitors: number;
  };
}

export const AnalyticsDashboard = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<AnalyticsData>({
    pageViews: 0,
    uniqueVisitors: 0,
    searchQueries: 0,
    lawyerClicks: 0,
    consultationBookings: 0,
    documentDownloads: 0,
    phoneCalls: 0,
    emails: 0,
    popularPages: [],
    popularSearches: [],
    userEngagement: {
      avgSessionDuration: 0,
      bounceRate: 0,
      returnVisitors: 0
    }
  });

  // Simulate analytics data loading
  useEffect(() => {
    const mockData: AnalyticsData = {
      pageViews: 1247,
      uniqueVisitors: 892,
      searchQueries: 456,
      lawyerClicks: 234,
      consultationBookings: 89,
      documentDownloads: 156,
      phoneCalls: 67,
      emails: 43,
      popularPages: [
        { name: 'Lawyers Directory', views: 456, percentage: 36.6 },
        { name: 'Legal Guides', views: 234, percentage: 18.8 },
        { name: 'Document Templates', views: 189, percentage: 15.2 },
        { name: 'Consultation Booking', views: 156, percentage: 12.5 },
        { name: 'Homepage', views: 123, percentage: 9.9 }
      ],
      popularSearches: [
        { query: 'employment law', count: 45 },
        { query: 'land disputes', count: 38 },
        { query: 'family law', count: 32 },
        { query: 'civil rights', count: 28 },
        { query: 'property law', count: 25 }
      ],
      userEngagement: {
        avgSessionDuration: 4.5,
        bounceRate: 23.4,
        returnVisitors: 67.8
      }
    };

    // Simulate loading delay
    setTimeout(() => setData(mockData), 1000);
  }, []);

  const metrics = [
    {
      title: t('analytics.pageViews'),
      value: data.pageViews.toLocaleString(),
      icon: Eye,
      trend: '+12.5%',
      trendUp: true
    },
    {
      title: t('analytics.uniqueVisitors'),
      value: data.uniqueVisitors.toLocaleString(),
      icon: Users,
      trend: '+8.3%',
      trendUp: true
    },
    {
      title: t('analytics.searchQueries'),
      value: data.searchQueries.toLocaleString(),
      icon: Search,
      trend: '+15.2%',
      trendUp: true
    },
    {
      title: t('analytics.consultationBookings'),
      value: data.consultationBookings.toLocaleString(),
      icon: Calendar,
      trend: '+22.1%',
      trendUp: true
    }
  ];

  const actions = [
    {
      title: t('analytics.lawyerClicks'),
      value: data.lawyerClicks,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: t('analytics.documentDownloads'),
      value: data.documentDownloads,
      icon: Download,
      color: 'text-green-600'
    },
    {
      title: t('analytics.phoneCalls'),
      value: data.phoneCalls,
      icon: Phone,
      color: 'text-purple-600'
    },
    {
      title: t('analytics.emails'),
      value: data.emails,
      icon: Mail,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('analytics.title')}</h2>
          <p className="text-muted-foreground">{t('analytics.subtitle')}</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          {t('analytics.exportReport')}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className="flex items-center gap-2">
                  <metric.icon className="w-8 h-8 text-muted-foreground" />
                  <Badge variant={metric.trendUp ? "default" : "secondary"} className="text-xs">
                    {metric.trend}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <action.icon className={`w-6 h-6 ${action.color}`} />
                <div>
                  <p className="text-sm text-muted-foreground">{action.title}</p>
                  <p className="text-xl font-semibold">{action.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t('analytics.popularPages')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.popularPages.map((page, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{page.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {page.views.toLocaleString()} {t('analytics.views')}
                    </span>
                  </div>
                  <Progress value={page.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Searches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              {t('analytics.popularSearches')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.popularSearches.map((search, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">{search.query}</span>
                  <Badge variant="secondary">{search.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Engagement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {t('analytics.userEngagement')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{data.userEngagement.avgSessionDuration} {t('analytics.minutes')}</p>
              <p className="text-sm text-muted-foreground">{t('analytics.avgSessionDuration')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{data.userEngagement.bounceRate}%</p>
              <p className="text-sm text-muted-foreground">{t('analytics.bounceRate')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{data.userEngagement.returnVisitors}%</p>
              <p className="text-sm text-muted-foreground">{t('analytics.returnVisitors')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 