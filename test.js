const extractLabTests = (analysis) => {
    if (!Array.isArray(analysis)) return [];

    const tests = [];

    analysis.forEach(item => {
        const args = item.args || {};
        const primary = args.primary_diagnosis;
        const differentials = args.differential_diagnoses || [];

        // Primary diagnosis tests
        if (primary?.diagnostic_approach?.confirmatory_tests) {
            primary.diagnostic_approach.confirmatory_tests.forEach(t => {
                tests.push({
                    test: t,
                    disease: primary.disease_name,
                    confidence: primary.confidence_score || 0,
                });
            });
        }

        // Differential diagnoses tests
        differentials.forEach(diff => {
            (diff.diagnostic_tests || []).forEach(t => {
                tests.push({
                    test: t,
                    disease: diff.disease_name,
                    confidence: diff.confidence_score || 0,
                });
            });
        });
    });

    return tests;
};
const analysis = [
    {
        "args": {
            "differential_diagnoses": [
                {
                    "relevance_explanation": "E. coli is a common bacterial cause of foodborne illness, and its symptoms—particularly severe stomach cramping and diarrhea—closely overlap with the patient's presentation. Identifying the specific strain is crucial, as some types, like E. coli O157:H7, can lead to severe complications.",
                    "summary": "E. coli refers to a group of bacteria, some strains of which are pathogenic and produce powerful toxins, leading to gastroenteritis. The illness typically ranges from mild to severe, often characterized by intense stomach cramping, tenderness, and potentially bloody diarrhea. Age and underlying health can influence the severity of the infection.",
                    "treatment_approach": [
                        "Rest and supportive care",
                        "Aggressive fluid replacement to manage dehydration",
                        "Avoidance of anti-diarrheal medications"
                    ],
                    "disease_name": "E. coli Infection (Gastroenteritis)",
                    "key_symptoms": [
                        "Severe and bloody diarrhea",
                        "Intense stomach cramping and tenderness",
                        "Nausea and vomiting"
                    ],
                    "diagnostic_tests": [
                        "Stool culture and PCR testing to detect the presence of E. coli bacteria and identify specific pathogenic strains (e.g., Shiga toxin-producing E. coli).",
                        "Complete Blood Count (CBC) to check for signs of hemolytic uremic syndrome (HUS), especially in severe cases."
                    ],
                    "confidence_score": 0.75
                },
                {
                    "relevance_explanation": "Viral gastroenteritis is a highly common cause of acute gastroenteritis that is clinically indistinguishable from many cases of bacterial food poisoning. The patient's symptoms (vomiting, diarrhea, fever, cramps) are classic for a viral etiology, such as Norovirus, which is often transmitted via contaminated food or person-to-person contact.",
                    "summary": "Viral gastroenteritis, often called the \"stomach flu,\" is an inflammation of the stomach and intestines caused by viruses like Norovirus or Rotavirus. It is characterized by the acute onset of non-bloody, watery diarrhea, vomiting, abdominal cramps, and sometimes fever. The illness is typically self-limiting, with the main risk being dehydration.",
                    "treatment_approach": [
                        "Supportive care and rest",
                        "Oral or intravenous fluid and electrolyte replacement",
                        "Antiemetics for persistent vomiting"
                    ],
                    "disease_name": "Viral Gastroenteritis",
                    "key_symptoms": [
                        "Acute onset of watery diarrhea and vomiting",
                        "Low-grade fever and general malaise",
                        "Abdominal cramps and nausea"
                    ],
                    "diagnostic_tests": [
                        "Clinical diagnosis based on symptom presentation and local outbreak patterns",
                        "Stool PCR panel for common viral pathogens (e.g., Norovirus, Rotavirus) if diagnosis is uncertain or for public health tracking"
                    ],
                    "confidence_score": 0.6
                },
                {
                    "relevance_explanation": "Parasitic infections, such as Giardiasis, are a less common but important cause of foodborne illness, often acquired through contaminated water or food. While the acute presentation can mimic bacterial or viral causes, parasitic infections tend to cause more persistent symptoms, bloating, and malabsorption.",
                    "summary": "Parasitic gastroenteritis is caused by protozoa or helminths that infect the gastrointestinal tract, often transmitted through contaminated food or water. Giardiasis, a common example, involves the parasite Giardia lamblia colonizing the small intestine, leading to symptoms like chronic diarrhea, abdominal cramps, bloating, and significant fatigue.",
                    "treatment_approach": [
                        "Antiparasitic medications (e.g., Metronidazole, Tinidazole)",
                        "Fluid and nutritional support",
                        "Symptomatic relief for cramping and nausea"
                    ],
                    "disease_name": "Parasitic Gastroenteritis (e.g., Giardiasis)",
                    "key_symptoms": [
                        "Persistent, foul-smelling, watery diarrhea",
                        "Abdominal cramping and bloating",
                        "Fatigue and weight loss (if chronic)"
                    ],
                    "diagnostic_tests": [
                        "Complete Blood Count (CBC) and blood smear to check for signs of parasitic infection (e.g., eosinophilia)",
                        "Ova and Parasite (O&P) examination of stool sample, often requiring multiple samples",
                        "Stool antigen testing for specific parasites (e.g., Giardia, Cryptosporidium)"
                    ],
                    "confidence_score": 0.5
                }
            ],
            "primary_diagnosis": {
                "relevance_explanation": "The patient's clinical picture, characterized by the acute onset of vomiting, diarrhea, stomach cramps, and fever, is the classic presentation of acute gastroenteritis caused by food poisoning. This diagnosis encompasses illness resulting from the ingestion of food or drinks contaminated with bacteria, viruses, parasites, or toxins. The symptoms directly align with the core manifestations of foodborne illness.",
                "treatment_plan": {
                    "advanced_options": [
                        "Intravenous (IV) fluid replacement for severe dehydration or persistent vomiting",
                        "Administration of specific antibiotics or antiparasitics if a bacterial or parasitic cause is confirmed and deemed necessary by a healthcare professional",
                        "Hospitalization for patients with severe symptoms, underlying comorbidities, or signs of organ damage"
                    ],
                    "first_line": [
                        "Fluid replacement with water and electrolyte-rich solutions to compensate for fluid loss",
                        "Rest to allow the digestive system to recover",
                        "Use of probiotics to help restore the gut microbiome"
                    ]
                },
                "clinical_presentation": {
                    "common_symptoms": [
                        "Vomiting",
                        "Diarrhea",
                        "Stomach cramps",
                        "Fever",
                        "Weakness",
                        "Headache",
                        "Loose stools"
                    ],
                    "key_findings": [
                        "Acute onset of gastrointestinal distress (vomiting and diarrhea)",
                        "Presence of systemic symptoms including fever and weakness",
                        "Abdominal pain and cramping localized to the stomach"
                    ]
                },
                "summary": "Food poisoning, or foodborne illness, is a common condition resulting from the consumption of contaminated food or beverages. It is caused by various pathogens, including bacteria, viruses, and parasites, or their toxins. The illness typically manifests as acute gastroenteritis, characterized by a rapid onset of symptoms such as nausea, vomiting, stomach pain and cramps, loose stools, and sometimes fever. While most cases are self-limiting, the primary concern is the risk of dehydration due to fluid loss.",
                "diagnostic_approach": {
                    "initial_tests": [
                        "Detailed history of recent food and drink consumption (within 48 hours)",
                        "Inquiry about recent travel and symptoms in other people who shared the same meal",
                        "Physical examination to assess hydration status and abdominal tenderness"
                    ],
                    "confirmatory_tests": [
                        "Stool culture to identify specific bacterial pathogens (e.g., Salmonella, Campylobacter)",
                        "Stool testing for viruses (e.g., Norovirus) and parasites (e.g., Giardia) to determine the causative agent",
                        "Testing of suspected food or drink sources if an outbreak is suspected"
                    ]
                },
                "prevention_strategies": [
                    "Practice proper food handling and preparation techniques, including cooking foods to the correct internal temperatures.",
                    "Avoid cross-contamination by keeping raw meats separate from ready-to-eat foods and using separate cutting boards.",
                    "Ensure prompt refrigeration of perishable foods and discard any food left at room temperature for too long.",
                    "Maintain excellent personal hygiene, especially frequent and thorough handwashing before eating and after using the restroom."
                ],
                "disease_name": "Food Poisoning (Foodborne Illness)",
                "confidence_score": 0.95
            },
            "clinical_recommendations": [
                "Aggressively manage fluid and electrolyte balance using oral rehydration solutions (ORS) to prevent dehydration, which is the most common complication of acute gastroenteritis.",
                "Monitor for signs of severe illness, such as persistent high fever, bloody diarrhea, inability to keep fluids down, or symptoms of neurological involvement (e.g., blurred vision, numbness), and seek immediate medical care if these occur.",
                "Avoid over-the-counter anti-diarrheal medications (like loperamide) unless specifically instructed by a healthcare professional, as they can prolong the illness or worsen outcomes in certain bacterial infections (e.g., E. coli O157:H7).",
                "Maintain strict food safety and hygiene practices at home to prevent secondary transmission, including frequent handwashing and proper cleaning of contaminated surfaces."
            ]
        },
        "type": "ClinicalAnalysis"
    }
]


const fetchLabTest = async () => {

    try {
        const res = await axios.post(
            "https://care-backend-sa3e.onrender.com/api/v1/analyze",
            { report_text: buildReportText(illness, symtomps, patient) }
        );
        const analysis = res?.data || [];
        console.log(res?.data)
        const labTests = extractLabTests(analysis);

    } catch (err) {
     console.log(err);
     
    } finally {
 
    }
};
const result = extractLabTests(analysis)
console.log(result);
