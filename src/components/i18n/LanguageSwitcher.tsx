import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe } from 'lucide-react'

interface Language {
  code: string
  name: string
  flag: string
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' }
]

export const LanguageSwitcher = () => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('preferred-language') || 'en'
  })

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode)
    localStorage.setItem('preferred-language', languageCode)
    
    // Trigger a page reload to apply the new language across all components
    window.location.reload()
  }

  const currentLang = languages.find(lang => lang.code === currentLanguage)

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-40">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <span>{currentLang?.flag}</span>
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center space-x-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}