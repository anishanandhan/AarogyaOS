import React from 'react';
import { Database, AlertCircle } from 'lucide-react';

const localTranslations = {
  en: {
    title: "Operational Cost Projection (Vellore District)",
    runRate: "ESTIMATED RUN RATE",
    apiHeader: "API Service",
    volumeHeader: "Volume",
    rateHeader: "Unit Pricing",
    costHeader: "Monthly Cost",
    totalProj: "Total Monthly District Projection",
    note: "Scale Note: At ₹12,860/month per district (~$155 USD), the entire state of Tamil Nadu (38 districts) can be run for approximately ₹4.8 Lakhs/month. Cost is optimized through server-side prompt compression and offline local database synchronization fallbacks.",
    gemini: "Gemini 1.5 Flash (Clinical QA & Agents)",
    maps: "Google Maps API (Surge Heatmaps)",
    trans: "Cloud Translation (Regional Localization)",
    voice: "Web Speech APIs (STT / TTS Voice)",
    db: "Offline JSON Database Storage",
    free: "Free (Pure-JS Engine)",
    localDisk: "Local Disk",
    callsMo: "15,000 calls/mo",
    loadsMo: "5,000 loads/mo",
    charsMo: "1.2M chars/mo",
    minsMo: "5,000 mins/mo"
  },
  hi: {
    title: "परिचालन लागत अनुमान (वेल्लोर जिला)",
    runRate: "अनुमानित रन रेट",
    apiHeader: "एपीआई सेवा",
    volumeHeader: "मात्रा",
    rateHeader: "इकाई मूल्य",
    costHeader: "मासिक लागत",
    totalProj: "कुल मासिक जिला अनुमान",
    note: "स्केलिंग नोट: ₹12,860/माह प्रति जिला (~$155 USD) पर, तमिलनाडु के पूरे राज्य (38 जिलों) को लगभग ₹4.8 लाख/माह में चलाया जा सकता है। सर्वर-साइड प्रॉम्प्ट कम्प्रेशन और ऑफलाइन लोकल डेटाबेस सिंक द्वारा लागत अनुकूलित है।",
    gemini: "जेमिनी 1.5 फ़्लैश (क्लीनिकल QA और एजेंट)",
    maps: "गूगल मैप्स एपीआई (सर्ज हीटमैप)",
    trans: "क्लाउड अनुवाद (क्षेत्रीय स्थानीयकरण)",
    voice: "वेब स्पीच एपीआई (STT / TTS वॉयस)",
    db: "ऑफलाइन जेएसओएन डेटाबेस स्टोरेज",
    free: "मुफ़्त (प्योर-जेएस इंजन)",
    localDisk: "स्थानीय डिस्क",
    callsMo: "15,000 कॉल/माह",
    loadsMo: "5,000 लोड/माह",
    charsMo: "1.2M वर्ण/माह",
    minsMo: "5,000 मिनट/माह"
  },
  ta: {
    title: "செயல்பாட்டுச் செலவு கணிப்பு (வேலூர் மாவட்டம்)",
    runRate: "மதிப்பிடப்பட்ட ஓட்ட விகிதம்",
    apiHeader: "API சேவை",
    volumeHeader: "அளவு",
    rateHeader: "அலகு விலை",
    costHeader: "மாதாந்திர செலவு",
    totalProj: "மொத்த மாதாந்திர மாவட்ட கணிப்பு",
    note: "அளவீட்டு குறிப்பு: ஒரு மாவட்டத்திற்கு ₹12,860/மாதம் (~$155 USD) என்ற செலவில், தமிழ்நாடு முழுவதையும் (38 மாவட்டங்கள்) தோராயமாக ₹4.8 லட்சம்/மாதத்தில் இயக்க முடியும். சர்வர்-சைடு கம்ப்ரஷன் மற்றும் ஆஃப்லைன் ஒத்திசைவு மூலம் செலவுகள் குறைக்கப்பட்டுள்ளன.",
    gemini: "Gemini 1.5 Flash (மருத்துவ QA & ஏஜெண்டுகள்)",
    maps: "Google Maps API (பரவல் வரைபடங்கள்)",
    trans: "Cloud Translation (பிராந்திய மொழியாக்கம்)",
    voice: "Web Speech APIs (STT / TTS குரல்)",
    db: "ஆஃப்லைன் JSON தரவுத்தள சேமிப்பு",
    free: "இலவசம் (பூர்வ JS எஞ்சின்)",
    localDisk: "உள்ளூர் வட்டு",
    callsMo: "15,000 அழைப்புகள்/மாதம்",
    loadsMo: "5,000 பதிவிறக்கம்/மாதம்",
    charsMo: "1.2M எழுத்துக்கள்/மாதம்",
    minsMo: "5,000 நிமிடங்கள்/மாதம்"
  }
};

export default function CostAnalysisWidget({ language }) {
  const t = localTranslations[language] || localTranslations.en;

  const costBreakdown = [
    { service: t.gemini, volume: t.callsMo, rate: '$0.075 / 1M input tkn', costINR: 1250 },
    { service: t.maps, volume: t.loadsMo, rate: '$7.00 / 1,000 loads', costINR: 2920 },
    { service: t.trans, volume: t.charsMo, rate: '$20.00 / 1M chars', costINR: 2010 },
    { service: t.voice, volume: t.minsMo, rate: '$16.00 / 1,000 mins', costINR: 6680 },
    { service: t.db, volume: t.localDisk, rate: t.free, costINR: 0 }
  ];

  const totalCost = costBreakdown.reduce((sum, item) => sum + item.costINR, 0);

  return (
    <div className="rounded-xl border border-border-col bg-surface p-5 animate-card" style={{ animationDelay: '380ms' }}>
      <div className="flex items-center justify-between border-b border-border-col pb-3">
        <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Database size={16} className="text-emerald" />
          <span>{t.title}</span>
        </h2>
        <span className="rounded-full bg-emerald/10 border border-emerald/20 px-2 py-0.5 text-[10px] font-bold text-emerald">
          {t.runRate}
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-col/40 text-[10px] text-text-muted uppercase tracking-wider font-mono">
              <th className="pb-2">{t.apiHeader}</th>
              <th className="pb-2 text-right">{t.volumeHeader}</th>
              <th className="pb-2 text-right">{t.rateHeader}</th>
              <th className="pb-2 text-right">{t.costHeader}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-col/20 font-sans text-xs">
            {costBreakdown.map((item, index) => (
              <tr key={index} className="hover:bg-navy/10 font-mono">
                <td className="py-2.5 font-sans font-medium text-text-primary">{item.service}</td>
                <td className="py-2.5 text-right text-text-secondary">{item.volume}</td>
                <td className="py-2.5 text-right text-text-secondary">{item.rate}</td>
                <td className="py-2.5 text-right font-bold text-text-primary">
                  {item.costINR === 0 ? '₹0.00' : `₹${item.costINR.toLocaleString('en-IN')}`}
                </td>
              </tr>
            ))}
            <tr className="bg-navy/20 font-bold border-t border-border-col">
              <td className="py-3 pl-2">{t.totalProj}</td>
              <td className="py-3" />
              <td className="py-3" />
              <td className="py-3 text-right pr-2 text-emerald font-mono text-sm">
                ₹{totalCost.toLocaleString('en-IN')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-info/5 border border-info/20 p-3 font-sans">
        <AlertCircle size={14} className="text-info mt-0.5 shrink-0" />
        <p className="text-[10px] leading-relaxed text-info">
          {t.note}
        </p>
      </div>
    </div>
  );
}
