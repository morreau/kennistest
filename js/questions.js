/**
 * Copilot Academy - AI Kennistest
 * Question Bank (Dutch)
 */

const questions = [
    // === AI BEGRIP (3 questions - improved distractors) ===
    {
        id: 1,
        category: "AI Begrip",
        categoryKey: "ai_begrip",
        question: "Wat is een taalmodel zoals ChatGPT of Copilot?",
        answers: [
            { letter: "A", text: "Een systeem dat informatie ophaalt uit een actuele database" },
            { letter: "B", text: "Een voorspellingsmachine die woord voor woord tekst genereert", correct: true },
            { letter: "C", text: "Een kennissysteem dat geverifieerde bronnen raadpleegt" },
            { letter: "D", text: "Een digitale assistent met toegang tot bedrijfsinformatie" }
        ],
        weight: 1.0
    },
    {
        id: 2,
        category: "AI Begrip",
        categoryKey: "ai_begrip",
        question: "Wat is een 'hallucinatie' bij AI?",
        answers: [
            { letter: "A", text: "Wanneer AI verouderde informatie gebruikt" },
            { letter: "B", text: "Wanneer AI overtuigend maar incorrect antwoordt", correct: true },
            { letter: "C", text: "Wanneer AI toegeeft iets niet te weten" },
            { letter: "D", text: "Wanneer AI door beveiligingslimieten blokkeert" }
        ],
        weight: 1.0
    },
    {
        id: 3,
        category: "AI Begrip",
        categoryKey: "ai_begrip",
        question: "Hoe betrouwbaar zijn AI-antwoorden bij feitelijke vragen?",
        answers: [
            { letter: "A", text: "Vrijwel altijd correct dankzij grote trainingsdata" },
            { letter: "B", text: "Meestal correct, maar regelmatige verificatie is nodig", correct: true },
            { letter: "C", text: "Alleen betrouwbaar bij vragen over bekende onderwerpen" },
            { letter: "D", text: "Even betrouwbaar als Wikipedia of andere online bronnen" }
        ],
        weight: 1.0
    },

    // === CONTEXT & PROMPTING (5 questions) ===
    {
        id: 4,
        category: "Context",
        categoryKey: "context",
        question: "Waarom is het belangrijk om context mee te geven aan AI?",
        answers: [
            { letter: "A", text: "AI werkt sneller met meer tekst" },
            { letter: "B", text: "AI kent jouw organisatie en situatie niet", correct: true },
            { letter: "C", text: "Het is verplicht door de AI-wetgeving" },
            { letter: "D", text: "Anders geeft AI geen antwoord" }
        ],
        weight: 1.2
    },
    {
        id: 5,
        category: "Prompting",
        categoryKey: "prompting",
        question: "Je wilt dat AI een rapport samenvat voor het MT. Wat is het belangrijkste om mee te geven?",
        answers: [
            { letter: "A", text: "De gewenste lengte en opmaak van de samenvatting" },
            { letter: "B", text: "Welke informatie relevant is voor de lezer", correct: true },
            { letter: "C", text: "Een rol zoals 'je bent een business analist'" },
            { letter: "D", text: "Voorbeelden van goede samenvattingen" }
        ],
        weight: 1.3
    },
    {
        id: 6,
        category: "Context",
        categoryKey: "context",
        question: "Je vraagt AI om feedback op een projectvoorstel. Wat is het belangrijkste om mee te geven?",
        answers: [
            { letter: "A", text: "Dat AI eerlijk en kritisch mag zijn" },
            { letter: "B", text: "Waar het voorstel aan moet voldoen", correct: true },
            { letter: "C", text: "Hoeveel ervaring AI heeft met dit onderwerp" },
            { letter: "D", text: "Dat AI stap voor stap moet analyseren" }
        ],
        weight: 1.3
    },
    {
        id: 7,
        category: "AI Begrip",
        categoryKey: "ai_begrip",
        question: "Je gebruikt AI-output voor een belangrijk werkdocument. Wat is de belangrijkste stap?",
        answers: [
            { letter: "A", text: "Direct gebruiken als het logisch klinkt" },
            { letter: "B", text: "Controleren of feiten kloppen met betrouwbare bronnen", correct: true },
            { letter: "C", text: "Vragen of AI zeker is van het antwoord" },
            { letter: "D", text: "De prompt herhalen voor een tweede mening" }
        ],
        weight: 1.2
    },
    {
        id: 8,
        category: "Prompting",
        categoryKey: "prompting",
        question: "AI schrijft een te algemene e-mail. Wat ontbrak waarschijnlijk in je prompt?",
        answers: [
            { letter: "A", text: "Een woordlimiet en gewenste opmaak" },
            { letter: "B", text: "De specifieke situatie en context", correct: true },
            { letter: "C", text: "Een rol zoals 'schrijf als expert'" },
            { letter: "D", text: "De instructie om professioneel te schrijven" }
        ],
        weight: 1.3
    }
];

// Prompt exercise configuration
const promptExercise = {
    scenario: "Je wilt een kwartaalrapport samenvatten voor het MT-overleg. Het rapport bevat sales cijfers, klanttevredenheid en marktanalyse.",
    evaluationCriteria: {
        taak: { maxScore: 2, description: "Duidelijke actie/opdracht" },
        context: { maxScore: 2, description: "Achtergrondinformatie" },
        rol: { maxScore: 2, description: "Expertise of perspectief" },
        format: { maxScore: 2, description: "Gewenst eindresultaat" },
        kwaliteit: { maxScore: 2, description: "Helderheid en specificiteit" }
    },
    maxScore: 10,
    // Multiplier to convert 0-10 to 0-20 points
    scoreMultiplier: 2
};

// Scoring thresholds for recommendations
const scoreThresholds = {
    session1: { min: 0, max: 60, label: "Start bij Sessie 1", key: "session1" },
    session2: { min: 61, max: 80, label: "Start bij Sessie 2", key: "session2" },
    workflow: { min: 81, max: 95, label: "Klaar voor AI Workflow", key: "workflow" },
    advanced: { min: 96, max: 100, label: "Gevorderd niveau", key: "advanced" }
};

// Recommendation messages
const recommendations = {
    session1: {
        badge: "Sessie 1",
        title: "Start bij AI Fundament",
        text: "Je bouwt de beste basis door te beginnen bij Sessie 1. Hier leer je hoe AI werkt, effectief prompten en de basis van contextbeheer.",
        trainingUrl: "sessie1.html"
    },
    session2: {
        badge: "Sessie 2",
        title: "Start bij AI Context",
        text: "Je begrijpt de basis! In Sessie 2 leer je hoe je context effectief inzet en een AI-werkomgeving opbouwt.",
        trainingUrl: "sessie2.html"
    },
    workflow: {
        badge: "AI Workflow",
        title: "Klaar voor AI Workflow",
        text: "Uitstekend! Je hebt een goede basis en kunt direct starten met de AI Workflow training om processen te optimaliseren.",
        trainingUrl: "workflow.html"
    },
    advanced: {
        badge: "Gevorderd",
        title: "Gevorderd niveau",
        text: "Indrukwekkend! Je beheert AI-vaardigheden op gevorderd niveau. Overweeg AI Workflow of Context Bank training.",
        trainingUrl: "gevorderd.html"
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { questions, promptExercise, scoreThresholds, recommendations };
}
