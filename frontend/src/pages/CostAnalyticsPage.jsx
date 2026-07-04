import React from 'react';
import { Database, TrendingUp, AlertCircle, LineChart, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

const localTranslations = {
  en: {
    title: "System ROI & Cost Projections",
    subtitle: "Detailed operational costs and estimated savings at district scale",
    ratio: "15x Cost-to-Savings Ratio",
    phc: "1. Single PHC / CHC",
    district: "2. District (8 PHCs)",
    state: "3. State-wide (300 PHCs)",
    baseline: "BASELINE",
    activeTarget: "ACTIVE TARGET",
    pilotRecommended: "RECOMMENDED FOR PILOT",
    scaled: "SCALED",
    roiTitle: "Return on Investment (ROI) Projections",
    impactTitle: "Financial Impact Summary",
    totalSavings: "Total Savings Target",
    netMonthly: "Net Monthly Gain",
    scaleNote: "Scalability Note: Moving to the PWA Offline database architecture decreases API billing by caching repeat queries locally and batching ASHA photo-verification loads, reducing GCloud resource requirements by up to 60%.",
    impactDesc: "By deploying AarogyaOS at a district scale (8 PHCs/CHCs), the total operational cost of ₹12,860/month is offset by ₹2,25,000/month in direct savings. This represents a net saving of ₹2.12 Lakhs/month for the district administration.",
    monthlySuffix: "/mo",
    totalPHCProj: "Total Monthly PHC Projection",
    totalDistrictProj: "Total Monthly District Projection",
    totalStateProj: "Total Monthly State Projection",
    apiServiceHeader: "API Service",
    volumeHeader: "Volume",
    rateHeader: "Unit Pricing",
    costHeader: "Monthly Cost",
    gemini: "Gemini 1.5 Flash API",
    maps: "Google Maps JS API",
    trans: "Cloud Translation API",
    voice: "TTS / STT Voice APIs",
    db: "JSON Database Storage",
    free: "Free (Pure-JS Engine)",
    localFile: "Local File",
    zeroCost: "Zero Cost",
    benefit1: "ASHA Field Fraud Prevention",
    desc1: "Photo-audit checks flagging location mismatches",
    benefit2: "Prevented Drug Expirations",
    desc2: "AI Stock redistribution transferring near-expiry drugs",
    benefit3: "Prevented Stock-Out Emergencies",
    desc3: "Early threshold alerts avoiding emergency local buying",
    benefit4: "Optimized Staffing Roster Costs",
    desc4: "Automated attendance escalations reducing pool doctor hires"
  },
  hi: {
    title: "सिस्टम आरओआई और लागत अनुमान",
    subtitle: "जिला स्तर पर विस्तृत परिचालन लागत और अनुमानित बचत",
    ratio: "15 गुना लागत-से-बचत अनुपात",
    phc: "1. एकल पीएचसी / सीएचसी",
    district: "2. जिला (8 पीएचसी)",
    state: "3. राज्य-व्यापी (300 पीएचसी)",
    baseline: "बुनियादी",
    activeTarget: "सक्रिय लक्ष्य",
    pilotRecommended: "पायलट के लिए अनुशंसित",
    scaled: "स्केल्ड",
    roiTitle: "निवेश पर लाभ (आरओआई) अनुमान",
    impactTitle: "वित्तीय प्रभाव सारांश",
    totalSavings: "कुल बचत लक्ष्य",
    netMonthly: "शुद्ध मासिक लाभ",
    scaleNote: "स्केलेबिलिटी नोट: पीडब्ल्यूए ऑफलाइन डेटाबेस आर्किटेक्चर में स्थानांतरित होने से स्थानीय स्तर पर दोहराए गए प्रश्नों को कैश करके और आशा फोटो-सत्यापन लोड को बैच करके एपीआई बिलिंग कम हो जाती है, जिससे जीक्लाउड संसाधन आवश्यकताएं 60% तक कम हो जाती हैं।",
    impactDesc: "जिला स्तर (8 पीएचसी/सीएचसी) पर आरोग्यओएस को तैनात करके, ₹12,860/माह की कुल परिचालन लागत ₹2,25,000/माह की सीधी बचत से ऑफसेट होती है। यह जिला प्रशासन के लिए ₹2.12 लाख/माह की शुद्ध बचत का प्रतिनिधित्व करता है।",
    monthlySuffix: "/माह",
    totalPHCProj: "कुल मासिक पीएचसी अनुमान",
    totalDistrictProj: "कुल मासिक जिला अनुमान",
    totalStateProj: "कुल मासिक राज्य अनुमान",
    apiServiceHeader: "एपीआई सेवा",
    volumeHeader: "मात्रा",
    rateHeader: "इकाई मूल्य",
    costHeader: "मासिक लागत",
    gemini: "जेमिनी 1.5 फ़्लैश एपीआई",
    maps: "गूगल मैप्स जेएस एपीआई",
    trans: "क्लाउड अनुवाद एपीआई",
    voice: "टीटीएस / एसटीटी वॉयस एपीआई",
    db: "जेएसओएन डेटाबेस स्टोरेज",
    free: "मुफ़्त (प्योर-जेएस इंजन)",
    localFile: "स्थानीय फ़ाइल",
    zeroCost: "शून्य लागत",
    benefit1: "आशा फील्ड धोखाधड़ी रोकथाम",
    desc1: "स्थान बेमेल को चिह्नित करने वाले फोटो-ऑडिट चेक",
    benefit2: "दवा समाप्ति रोकथाम",
    desc2: "समाप्ति के करीब की दवाओं को स्थानांतरित करने वाला एआई स्टॉक पुनर्वितरण",
    benefit3: "स्टॉक-आउट आपातकालीन रोकथाम",
    desc3: "आपातकालीन स्थानीय खरीद से बचने वाले प्रारंभिक सीमा अलर्ट",
    benefit4: "अनुकूलित स्टाफिंग रोस्टर लागत",
    desc4: "पूल डॉक्टर नियुक्तियों को कम करने वाले स्वचालित उपस्थिति अलर्ट"
  },
  ta: {
    title: "கணினி ROI & செலவு கணிப்புகள்",
    subtitle: "மாவட்ட அளவில் விரிவான செயல்பாட்டுச் செலவுகள் மற்றும் மதிப்பிடப்பட்ட சேமிப்புகள்",
    ratio: "15 மடங்கு செலவு-சேமிப்பு விகிதம்",
    phc: "1. ஒற்றை PHC / CHC",
    district: "2. மாவட்டம் (8 PHCs)",
    state: "3. மாநிலம் தழுவிய (300 PHCs)",
    baseline: "அடிப்படை",
    activeTarget: "செயலில் உள்ள இலக்கு",
    pilotRecommended: "பைலட் திட்டத்திற்கு பரிந்துரைக்கப்படுகிறது",
    scaled: "விரிவாக்கப்பட்டது",
    roiTitle: "முதலீட்டின் மீதான வருவாய் (ROI) கணிப்புகள்",
    impactTitle: "நிதி தாக்கத்தின் சுருக்கம்",
    totalSavings: "மொத்த சேமிப்பு இலக்கு",
    netMonthly: "நிகர மாதாந்திர லாபம்",
    scaleNote: "அளவிடுதல் குறிப்பு: PWA ஆஃப்லைன் தரவுத்தள கட்டமைப்பிற்கு மாறுவது மீண்டும் மீண்டும் கேட்கும் வினவல்களை உள்நாட்டில் தற்காலிகமாக சேமித்து வைப்பதன் மூலம் API பில்லிங்கைக் குறைக்கிறது மற்றும் ASHA புகைப்பட சரிபார்ப்பு சுமைகளை தொகுப்பாக செய்கிறது, இது GCloud வளத் தேவைகளை 60% வரை குறைக்கிறது.",
    impactDesc: "மாவட்ட அளவில் (8 PHCs/CHCs) AarogyaOS ஐப் பயன்படுத்துவதன் மூலம், ₹12,860/மாதம் மொத்தச் செயல்பாட்டுச் செலவு ₹2,25,000/மாதம் நேரடிச் சேமிப்பால் ஈடுசெய்யப்படுகிறது. இது மாவட்ட நிர்வாகத்திற்கு ₹2.12 லட்சம்/மாதம் நிகர சேமிப்பைக் குறிக்கிறது.",
    monthlySuffix: "/மாதம்",
    totalPHCProj: "மொத்த மாதாந்திர PHC கணிப்பு",
    totalDistrictProj: "மொத்த மாதாந்திர மாவட்ட கணிப்பு",
    totalStateProj: "மொத்த மாதாந்திர மாநில கணிப்பு",
    apiServiceHeader: "API சேவை",
    volumeHeader: "அளவு",
    rateHeader: "அலகு விலை",
    costHeader: "மாதாந்திர செலவு",
    gemini: "Gemini 1.5 Flash API",
    maps: "Google Maps JS API",
    trans: "Cloud Translation API",
    voice: "TTS / STT Voice APIs",
    db: "JSON தரவுத்தள சேமிப்பு",
    free: "இலவசம் (பூர்வ JS எஞ்சின்)",
    localFile: "உள்ளூர் கோப்பு",
    zeroCost: "பூஜ்ஜிய செலவு",
    benefit1: "ஆஷா கள மோசடி தடுப்பு",
    desc1: "இடப் பொருத்தமின்மைகளைக் குறிக்கும் புகைப்படத் தணிக்கை சரிபார்ப்புகள்",
    benefit2: "தடுக்கப்பட்ட மருந்து காலாவதி",
    desc2: "காலாவதியாகும் நிலையிலுள்ள மருந்துகளை மாற்றும் AI சரக்கு மறுவிநியோகம்",
    benefit3: "சரக்கு தீர்ந்துபோகும் அவசரநிலை தடுப்பு",
    desc3: "அவசரக்கால உள்ளூர் வாங்குதல்களைத் தவிர்க்கும் ஆரம்பக்கட்ட எச்சரிக்கைகள்",
    benefit4: "உகந்த பணியாளர்கள் பட்டியல் செலவுகள்",
    desc4: "கூடுதல் மருத்துவர்களின் தேவையைக் குறைக்கும் தானியங்கி வருகை எச்சரிக்கைகள்"
  }
};

export default function CostAnalyticsPage() {
  const { language } = useApp();
  const t = localTranslations[language] || localTranslations.en;

  const phcMonthlyCost = [
    { service: t.gemini, vol: '1,800 calls', rate: '$0.075 / 1M input', cost: 150 },
    { service: t.maps, vol: '600 loads', rate: '$7.00 / 1,000 loads', cost: 350 },
    { service: t.trans, vol: 150000, rate: '$20.00 / 1M chars', cost: 250 },
    { service: t.voice, vol: '600 minutes', rate: '$16.00 / 1,000 mins', cost: 800 },
    { service: t.db, vol: t.localFile, rate: t.zeroCost, cost: 0 }
  ];

  const districtMonthlyCost = phcMonthlyCost.map(item => ({
    ...item,
    vol: typeof item.vol === 'number' ? item.vol * 8 : '8x baseline',
    cost: item.cost * 8
  }));

  const stateMonthlyCost = phcMonthlyCost.map(item => ({
    ...item,
    vol: typeof item.vol === 'number' ? item.vol * 300 : '300x baseline',
    cost: item.cost * 300
  }));

  const totalPhc = phcMonthlyCost.reduce((s, i) => s + i.cost, 0);
  const totalDistrict = districtMonthlyCost.reduce((s, i) => s + i.cost, 0);
  const totalState = stateMonthlyCost.reduce((s, i) => s + i.cost, 0);

  const roiMetrics = [
    { benefit: t.benefit1, description: t.desc1, monthlySavings: 45000, color: 'text-emerald' },
    { benefit: t.benefit2, description: t.desc2, monthlySavings: 65000, color: 'text-emerald' },
    { benefit: t.benefit3, description: t.desc3, monthlySavings: 80000, color: 'text-emerald' },
    { benefit: t.benefit4, description: t.desc4, monthlySavings: 35000, color: 'text-emerald' }
  ];

  const totalSavings = roiMetrics.reduce((s, i) => s + i.monthlySavings, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-border-col pb-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">{t.title}</h1>
          <p className="text-xs text-text-secondary mt-1">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald/10 border border-emerald/20 px-3 py-1 text-xs font-semibold text-emerald">
          <ShieldCheck size={14} />
          <span>{t.ratio}</span>
        </div>
      </div>

      {/* Grid of Scales */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Single PHC */}
        <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-border-col pb-3">
            <h3 className="text-sm font-bold text-text-primary">{t.phc}</h3>
            <span className="text-[10px] font-bold text-text-secondary">{t.baseline}</span>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald">
            ₹{totalPhc.toLocaleString('en-IN')}<span className="text-xs text-text-muted">{t.monthlySuffix}</span>
          </div>
          <div className="space-y-2 text-xs">
            {phcMonthlyCost.map((item, idx) => (
              <div key={idx} className="flex justify-between py-1 border-b border-border-col/20 font-mono">
                <span className="text-text-secondary">{item.service}</span>
                <span className="font-bold text-text-primary">₹{item.cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* District Scale */}
        <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald text-navy text-[8px] font-bold px-2 py-0.5 uppercase tracking-wide">
            {t.pilotRecommended}
          </div>
          <div className="flex justify-between items-center border-b border-border-col pb-3">
            <h3 className="text-sm font-bold text-text-primary">{t.district}</h3>
            <span className="text-[10px] font-bold text-emerald">{t.activeTarget}</span>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald">
            ₹{totalDistrict.toLocaleString('en-IN')}<span className="text-xs text-text-muted">{t.monthlySuffix}</span>
          </div>
          <div className="space-y-2 text-xs">
            {districtMonthlyCost.map((item, idx) => (
              <div key={idx} className="flex justify-between py-1 border-b border-border-col/20 font-mono">
                <span className="text-text-secondary">{item.service}</span>
                <span className="font-bold text-text-primary">₹{item.cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* State Scale */}
        <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-border-col pb-3">
            <h3 className="text-sm font-bold text-text-primary">{t.state}</h3>
            <span className="text-[10px] font-bold text-text-secondary">{t.scaled}</span>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald">
            ₹{totalState.toLocaleString('en-IN')}<span className="text-xs text-text-muted">{t.monthlySuffix}</span>
          </div>
          <div className="space-y-2 text-xs">
            {stateMonthlyCost.map((item, idx) => (
              <div key={idx} className="flex justify-between py-1 border-b border-border-col/20 font-mono">
                <span className="text-text-secondary">{item.service}</span>
                <span className="font-bold text-text-primary">₹{item.cost}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI & Benefit Matrix */}
      <div className="rounded-xl border border-border-col bg-surface p-5">
        <div className="flex items-center gap-2 border-b border-border-col pb-3 mb-4">
          <LineChart size={16} className="text-emerald" />
          <h2 className="text-sm font-bold text-text-primary">{t.roiTitle}</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Benefit Cards */}
          <div className="space-y-3">
            {roiMetrics.map((m, idx) => (
              <div key={idx} className="rounded-lg border border-border-col bg-navy/30 p-3.5 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">{m.benefit}</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">{m.description}</p>
                </div>
                <div className="text-right font-mono font-bold text-emerald text-xs shrink-0">
                  +₹{m.monthlySavings.toLocaleString('en-IN')}{t.monthlySuffix}
                </div>
              </div>
            ))}
          </div>

          {/* ROI Chart Summary */}
          <div className="rounded-lg border border-border-col bg-navy/20 p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <TrendingUp size={14} className="text-emerald" />
                <span>{t.impactTitle}</span>
              </h4>
              <p className="text-[11px] text-text-secondary leading-relaxed font-sans">
                {t.impactDesc}
              </p>
            </div>
            
            <div className="mt-4 border-t border-border-col/40 pt-3 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-text-secondary font-sans uppercase">{t.totalSavings}</span>
                <p className="text-lg font-mono font-bold text-emerald">₹{totalSavings.toLocaleString('en-IN')}<span className="text-xs font-normal text-text-muted">{t.monthlySuffix}</span></p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-text-secondary font-sans uppercase">{t.netMonthly}</span>
                <p className="text-lg font-mono font-bold text-emerald">+₹{(totalSavings - totalDistrict).toLocaleString('en-IN')}<span className="text-xs font-normal text-text-muted">{t.monthlySuffix}</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-info/5 border border-info/20 p-3 text-xs text-info font-sans">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <p className="leading-relaxed text-[11px]">
            {t.scaleNote}
          </p>
        </div>
      </div>
    </div>
  );
}
