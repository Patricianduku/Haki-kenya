import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Accessibility, 
  Eye, 
  Type, 
  Volume2, 
  Contrast, 
  MousePointer,
  Sun,
  Moon,
  Monitor
} from "lucide-react";
import { useTranslation } from "@/components/i18n/translations";

interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: number;
  reducedMotion: boolean;
  screenReader: boolean;
  focusIndicator: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export const AccessibilityPanel = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: 16,
    reducedMotion: false,
    screenReader: false,
    focusIndicator: true,
    theme: 'auto'
  });

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Font size
    root.style.fontSize = `${settings.fontSize}px`;
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Focus indicator
    if (settings.focusIndicator) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
    
    // Theme
    root.setAttribute('data-theme', settings.theme);
    
  }, [settings]);

  const handleSettingChange = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      highContrast: false,
      fontSize: 16,
      reducedMotion: false,
      screenReader: false,
      focusIndicator: true,
      theme: 'auto'
    });
  };

  return (
    <div className="fixed top-20 right-4 z-50">
      {/* Accessibility Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        aria-label={t('accessibility.openPanel')}
      >
        <Accessibility className="w-5 h-5" />
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <Card className="absolute top-16 right-0 w-80 shadow-xl max-h-[70vh] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="w-5 h-5" />
              {t('accessibility.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Theme Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('accessibility.theme')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={settings.theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSettingChange('theme', 'light')}
                  className="flex items-center gap-1"
                >
                  <Sun className="w-3 h-3" />
                  {t('accessibility.light')}
                </Button>
                <Button
                  variant={settings.theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSettingChange('theme', 'dark')}
                  className="flex items-center gap-1"
                >
                  <Moon className="w-3 h-3" />
                  {t('accessibility.dark')}
                </Button>
                <Button
                  variant={settings.theme === 'auto' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSettingChange('theme', 'auto')}
                  className="flex items-center gap-1"
                >
                  <Monitor className="w-3 h-3" />
                  {t('accessibility.auto')}
                </Button>
              </div>
            </div>

            <Separator />

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Contrast className="w-4 h-4" />
                <span className="text-sm">{t('accessibility.highContrast')}</span>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
              />
            </div>

            {/* Font Size */}
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Type className="w-4 h-4" />
                {t('accessibility.fontSize')} ({settings.fontSize}px)
              </label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={(value) => handleSettingChange('fontSize', value[0])}
                max={24}
                min={12}
                step={1}
                className="w-full"
              />
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span className="text-sm">{t('accessibility.reducedMotion')}</span>
              </div>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
              />
            </div>

            {/* Focus Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MousePointer className="w-4 h-4" />
                <span className="text-sm">{t('accessibility.focusIndicator')}</span>
              </div>
              <Switch
                checked={settings.focusIndicator}
                onCheckedChange={(checked) => handleSettingChange('focusIndicator', checked)}
              />
            </div>

            <Separator />

            {/* Screen Reader Announcement */}
            <div className="text-xs text-muted-foreground">
              {t('accessibility.screenReaderInfo')}
            </div>

            {/* Reset Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={resetSettings}
              className="w-full"
            >
              {t('accessibility.reset')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Keyboard navigation hook
export const useKeyboardNavigation = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip to main content
      if (event.key === 'Tab' && event.altKey) {
        event.preventDefault();
        const mainContent = document.querySelector('main');
        if (mainContent) {
          (mainContent as HTMLElement).focus();
        }
      }
      
      // Skip to navigation
      if (event.key === 'N' && event.altKey) {
        event.preventDefault();
        const nav = document.querySelector('nav');
        if (nav) {
          (nav as HTMLElement).focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};

// Focus trap hook
export const useFocusTrap = (ref: React.RefObject<HTMLElement>, isActive: boolean) => {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [ref, isActive]);
}; 