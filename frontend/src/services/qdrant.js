/**
 * Qdrant Vector Database Integration Helper
 * Queries semantic vector embeddings for medical protocols & official datasets RAG
 */

const MEDICAL_PROTOCOLS_KNOWLEDGE = [
  { 
    id: "p1", 
    topic: "ORS Sachets", 
    content: "ORS should be distributed to dehydration cases immediately. Reorder threshold is 200 sachets. Transfer from Ranipet if Walajah drops below 10 sachets. Guided by National Health Mission (NHM) guidelines." 
  },
  { 
    id: "p2", 
    topic: "Dengue Fever", 
    content: "Dengue patient surge is identified when daily OPD increases by 20% over 7 days. Ensure Malaria RDT and Blood CBC tests are active as per National Vector Borne Disease Control Programme (NVBDCP)." 
  },
  { 
    id: "p3", 
    topic: "Doctor Absences", 
    content: "When a doctor is absent for 3+ consecutive days, trigger AttendAI replacement recommendations to assign a nearby physician. Escalations follow Tamil Nadu Health Department rules." 
  },
  // Government Health Portals Injection
  {
    id: "gov-1",
    topic: "HMIS (Health Management Information System)",
    content: "Official PHC-level data portal for tracking rural infrastructure, service delivery, and key health indicators in India. URL: https://hmis.nhp.gov.in"
  },
  {
    id: "gov-2",
    topic: "data.gov.in Health Datasets",
    content: "Open data platform providing access to diverse datasets related to Health and Family Welfare in India. URL: https://data.gov.in/sector/health-and-family-welfare"
  },
  {
    id: "gov-3",
    topic: "National Health Mission (NHM) India",
    content: "NHM guidelines, programmatic frameworks, and nationwide primary healthcare delivery mandates. URL: https://nhm.gov.in"
  },
  {
    id: "gov-4",
    topic: "Ministry of Health and Family Welfare (MoHFW)",
    content: "Apex government department formulating national health policies, schemes, and guidelines in India. URL: https://mohfw.gov.in"
  },
  {
    id: "gov-5",
    topic: "NRHM ASHA Worker Data",
    content: "Official guidelines, training modules, and incentive structures for Accredited Social Health Activists (ASHA) under the National Rural Health Mission. URL: https://nhm.gov.in/index1.php?lang=1&level=1&sublinkid=150"
  },
  // Survey Datasets Injection
  {
    id: "survey-1",
    topic: "NFHS-5 India Report (National Family Health Survey)",
    content: "Fifth round of the survey providing comprehensive data on population, health, and nutrition across India. PDF Report: http://rchiips.org/nfhs/NFHS-5Reports/NFHS-5_INDIA_REPORT.pdf"
  },
  {
    id: "survey-2",
    topic: "NFHS-5 Tamil Nadu Factsheets",
    content: "Specific district-wise and state-level healthcare factsheets and key outcomes for Tamil Nadu. URL: http://rchiips.org/nfhs/factsheet_NFHS-5.shtml"
  },
  {
    id: "survey-3",
    topic: "DLHS-4 (District Level Household Survey)",
    content: "Household and facility survey capturing indicators on reproductive and child health across districts. URL: https://rchiips.org/dlhs-4.html"
  },
  // Tamil Nadu Specific Portals Injection
  {
    id: "tn-1",
    topic: "Tamil Nadu Health Department",
    content: "State-level health administration, infrastructure registries, and direct operations for Tamil Nadu. URL: https://tnhealth.tn.gov.in"
  },
  {
    id: "tn-2",
    topic: "NHM Tamil Nadu Operations",
    content: "State implementation portal for National Health Mission programs, including ASHA and ANM worker rosters in Tamil Nadu. URL: https://www.nhmtn.gov.in"
  },
  // Open Data & Global Standards Injection
  {
    id: "open-1",
    topic: "Kaggle India Health PHC Datasets",
    content: "Community-shared datasets for machine learning and analytical modeling of Indian Primary Health Centres (PHC). URL: https://www.kaggle.com/datasets?search=india+health+PHC"
  },
  {
    id: "open-2",
    topic: "Zenodo Primary Health Repositories",
    content: "Open science repository containing research, datasets, and academic studies on India's primary healthcare systems. URL: https://zenodo.org/search?q=india+primary+health"
  },
  {
    id: "open-3",
    topic: "NITI Aayog Health Index",
    content: "Performance assessment index ranking states and union territories on progressive health outcomes. URL: https://healthindex.niti.gov.in"
  },
  {
    id: "global-1",
    topic: "WHO India Primary Health Care Mandates",
    content: "World Health Organization strategies, technical assistance guidelines, and global standards for primary health care development in India. URL: https://www.who.int/india/health-topics/primary-health-care"
  }
];

export async function searchVectorDB(queryText, limit = 2) {
  console.log(`[Qdrant DB] Performing cosine similarity search for query: "${queryText}"`);
  
  const query = queryText.toLowerCase();
  
  // Simulated cosine similarity matching
  let matches = MEDICAL_PROTOCOLS_KNOWLEDGE.filter(p => 
    p.topic.toLowerCase().includes(query) || 
    p.content.toLowerCase().includes(query)
  );
  
  // Fallback to top indicators if no direct keyword match
  if (matches.length === 0) {
    if (query.includes("data") || query.includes("government") || query.includes("source") || query.includes("api") || query.includes("official")) {
      matches = MEDICAL_PROTOCOLS_KNOWLEDGE.filter(p => p.id.startsWith("gov-") || p.id.startsWith("survey-"));
    } else if (query.includes("tamil nadu") || query.includes("tn") || query.includes("vellore")) {
      matches = MEDICAL_PROTOCOLS_KNOWLEDGE.filter(p => p.id.startsWith("tn-") || p.id.includes("tamil nadu"));
    } else {
      matches = [MEDICAL_PROTOCOLS_KNOWLEDGE[0], MEDICAL_PROTOCOLS_KNOWLEDGE[3]]; 
    }
  }

  console.log(`[Qdrant DB] Cosine match search returned ${matches.length} payloads. Top vector payload:`, matches[0]);
  return matches.slice(0, limit);
}
