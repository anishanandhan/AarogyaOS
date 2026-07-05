import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import {
  Activity,
  Shield,
  Building,
  Heart,
  Beaker,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Mic,
  ArrowRight,
  Database,
  Globe,
  Settings,
  Users,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Play
} from 'lucide-react';

export default function LandingPage() {
  const { language, setLanguage } = useApp();
  const navigate = useNavigate();
  const [selectedPersona, setSelectedPersona] = useState('admin');

  // Simple locale map for landing page header/hero
  const content = {
    en: {
      brand: "AarogyaOS",
      tagline: "Unified Public Healthcare Operations Platform",
      description: "Strengthening Primary Health Centres (PHCs), Community Health Centres (CHCs), and District Hospitals through real-time operational intelligence, medicine inventory monitoring, workforce attendance tracking, and laboratory diagnostics audits.",
      launchPortal: "Launch System Portal",
      viewMap: "View Public Health Map",
      exploreArchitecture: "View System Architecture",
      featureBadges: ["Essential Medicines", "Patient Queue & Beds", "Workforce Attendance", "Community Health", "Diagnostics Audit", "Google Cloud Stack"],
      kpiTitle: "District Live Command Center Preview",
      kpis: [
        { label: "Connected Facilities", value: "184", sub: "PHCs & CHCs" },
        { label: "Medicine Availability", value: "96%", sub: "Essential drugs" },
        { label: "Doctors Present", value: "91%", sub: "On-duty today" },
        { label: "Available Beds", value: "1,286", sub: "District capacity" },
        { label: "OPD Visits Today", value: "4,827", sub: "Total footfall" },
        { label: "High Priority Alerts", value: "9", sub: "Requires action" }
      ],
      problemsTitle: "Operational Gaps We Resolve",
      problems: [
        { title: "Medicine Stock-outs", desc: "Manual stock logs cause delayed reorders and critical drug depletions at remote sub-centres." },
        { title: "Long Patient Waiting Times", desc: "No real-time patient queue monitoring leads to facility overcrowding and uneven load distribution." },
        { title: "Doctor Absenteeism", desc: "Lack of central tracking leads to unstaffed critical shifts without timely reallocations." },
        { title: "Unused Bed Capacities", desc: "Referrals fail because administrators lack immediate visibility into active ward vacancies." },
        { title: "Manual Reporting Overhead", desc: "Paper-based registers consume hours of clinical time, leading to stale telemetry and delayed decisions." },
        { title: "Vector Breeding Risks", desc: "Traditional epidemiological responses are reactive rather than predictive of weather-driven outbreaks." }
      ]
    },
    hi: {
      brand: "आरोग्यOS",
      tagline: "एकीकृत सार्वजनिक स्वास्थ्य संचालन मंच",
      description: "वास्तविक समय के परिचालन इंटेलिजेंस, दवा सूची की निगरानी, ​​कार्यबल उपस्थिति ट्रैकिंग और प्रयोगशाला डायग्नोस्टिक्स ऑडिट के माध्यम से प्राथमिक स्वास्थ्य केंद्रों (PHCs), सामुदायिक स्वास्थ्य केंद्रों (CHCs) और जिला अस्पतालों को सुदृढ़ बनाना।",
      launchPortal: "सिस्टम पोर्टल लॉन्च करें",
      viewMap: "जन स्वास्थ्य मानचित्र देखें",
      exploreArchitecture: "सिस्टम आर्किटेक्चर देखें",
      featureBadges: ["आवश्यक दवाएं", "रोगी प्रवाह और बिस्तर", "कार्यबल नियोजन", "सामुदायिक स्वास्थ्य", "डायग्नोस्टिक्स ऑडिट", "गूगल क्लाउड स्टैक"],
      kpiTitle: "जिला लाइव कमांड सेंटर पूर्वावलोकन",
      kpis: [
        { label: "जुड़े हुए केंद्र", value: "184", sub: "PHCs और CHCs" },
        { label: "दवा की उपलब्धता", value: "96%", sub: "आवश्यक दवाएं" },
        { label: "उपस्थित डॉक्टर", value: "91%", sub: "आज ड्यूटी पर" },
        { label: "उपलब्ध बिस्तर", value: "1,286", sub: "जिला क्षमता" },
        { label: "आज OPD विज़िट", value: "4,827", sub: "कुल रोगी" },
        { label: "उच्च प्राथमिकता अलर्ट", value: "9", sub: "कार्रवाई की आवश्यकता" }
      ],
      problemsTitle: "परिचालन संबंधी कमियां जिन्हें हम हल करते हैं",
      problems: [
        { title: "दवाओं की कमी", desc: "मैन्युअल स्टॉक लॉग के कारण दूरदराज के केंद्रों पर आवश्यक दवाओं की कमी हो जाती है।" },
        { title: "लंबी प्रतीक्षा अवधि", desc: "वास्तविक समय में कतार निगरानी न होने से केंद्रों पर अत्यधिक भीड़ हो जाती है।" },
        { title: "डॉक्टरों की अनुपस्थिति", desc: "केंद्रीय ट्रैकिंग के अभाव में महत्वपूर्ण शिफ्टों में डॉक्टर अनुपस्थित रह जाते हैं।" },
        { title: "अनुपयोगी बिस्तर क्षमता", desc: "प्रशासकों को वार्ड में खाली बिस्तरों की तत्काल जानकारी न होने से रेफरल विफल हो जाते हैं।" },
        { title: "मैन्युअल रिपोर्टिंग का बोझ", desc: "कागजी रजिस्टरों के कारण डेटा पुराना हो जाता है और त्वरित निर्णय लेने में देरी होती है।" },
        { title: "मच्छर जनित बीमारियों का खतरा", desc: "पारंपरिक प्रतिक्रियाएं मौसम-जनित बीमारियों के प्रति पूर्वानुमान लगाने में अक्षम होती हैं।" }
      ]
    },
    ta: {
      brand: "ஆரோக்யாOS",
      tagline: "ஒருங்கிணைந்த பொது சுகாதார செயல்பாட்டு தளம்",
      description: "நிகழ்நேர செயல்பாட்டு நுண்ணறிவு, மருந்து சரக்கு கண்காணிப்பு, பணியாளர் வருகை கண்காணிப்பு மற்றும் ஆய்வக நோயறிதல் தணிக்கைகள் மூலம் ஆரம்ப சுகாதார நிலையங்கள் (PHCs), சமூக சுகாதார நிலையங்கள் (CHCs) மற்றும் மாவட்ட மருத்துவமனைகளை வலுப்படுத்துதல்.",
      launchPortal: "சிஸ்டம் போர்ட்டலைத் தொடங்கு",
      viewMap: "பொது சுகாதார வரைபடத்தைப் பார்",
      exploreArchitecture: "கணினி கட்டமைப்பைப் பார்",
      featureBadges: ["அத்தியாவசிய மருந்துகள்", "நோயாளி ஓட்டம் & படுக்கைகள்", "பணியாளர் திட்டமிடல்", "சமூக ஆரோக்கியம்", "நோயறிதல் தணிக்கை", "கூகிள் கிளவுட் ஸ்டேக்"],
      kpiTitle: "மாவட்ட நேரடி கட்டளை மைய முன்னோட்டம்",
      kpis: [
        { label: "இணைக்கப்பட்ட நிலையங்கள்", value: "184", sub: "PHCs & CHCs" },
        { label: "மருந்து இருப்பு", value: "96%", sub: "அத்தியாவசிய மருந்துகள்" },
        { label: "மருத்துவர்கள் வருகை", value: "91%", sub: "இன்று பணியில்" },
        { label: "கிடைக்கும் படுக்கைகள்", value: "1,286", sub: "மாவட்ட கொள்ளளவு" },
        { label: "இன்றைய OPD வருகை", value: "4,827", sub: "மொத்த நோயாளிகள்" },
        { label: "உயர் முன்னுரிமை எச்சரிக்கைகள்", value: "9", sub: "நடவடிக்கை தேவை" }
      ],
      problemsTitle: "நாங்கள் தீர்க்கும் செயல்பாட்டு இடைவெளிகள்",
      problems: [
        { title: "மருந்து தட்டுப்பாடு", desc: "கைமுறை சரக்கு பதிவுகளால் மருந்து விநியோகங்கள் தாமதமாகி அத்தியாவசிய மருந்துகள் தீர்ந்துவிடுகின்றன." },
        { title: "நீண்ட நோயாளி காத்திருப்பு நேரம்", desc: "நோயாளி வரிசை கண்காணிப்பு இல்லாததால் நிலையங்களில் நெரிசலும் சமமற்ற சுமை பகிர்வும் ஏற்படுகிறது." },
        { title: "மருத்துவர்கள் இல்லாமை", desc: "மத்திய கண்காணிப்பு இல்லாததால் தற்காலிக மருத்துவர்கள் நியமனம் இன்றி முக்கிய ஷிப்டுகள் காலியாகின்றன." },
        { title: "பயன்படுத்தப்படாத படுக்கைகள்", desc: "படுக்கை காலியிடங்கள் பற்றிய உடனடித் தகவல் இல்லாததால் அவசர பரிந்துரைகள் தோல்வியடைகின்றன." },
        { title: "கைமுறை அறிக்கையிடல் சுமை", desc: "காகித பதிவேடுகள் மருத்துவர்களின் நேரத்தை உண்பதால் தரவுகள் காலாவதியாகி முடிவெடுப்பதில் தாமதமாகிறது." },
        { title: "கொசு உற்பத்தி அபாயம்", desc: "பாரம்பரிய நோய் கண்காணிப்பு முறைகள் வானிலை அடிப்படையிலான கொசு உற்பத்தியை முன்கூட்டியே கணிக்க இயலாது." }
      ]
    }
  };

  const t = content[language] || content.en;

  const personas = {
    admin: {
      title: language === 'hi' ? "जिला स्वास्थ्य प्रशासन" : language === 'ta' ? "மாவட்ட சுகாதார நிர்வாகம்" : "District Health Administration",
      subtitle: language === 'hi' ? "जिला चिकित्सा अधिकारियों (DMOs) के लिए" : language === 'ta' ? "மாவட்ட மருத்துவ அதிகாரிகளுக்கு (DMOs)" : "For District Medical Officers (DMOs)",
      desc: language === 'hi' ? "पूरे जिले के प्राथमिक एवं सामुदायिक स्वास्थ्य केंद्रों की निगरानी एवं संसाधन प्रबंधन।" : language === 'ta' ? "முழு மாவட்டத்தின் ஆரம்ப மற்றும் சமூக சுகாதார நிலையங்களின் கண்காணிப்பு மற்றும் வள மேலாண்மை." : "District-wide surveillance, resource distribution, and operational metrics across all local clinical nodes.",
      points: language === 'hi' ? [
        "दवाओं की उपलब्धता और कमी के अलर्ट का लाइव विश्लेषण",
        "अस्थायी रूप से डॉक्टरों का पुनर्वितरण और ड्यूटी ओवरराइड्स",
        "लाइव मौसम आधारित डेंगू/मलेरिया प्रकोप सूचकांक विश्लेषण",
        "वित्तीय लागत लेखापरीक्षा और वास्तविक समय परिचालन अलर्ट"
      ] : language === 'ta' ? [
        "மருந்து இருப்பு மற்றும் பற்றாக்குறை எச்சரிக்கைகளின் நேரடி பகுப்பாய்வு",
        "தற்காலிக மருத்துவர்கள் மறுபகிர்வு மற்றும் வருகை பதிவேடு மேலெழுது",
        "நிகழ்நேர வானிலை சார்ந்த டெங்கு/மலேரியா பரவல் கணிப்புகள்",
        "நிதி செலவு கணக்காய்வு மற்றும் உடனடி செயல்பாட்டு எச்சரிக்கைகள்"
      ] : [
        "Live analysis of essential drug availabilities and stock warnings",
        "Workforce redistribution and automated duty re-assignments",
        "Meteorological environmental risk indexes (Dengue and Malaria breeding)",
        "Financial run-rate projections and centralized telemetry alerts"
      ]
    },
    officer: {
      title: language === 'hi' ? "PHC/CHC चिकित्सा अधिकारी" : language === 'ta' ? "PHC/CHC மருத்துவ அதிகாரிகள்" : "PHC & CHC Medical Officers",
      subtitle: language === 'hi' ? "स्थानीय स्वास्थ्य केंद्र प्रबंधकों के लिए" : language === 'ta' ? "உள்ளூர் சுகாதார நிலைய மேலாளர்களுக்கு" : "For Clinical Directors & Site Managers",
      desc: language === 'hi' ? "स्वास्थ्य केंद्र स्तर पर दैनिक ओपीडी, दवा इन्वेंट्री और स्टाफ की स्थिति का प्रबंधन।" : language === 'ta' ? "சுகாதார நிலைய அளவில் தினசரி ஓபிடி, மருந்து சரக்கு மற்றும் ஊழியர்களின் வருகை மேலாண்மை." : "On-site command dashboard to track outpatient registrations, ward vacancies, and local testing kit readiness.",
      points: language === 'hi' ? [
        "दैनिक ओपीडी पंजीकरण और रोगी कतार प्रबंधन",
        "दवा स्टॉक अपडेट लॉगिंग और स्वचालित रीऑर्डर अनुरोध",
        "वार्ड क्षमता निगरानी और पैनिक रेफरल समन्वय",
        "स्थानीय प्रयोगशाला जांच किट की उपलब्धता की जांच"
      ] : language === 'ta' ? [
        "தினசரி ஓபிடி பதிவுகள் மற்றும் நோயாளிகளின் வரிசை மேலாண்மை",
        "மருந்து சரக்கு புதுப்பித்தல் மற்றும் தானியங்கி மறு ஆர்டர் கோரிக்கைகள்",
        "படுக்கை வசதிகள் கண்காணிப்பு மற்றும் அவசர பரிந்துரை ஒருங்கிணைப்பு",
        "உள்ளூர் ஆய்வக சோதனை கருவிகளின் இருப்பு தணிக்கை"
      ] : [
        "Daily Outpatient Department (OPD) queue and registration metrics",
        "Essential drug logs and automated low-stock supply alerts",
        "Bed vacancy registry for emergency patient referal coordination",
        "Diagnostics checklist audits and laboratory kit readiness tracking"
      ]
    },
    asha: {
      title: language === 'hi' ? "सामुदायिक स्वास्थ्य कार्यकर्ता" : language === 'ta' ? "சமூக சுகாதார பணியாளர்கள்" : "Community Health Workers",
      subtitle: language === 'hi' ? "आशा कार्यकर्ताओं (ASHA Workers) के लिए" : language === 'ta' ? "ஆஷா பணியாளர்களுக்கு (ASHA Workers)" : "For ASHA Workers & Field Supervisors",
      desc: language === 'hi' ? "घर-घर जाकर गर्भवती महिलाओं, टीकाकरण और टीबी मरीजों की स्वास्थ्य सेवा की निगरानी।" : language === 'ta' ? "வீடு வீடாகச் சென்று கர்ப்பிணி தாய்மார்கள், தடுப்பூசி மற்றும் காசநோய் நோயாளிகள் கண்காணிப்பு." : "doorstep visit logging, pregnancy care, immunization checkups, and voice-assisted health queries.",
      points: language === 'hi' ? [
        "घर-घर विज़िट के लिए अनुसूचित कार्यों की दैनिक सूची",
        "वाणीबॉट (VaaniBot) क्षेत्रीय भाषा वॉयस असिस्टेंट समर्थन",
        "तस्वीर और जीपीएस के माध्यम से विज़िट का तत्काल सत्यापन",
        "संदेहास्पद या निष्क्रिय लॉग्स की ऑटो-चेक सिस्टम"
      ] : language === 'ta' ? [
        "வீடு வீடாகச் செல்ல வேண்டிய தினசரி பணிகள் அட்டவணை",
        "வாணிபாட் (VaaniBot) வட்டார மொழி குரல் உதவி ஆதரவு",
        "புகைப்படம் மற்றும் ஜிபிஎஸ் மூலம் வருகை சரிபார்ப்பு",
        "சந்தேகத்திற்குரிய அல்லது முடங்கிய பதிவுகளின் தானியங்கி தணிக்கை"
      ] : [
        "Daily task scheduling for doorstep maternal care and vaccinations",
        "VaaniBot integration for regional language voice-assisted queries",
        "Geotagged photographic verification of household health audits",
        "Absence alert queues and suspicious log checking systems"
      ]
    },
    technician: {
      title: language === 'hi' ? "प्रयोगशाला तकनीशियन" : language === 'ta' ? "ஆய்வக தொழில்நுட்ப வல்லுநர்கள்" : "Laboratory Technicians",
      subtitle: language === 'hi' ? "नैदानिक जांच स्टाफ के लिए" : language === 'ta' ? "நோயறிதல் சோதனை ஊழியர்களுக்கு" : "For Diagnostics & Testing Personnel",
      desc: language === 'hi' ? "प्रयोगशाला में उपलब्ध नैदानिक परीक्षण किट और रीएजेंट स्टॉक का ऑडिट।" : language === 'ta' ? "ஆய்வக சோதனை கருவிகள் மற்றும் வினைப்பொருள் சரக்கு தணிக்கை." : "Diagnostic kit inventory registry and test availability audit grids across 10 vital pathology parameters.",
      points: language === 'hi' ? [
        "सीबीसी, हीमोग्लोबिन, डेंगू एनएस1 जैसी महत्वपूर्ण जांचों का ऑडिट",
        "अस्पताल में जांच उपलब्धता स्थिति का दैनिक टॉगल अपडेट",
        "रीएजेंट और टेस्ट किट की कमी के लिए त्वरित चेतावनी सूचना",
        "जिला-स्तरीय डायग्नोस्टिक्स ग्रिड का रीयल-टाइम सिंक"
      ] : language === 'ta' ? [
        "சிபிசி, ஹீமோகுளோபின், டெங்கு என்எஸ்1 போன்ற முக்கிய சோதனைகள் தணிக்கை",
        "நிலையத்தில் சோதனை கிடைக்கும் தன்மை பற்றிய தினசரி புதுப்பிப்பு",
        "வினைப்பொருள் மற்றும் சோதனை கருவிகள் பற்றாக்குறை எச்சரிக்கைகள்",
        "மாவட்ட அளவிலான நோயறிதல் தணிக்கை பதிவுவேடு ஒத்திசைவு"
      ] : [
        "Audit logs for vital parameters (CBC, Glucose, Dengue NS1, HbA1c)",
        "Daily checkmark toggles for active facility diagnostic capabilities",
        "Alert pipelines for chemical reagent deficits and missing kits",
        "Real-time synchronization into the District Diagnostics Matrix"
      ]
    }
  };

  const techStack = [
    {
      category: language === 'hi' ? "आर्टिफिशियल इंटेलिजेंस (AI)" : language === 'ta' ? "செயற்கை நுண்ணறிவு (AI)" : "AI & Intelligence Layer",
      color: "border-blue-500/20 bg-blue-500/5",
      iconColor: "text-blue-600",
      items: [
        { name: "Gemini 1.5 Flash API", desc: "Multi-agent orchestration and contextual text analysis" },
        { name: "Vertex AI Agents", desc: "Cognitive task reasoning for workforce scheduling" },
        { name: "Google AI Studio", desc: "Agent prompt construction and prototyping workspace" }
      ]
    },
    {
      category: language === 'hi' ? "भाषा और वॉयस सेवाएं" : language === 'ta' ? "மொழி மற்றும் குரல் சேவைகள்" : "Voice & Language Services",
      color: "border-emerald-500/20 bg-emerald-500/5",
      iconColor: "text-emerald-600",
      items: [
        { name: "Cloud Speech-to-Text", desc: "Regional voice ingestion (Tamil/Hindi) conversion" },
        { name: "Cloud Text-to-Speech", desc: "Natural audio response generation for users" },
        { name: "Google Cloud Translation API", desc: "Dynamic translation of telemetry alerts in real-time" }
      ]
    },
    {
      category: language === 'hi' ? "मल्टीमॉडल विज़न ऑडिट" : language === 'ta' ? "பல்வகை பார்வை தணிக்கை" : "Multimodal Vision",
      color: "border-amber-500/20 bg-amber-500/5",
      iconColor: "text-amber-600",
      items: [
        { name: "Gemini Vision API", desc: "ASHA visit geotagged photo proof integrity audits" },
        { name: "Vertex AI Vision", desc: "Automated analysis of community infrastructure images" }
      ]
    },
    {
      category: language === 'hi' ? "भौगोलिक और मानचित्र" : language === 'ta' ? "புவியியல் & வரைபடம்" : "Geospatial & Mapping",
      color: "border-indigo-500/20 bg-indigo-500/5",
      iconColor: "text-indigo-600",
      items: [
        { name: "Google Maps Platform", desc: "Dynamic heatmaps of clinical nodes and stock depletions" },
        { name: "Google Earth Engine", desc: "Integration for satellite climate and vegetation data" }
      ]
    },
    {
      category: language === 'hi' ? "क्लाउड बैकएंड और डेटा" : language === 'ta' ? "கிளவுட் உள்கட்டமைப்பு & தரவு" : "Cloud Infrastructure & Data",
      color: "border-purple-500/20 bg-purple-500/5",
      iconColor: "text-purple-600",
      items: [
        { name: "Firebase Hosting & Auth", desc: "Secure role-based dashboard access and fast hosting" },
        { name: "Cloud Functions / Run", desc: "Background serverless jobs and statistical solvers" },
        { name: "BigQuery Data Platform", desc: "Aggregated state demographic and clinical analytics" }
      ]
    },
    {
      category: language === 'hi' ? "संचार और मोबाइल" : language === 'ta' ? "தொடர்பு & மொபைல்" : "Mobile & Communications",
      color: "border-pink-500/20 bg-pink-500/5",
      iconColor: "text-pink-600",
      items: [
        { name: "WhatsApp Business API", desc: "VaaniBot integration for regional language messages" },
        { name: "AarogyaOS SMS Gateway", desc: "High-priority SMS alerts for critical stock outages" }
      ]
    }
  ];

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Government-style Header Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <img
                src="/aarogyaos_logo.png"
                alt="AarogyaOS Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                {t.brand}
              </span>
            </div>
          </div>

          {/* Navigation Links (Anchors) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#overview" className="hover:text-blue-600 transition-colors">Overview</a>
            <a href="#dashboard" className="hover:text-blue-600 transition-colors">Dashboard</a>
            <a href="#personas" className="hover:text-blue-600 transition-colors">Stakeholders</a>
            <a href="#technology" className="hover:text-blue-600 transition-colors">Technology</a>
            <a href="#architecture" className="hover:text-blue-600 transition-colors">Architecture</a>
          </nav>

          {/* Quick Language Toggle & Action Button */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
              {['en', 'hi', 'ta'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`rounded-md px-2 py-1 text-xs font-bold transition-all cursor-pointer ${
                    language === lang 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>{t.launchPortal}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50/50 via-white to-slate-50 px-6 py-20 lg:py-28" id="overview">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
                <Sparkles size={13} className="text-blue-600" />
                <span>Department of Health & Family Welfare Initiative</span>
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
                AarogyaOS
                <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 leading-tight">
                  {t.tagline}
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {t.description}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
                >
                  <span>{t.launchPortal}</span>
                  <ArrowRight size={16} />
                </button>
                <a
                  href="#architecture"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <span>{t.exploreArchitecture}</span>
                </a>
              </div>

              {/* Feature badges row */}
              <div className="pt-8 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 sm:grid-cols-3">
                  {t.featureBadges.map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <CheckCircle2 size={15} className="text-emerald-600" />
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Illustration: Clean government Operations Panel mock + real-world clinical backdrop */}
            <div className="lg:col-span-5 relative h-[450px] flex items-center justify-center">
              {/* Back Image Layer */}
              <div className="absolute top-0 right-0 w-[85%] h-[80%] rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
                <img
                  src="/images/13.jpeg"
                  alt="Vellore District Hospital Backing"
                  className="w-full h-full object-cover brightness-95 filter"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
              </div>

              {/* Front Floating Dashboard Card */}
              <div className="absolute bottom-0 left-0 w-[90%] rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-md p-5 shadow-2xl">
                {/* Header preview */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">VELLORE DISTRICT GRIDS</span>
                </div>
                
                {/* Visual simulated UI element */}
                <div className="space-y-3">
                  <div className="rounded-lg bg-slate-55 border border-slate-100 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">PHC Tambaram</span>
                      <span className="rounded-full bg-red-100 border border-red-200 px-2 py-0.5 text-[8px] font-bold text-red-700">CRITICAL</span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded bg-white border border-slate-100 p-1.5">
                        <span className="block text-[8px] font-semibold text-slate-400">MEDICINES</span>
                        <span className="text-[10px] font-bold text-slate-800">34%</span>
                      </div>
                      <div className="rounded bg-white border border-slate-100 p-1.5">
                        <span className="block text-[8px] font-semibold text-slate-400">BEDS</span>
                        <span className="text-[10px] font-bold text-slate-800">4 / 12</span>
                      </div>
                      <div className="rounded bg-white border border-slate-100 p-1.5">
                        <span className="block text-[8px] font-semibold text-slate-400">DOCTORS</span>
                        <span className="text-[10px] font-bold text-slate-800">0 / 3</span>
                      </div>
                    </div>
                    <div className="mt-2 border-t border-slate-100 pt-1.5 flex items-center justify-between text-[9px] text-slate-500">
                      <span>AI Alert: Out of ORS tablets in 24h</span>
                      <span className="text-blue-600 font-bold">Transfer ORS &rarr;</span>
                    </div>
                  </div>

                  {/* Micro list */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-[10px]">
                      <span className="font-semibold text-slate-700">Weekly Forecast (Outpatients)</span>
                      <span className="font-mono text-slate-500">+18% Surge risk</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-[10px]">
                      <span className="font-semibold text-slate-700">ASHA Workers Coverage</span>
                      <span className="text-emerald-700 font-bold">96% Verified visits</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Absolute background decoration */}
              <div className="absolute -top-6 -right-6 -bottom-6 -left-6 -z-10 rounded-3xl bg-blue-100/30 blur-2xl"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Live Command Center Preview */}
      <section className="bg-slate-900 text-white px-6 py-20" id="dashboard">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">REAL-TIME COMMAND</h2>
            <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t.kpiTitle}
            </h3>
            <p className="text-slate-400 text-sm">
              Operational metrics aggregated across the district in real-time. No mock calculations; powered by live databases.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {t.kpis.map((kpi, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-center shadow-lg">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</span>
                <span className="mt-3 block text-3xl font-extrabold text-white tracking-tight">{kpi.value}</span>
                <span className="mt-1 block text-[10px] text-slate-400 font-medium">{kpi.sub}</span>
              </div>
            ))}
          </div>

          {/* Interactive view button */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              <Building size={16} />
              <span>Launch Live Command Center Panel</span>
            </button>
          </div>
        </div>
      </section>

      {/* Problems We Solve Grid */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">CHALLENGES ADDRESSED</h2>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {t.problemsTitle}
            </h3>
            <p className="text-slate-500 text-sm">
              Replacing fragmented reporting with unified digital management systems at every facility level.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.problems.map((prob, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50 p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <h4 className="text-base font-bold text-slate-900">{prob.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{prob.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Persona Walkthrough Tabs */}
      <section className="px-6 py-20 bg-slate-50" id="personas">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">SYSTEM WORKFLOWS</h2>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Custom Portals for Every Level
            </h3>
            <p className="text-slate-500 text-sm">
              Select a stakeholder role to see how AarogyaOS assists clinical and administrative tasks.
            </p>
          </div>

          {/* Switch buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {Object.keys(personas).map(key => (
              <button
                key={key}
                onClick={() => setSelectedPersona(key)}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold shadow-sm transition-all cursor-pointer ${
                  selectedPersona === key
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-800'
                }`}
              >
                {personas[key].title}
              </button>
            ))}
          </div>

          {/* Persona Card Display */}
          <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
              
              {/* Text info */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {personas[selectedPersona].subtitle}
                </span>
                <h4 className="text-2xl font-bold text-slate-950">
                  {personas[selectedPersona].title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {personas[selectedPersona].desc}
                </p>
                <ul className="space-y-2 pt-2">
                  {personas[selectedPersona].points.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <CheckCircle2 size={16} className="mt-0.5 text-emerald-600 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual representation utilizing preloaded operational images */}
              <div className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden h-72 shadow-lg group">
                {/* Background Image */}
                <img
                  src={`/images/${
                    selectedPersona === 'admin' ? '9.jpeg' :
                    selectedPersona === 'officer' ? '10.jpeg' :
                    selectedPersona === 'asha' ? '11.jpeg' : '12.jpeg'
                  }`}
                  alt={personas[selectedPersona].title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Foreground Overlay Card (semi-transparent blur) */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-bold tracking-widest text-white uppercase bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-md shadow-sm">
                      {selectedPersona === 'admin' ? 'District Map Telemetry' :
                       selectedPersona === 'officer' ? 'Inventory Control' :
                       selectedPersona === 'asha' ? 'VaaniBot Voice Assistant' : 'Diagnostics Audit'}
                    </span>
                  </div>

                  {/* Persona-specific interactive widgets overlay */}
                  <div className="space-y-2 mt-auto">
                    {selectedPersona === 'admin' && (
                      <div className="rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 space-y-1.5 shadow-lg">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400">
                          <MapPin size={12} className="animate-bounce" />
                          <span>Vellore Block Telemetry Active</span>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-300 font-mono">
                          <span>🟢 Walajah (Nominal)</span>
                          <span>🔴 Tambaram (Critical Stock)</span>
                        </div>
                      </div>
                    )}
                    {selectedPersona === 'officer' && (
                      <div className="rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 space-y-2 shadow-lg">
                        <div className="flex justify-between text-[10px] text-slate-300">
                          <span className="font-bold">Paracetamol Stocks</span>
                          <span className="text-red-400 font-bold">0.9 Days Left</span>
                        </div>
                        <div className="h-1 w-full rounded bg-slate-800 overflow-hidden">
                          <div className="h-full w-[15%] bg-red-500"></div>
                        </div>
                      </div>
                    )}
                    {selectedPersona === 'asha' && (
                      <div className="rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 space-y-1.5 text-center shadow-lg">
                        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white animate-pulse">
                          <Mic size={12} />
                        </div>
                        <p className="text-[10px] text-slate-200 italic mt-1">"இன்று மருத்துவர் இருக்கிறாரா?"</p>
                      </div>
                    )}
                    {selectedPersona === 'technician' && (
                      <div className="rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 space-y-1 shadow-lg">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-200">
                          <CheckCircle2 size={10} className="text-emerald-400" />
                          <span>CBC Reagents Verified</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => navigate('/login')}
                      className="w-full flex items-center justify-between rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-2 text-[11px] font-bold text-white transition-all cursor-pointer shadow-md"
                    >
                      <span>Access Portal Panel</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Field Gallery Showcase */}
      <section className="px-6 py-20 bg-slate-100" id="gallery">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">FIELD OPERATIONS</h2>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              AarogyaOS in Action
            </h3>
            <p className="text-slate-500 text-sm">
              Real-world documentation of public health operations, clinical audits, diagnostics, and ASHA field visits enabled by our portal.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { id: '1', title: 'Essential Medicines Stockpile', desc: 'District-wide public health drug logistics.' },
              { id: '2', title: 'Clinical Operations Auditing', desc: 'OPD patient traffic & wait time metrics.' },
              { id: '3', title: 'Multimodal ASHA Visit Audit', desc: 'Household health survey verification.' },
              { id: '4', title: 'Facial Attendance Checkpoint', desc: 'Real-time doctor roster verification.' },
              { id: '5', title: 'Laboratory Diagnostics Audit', desc: 'Test kits and critical reagent counters.' },
              { id: '6', title: 'Integrated Public Health Map', desc: 'Spatial epidemiological heatmaps.' },
              { id: '7', title: 'ASHA Field Telemetry Log', desc: 'Geo-tracked community health coverage.' },
              { id: '8', title: 'Government Command Center', desc: 'Aggregated district executive telemetry.' },
            ].map((img, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl bg-slate-200 shadow-sm transition-all hover:shadow-md h-48">
                <img
                  src={`/images/${img.id}.jpeg`}
                  alt={img.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent p-4 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-bold text-white block">{img.title}</span>
                  <span className="text-[10px] text-slate-300 block mt-0.5 leading-tight">{img.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section className="px-6 py-20 bg-white" id="technology">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">ARCHITECTURE FOUNDATION</h2>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Powered by Google Cloud Ecosystem
            </h3>
            <p className="text-slate-500 text-sm">
              We leverage nearly the entire Google Cloud ecosystem to deliver high-fidelity, offline-capable clinical operations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {techStack.map((tech, idx) => (
              <div key={idx} className={`rounded-2xl border ${tech.color} p-6 space-y-4`}>
                <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">{tech.category}</h4>
                <div className="space-y-4">
                  {tech.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${tech.iconColor} bg-current`}></span>
                        <span className="text-xs font-bold text-slate-900">{item.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed pl-3.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Pipeline Architecture */}
      <section className="px-6 py-20 bg-slate-900 text-white" id="architecture">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">SYSTEM PIPELINE</h2>
            <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              End-to-End Operational Pipeline
            </h3>
            <p className="text-slate-400 text-sm">
              How data flows seamlessly from village-level doorstep audits to the DMO decision console.
            </p>
          </div>

          {/* Simple pipeline blocks */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 text-center">
            {[
              { step: "1", title: "Ground Data Intake", desc: "ASHA Worker logs doorstep family visit via Flutter app or voice line (VaaniBot)." },
              { step: "2", title: "API Ingestion & Save", desc: "Logs are sent via Firebase to backend Cloud Run, written safely to jsonDb." },
              { step: "3", title: "AI Integrity Audits", desc: "Gemini Vision API verifies visit photographs and geolocations automatically." },
              { step: "4", title: "Regression Solvers", desc: "Least Squares regression computes footfall forecasts and alerts." },
              { step: "5", title: "Central Console", desc: "District DMO views warnings and approves drug reallocations." }
            ].map((node, idx) => (
              <div key={idx} className="relative rounded-2xl border border-slate-800 bg-slate-950 p-6 flex flex-col items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-extrabold text-white">
                  {node.step}
                </span>
                <h4 className="mt-4 text-sm font-bold text-white">{node.title}</h4>
                <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">{node.desc}</p>
                
                {/* Visual arrow connector */}
                {idx < 4 && (
                  <div className="hidden lg:block absolute -right-3 top-10 z-10 text-slate-700 font-bold text-lg">&rarr;</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-7xl text-center">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">IMPACT METRICS</h2>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Targeted Public Health Outcomes
            </h3>
            <p className="text-slate-500 text-sm">
              Tangible efficiency gains projected based on ABDM sandbox testing specifications.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: "Stock-out Reduction", value: "45%" },
              { label: "Inventory Visibility", value: "92%" },
              { label: "Waiting Time Reduced", value: "38%" },
              { label: "Clinical Staff Efficiency", value: "+30%" }
            ].map((metric, idx) => (
              <div key={idx} className="space-y-2">
                <span className="block text-4xl sm:text-5xl font-extrabold text-blue-600">{metric.value}</span>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government-style Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-12 text-slate-500 text-xs">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <img
                  src="/aarogyaos_logo.png"
                  alt="AarogyaOS Logo"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <span className="font-extrabold text-slate-900 text-sm">{t.brand}</span>
            </div>
            <p className="text-[11px] leading-relaxed max-w-md">
              AarogyaOS: A centralized platform for monitoring clinical resources, workforce capacity, and supply lines across rural health networks. Powered by Google Cloud.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-[11px] font-bold text-slate-600">
            <a href="#overview" className="hover:text-blue-600">Top</a>
            <a href="#dashboard" className="hover:text-blue-600">Dashboard</a>
            <a href="#personas" className="hover:text-blue-600">Stakeholders</a>
            <a href="#technology" className="hover:text-blue-600">Technology</a>
            <a href="#architecture" className="hover:text-blue-600">Architecture</a>
          </div>
        </div>

        <div className="mx-auto max-w-7xl mt-8 pt-8 border-t border-slate-200 text-center text-[10px] text-slate-400">
          <p>© {new Date().getFullYear()} AarogyaOS. Department of Health & Family Welfare. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
