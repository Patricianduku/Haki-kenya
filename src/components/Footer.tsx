import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/components/i18n/translations";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleQuickLink = (path: string) => {
    navigate(path);
  };

  const showFAQ = () => {
    const currentLanguage = localStorage.getItem('preferred-language') || 'en';
    const isSwahili = currentLanguage === 'sw';
    
    const faqContent = isSwahili ? 
      `Maswali Yanayoulizwa Sana

1. Ushauri gharama kiasi gani?
   - Swali la Haraka la Kisheria: KES 500 (dakika 15)
   - Ushauri wa Kawaida: KES 1,200 (dakika 30)
   - Kipindi cha Upanuzi: KES 2,000 (dakika 60)
   - Simu ya awali ya dakika 5 ya bure inapatikana

2. Mawakili waliohitimu?
   - Mawakili wote wamedhinishwa na kusajiliwa na LSK
   - Uzoefu wa angalau miaka 5 unahitajika
   - Wataalamu katika maeneo mbalimbali ya kisheria

3. Ninawezaje kuoda ushauri?
   - Bofya "Oda Sasa" kwenye aina yoyote ya ushauri
   - Jaza fomu ya kuoda
   - Chagua muda wako wa kipendeleo
   - Lipa kupitia M-Pesa, kadi, au uhamisho wa benki

4. Nini kama siwezi kulipa ada za kisheria?
   - Huduma za bure zinapatikana kwa kesi zinazofaa
   - Mipango ya malipo inaweza kupangwa
   - Miongozo ya bure na vielelezo vinatolewa

5. Naweza kupata msaada haraka kiasi gani?
   - Ushauri wa siku ile unapatikana
   - Msaada wa dharura 24/7
   - Jibu ndani ya masaa 1-4

6. Lugha zipi mnazosaidia?
   - Kiingereza, Kiswahili, Kikuyu, Luo, Kalenjin
   - Huduma za tafsiri zinapatikana
   - Mawakili wa lugha nyingi kwenye wafanyikazi

Kwa maswali zaidi, wasiliana nasi kwa info@hakikenya.co.ke` :
      
      `Frequently Asked Questions

1. How much do consultations cost?
   - Quick Legal Query: KES 500 (15 min)
   - Standard Consultation: KES 1,200 (30 min)
   - Extended Session: KES 2,000 (60 min)
   - Free 5-minute initial call available

2. Are the lawyers qualified?
   - All lawyers are verified and registered with LSK
   - Minimum 5 years experience required
   - Specialized in various legal areas

3. How do I book a consultation?
   - Click "Book Now" on any consultation type
   - Fill out the booking form
   - Choose your preferred time slot
   - Pay through M-Pesa, card, or bank transfer

4. What if I can't afford legal fees?
   - Pro bono services available for qualifying cases
   - Payment plans can be arranged
   - Free legal guides and templates provided

5. How quickly can I get help?
   - Same-day consultations available
   - Emergency support 24/7
   - Response within 1-4 hours

6. What languages do you support?
   - English, Swahili, Kikuyu, Luo, Kalenjin
   - Translation services available
   - Multilingual lawyers on staff

For more questions, contact us at info@hakikenya.co.ke`;

    alert(faqContent);
  };

  const showLegalNews = () => {
    const currentLanguage = localStorage.getItem('preferred-language') || 'en';
    const isSwahili = currentLanguage === 'sw';
    
    const newsContent = isSwahili ?
      `Habari Mpya za Kisheria na Sasisho

📰 Maendeleo Mpya ya Kisheria nchini Kenya:

1. Sheria Mpya za Ajira (2024)
   - Sheria za mshahara wa chini zimesasishwa
   - Hatua za ulinzi wa wafanyikazi zimeimarishwa
   - Miongozo mpya ya kazi ya mbali

2. Mabadiliko ya Sheria za Mali
   - Mchakato wa usajili wa ardhi umerahisishwa
   - Sheria mpya za mizozo ya mali
   - Mahitaji ya makubaliano ya kukodisha yamesasishwa

3. Sasisho la Sheria za Familia
   - Mchakato wa talaka umerahisishwa
   - Miongozo ya ulinzi wa watoto imeimarishwa
   - Njia mpya za hesabu ya matunzo

4. Marekebisho ya Sheria za Biashara
   - Usajili wa biashara umerahisishwa
   - Mahitaji mpya ya kufuata kodi
   - Sheria za mikataba zimesasishwa

5. Marekebisho ya Haki ya Jinai
   - Miongozo mpya ya dhamana
   - Haki za watu walioshtakiwa zimeimarishwa
   - Miongozo ya adhabu yamesasishwa

6. Ulinzi wa Watumiaji
   - Sheria kali za mazoea ya biashara
   - Haki za watumiaji zimeimarishwa
   - Njia mpya za kutatua mizozo

Endelea kujua mabadiliko ya kisheria yanayokuhusu.
Kwa uchambuzi wa kina, tembelea sehemu yetu ya miongozo ya kisheria au shauriana na mawakili wetu.

Chanzo: Jumuiya ya Sheria ya Kenya (LSK), Ripoti za Sheria za Kenya` :

      `Latest Legal News & Updates

📰 Recent Legal Developments in Kenya:

1. New Employment Laws (2024)
   - Updated minimum wage regulations
   - Enhanced worker protection measures
   - New guidelines for remote work

2. Property Law Changes
   - Simplified land registration process
   - New regulations for property disputes
   - Updated tenancy agreement requirements

3. Family Law Updates
   - Streamlined divorce procedures
   - Enhanced child custody guidelines
   - New maintenance calculation methods

4. Business Law Reforms
   - Simplified business registration
   - New tax compliance requirements
   - Updated contract law provisions

5. Criminal Justice Reforms
   - New bail guidelines
   - Enhanced rights for accused persons
   - Updated sentencing guidelines

6. Consumer Protection
   - Stricter regulations on business practices
   - Enhanced consumer rights
   - New dispute resolution mechanisms

Stay updated with legal changes that affect you. 
For detailed analysis, visit our legal guides section or consult with our lawyers.

Source: Law Society of Kenya (LSK), Kenya Law Reports`;

    alert(newsContent);
  };

  return (
    <footer className="bg-primary/5 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        {/* Additional Information - Moved to top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center bg-white p-4 rounded-lg shadow-soft">
            <h5 className="font-semibold text-foreground mb-2">🕒 {t('footer.operatingHours')}</h5>
            <p className="text-sm text-muted-foreground">
              {t('hours.weekdays')}: 8:00 AM - 6:00 PM<br />
              {t('hours.weekend')}: 9:00 AM - 3:00 PM<br />
              Sunday: Closed
            </p>
          </div>
          <div className="text-center bg-white p-4 rounded-lg shadow-soft">
            <h5 className="font-semibold text-foreground mb-2">🚨 {t('footer.emergency')}</h5>
            <p className="text-sm text-muted-foreground">
              {t('emergency.subtitle')}:<br />
              {t('emergency.call')}: +254 700 123 456<br />
              {t('emergency.available')}
            </p>
          </div>
          <div className="text-center bg-white p-4 rounded-lg shadow-soft">
            <h5 className="font-semibold text-foreground mb-2">🌍 {t('footer.languages')}</h5>
            <p className="text-sm text-muted-foreground">
              English, Swahili, Kikuyu,<br />
              Luo, Kalenjin, and more<br />
              Translation services available
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Haki Kenya</h3>
                <p className="text-sm text-muted-foreground">Legal Aid Platform</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering Kenyans with accessible legal resources and affordable professional guidance.
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="trust" 
                size="sm" 
                onClick={() => handleQuickLink('/consultations')}
              >
                {t('nav.getHelp')}
              </Button>
            </div>
          </div>

          {/* Legal Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{t('footer.quickLinks')}</h4>
            <div className="space-y-2">
              <button 
                onClick={() => handleQuickLink('/guides')}
                className="block text-sm text-muted-foreground hover:text-primary transition-smooth text-left w-full"
              >
                {t('nav.guides')}
              </button>
              <button 
                onClick={() => handleQuickLink('/templates')}
                className="block text-sm text-muted-foreground hover:text-primary transition-smooth text-left w-full"
              >
                {t('nav.documents')}
              </button>
              <button 
                onClick={showFAQ}
                className="block text-sm text-muted-foreground hover:text-primary transition-smooth text-left w-full"
              >
                {t('footer.faq')}
              </button>
              <button 
                onClick={showLegalNews}
                className="block text-sm text-muted-foreground hover:text-primary transition-smooth text-left w-full"
              >
                {t('footer.legalNews')}
              </button>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Services</h4>
            <div className="space-y-2">
              <button 
                onClick={() => handleQuickLink('/lawyers')}
                className="block text-sm text-muted-foreground hover:text-primary transition-smooth text-left w-full"
              >
                {t('nav.lawyers')}
              </button>
              <button 
                onClick={() => handleQuickLink('/consultations')}
                className="block text-sm text-muted-foreground hover:text-primary transition-smooth text-left w-full"
              >
                {t('nav.consultation')}
              </button>
              <button 
                onClick={() => handleQuickLink('/lawyers')}
                className="block text-sm text-muted-foreground hover:text-primary transition-smooth text-left w-full"
              >
                Pro Bono Directory
              </button>
              <button 
                onClick={() => {
                  // Navigate to consultations with a special flag for legal clinic
                  localStorage.setItem('legalClinicRequest', 'true');
                  handleQuickLink('/consultations');
                }}
                className="block text-sm text-muted-foreground hover:text-primary transition-smooth text-left w-full"
              >
                Legal Clinic
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{t('footer.contact')}</h4>
            <div className="space-y-2">
              <button 
                onClick={() => window.open('mailto:info@hakikenya.co.ke?subject=Inquiry from Haki Kenya Website', '_self')}
                className="block text-sm text-muted-foreground hover:text-primary transition-smooth text-left w-full"
              >
                Email: info@hakikenya.co.ke
              </button>
              <button 
                onClick={() => window.open('tel:+254700123456', '_self')}
                className="block text-sm text-muted-foreground hover:text-primary transition-smooth text-left w-full"
              >
                Phone: +254 700 123 456
              </button>
              <p className="text-sm text-muted-foreground">
                Nairobi, Kenya
              </p>
              <div className="space-y-2">
                <Button 
                  variant="trust" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleQuickLink('/consultations')}
                >
                  {t('nav.getHelp')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 Haki Kenya. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <button 
              onClick={() => {
                // Show privacy policy modal or navigate to privacy page
                alert('Privacy Policy\n\nHaki Kenya respects your privacy. We collect only necessary information to provide legal services and do not share your data with third parties without consent.\n\nFor full details, contact us at privacy@hakikenya.co.ke');
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-smooth"
            >
              {t('footer.privacy')}
            </button>
            <button 
              onClick={() => {
                // Show terms of service modal or navigate to terms page
                alert('Terms of Service\n\nBy using Haki Kenya, you agree to:\n\n1. Provide accurate information\n2. Use services for legal purposes only\n3. Respect lawyer-client confidentiality\n4. Pay consultation fees as agreed\n\nFull terms available at terms@hakikenya.co.ke');
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-smooth"
            >
              {t('footer.terms')}
            </button>
            <button 
              onClick={() => {
                // Show disclaimer modal
                alert('Legal Disclaimer\n\nThis platform provides legal information, not legal advice. For specific legal matters, always consult with a qualified attorney. Haki Kenya is not responsible for outcomes of legal proceedings.');
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-smooth"
            >
              Disclaimer
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-warning/10 rounded-lg border border-warning/20">
          <p className="text-sm text-foreground">
            <strong>Legal Disclaimer:</strong> {t('footer.disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;