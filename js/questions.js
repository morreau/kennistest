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
        weight: 1.0,
        explanation: "AI genereert tekst door woord voor woord te voorspellen, niet door databases te raadplegen."
    },
    {
        id: 2,
        category: "AI Begrip",
        categoryKey: "ai_begrip",
        question: "Wat is een 'hallucinatie' bij AI?",
        answers: [
            { letter: "A", text: "Wanneer AI verouderde informatie gebruikt" },
            { letter: "B", text: "Wanneer AI overtuigend maar incorrect antwoordt", correct: true },
            { letter: "C", text: "Wanneer AI een vraag verkeerd interpreteert" },
            { letter: "D", text: "Wanneer AI informatie uit andere contexten mengt" }
        ],
        weight: 1.0,
        explanation: "Hallucinaties zijn overtuigende maar foutieve antwoorden - niet verouderde info of verkeerde interpretaties."
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
        weight: 1.0,
        explanation: "AI is vaak correct maar kan fouten maken. Verificatie blijft nodig, ook bij bekende onderwerpen."
    },

    // === CONTEXT & PROMPTING (5 questions) ===
    {
        id: 4,
        category: "Context",
        categoryKey: "context",
        question: "Waarom is het belangrijk om context mee te geven aan AI?",
        answers: [
            { letter: "A", text: "AI geeft dan langere en completere antwoorden" },
            { letter: "B", text: "AI kent jouw organisatie en situatie niet", correct: true },
            { letter: "C", text: "AI kan anders geen goede toon aanslaan" },
            { letter: "D", text: "AI heeft context nodig om vragen te begrijpen" }
        ],
        weight: 1.2,
        explanation: "AI kent jouw specifieke situatie niet - context geeft richting, niet alleen lengte of toon."
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
        weight: 1.3,
        explanation: "Relevantie voor de lezer bepaalt wat belangrijk is - niet lengte, rol of voorbeelden."
    },
    {
        id: 6,
        category: "Context",
        categoryKey: "context",
        question: "Je vraagt AI om feedback op een projectvoorstel. Wat is het belangrijkste om mee te geven?",
        answers: [
            { letter: "A", text: "Dat AI eerlijk en kritisch mag zijn" },
            { letter: "B", text: "Waar het voorstel aan moet voldoen", correct: true },
            { letter: "C", text: "De feedback die je eerder van anderen kreeg" },
            { letter: "D", text: "Dat AI stap voor stap moet analyseren" }
        ],
        weight: 1.3,
        explanation: "Criteria voor succes bepalen wat goede feedback is - niet alleen eerlijkheid of stapsgewijs werken."
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
        weight: 1.2,
        explanation: "Feiten controleren via betrouwbare bronnen is essentieel - AI kan geen zekerheid geven over eigen output."
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
        weight: 1.3,
        explanation: "Specifieke situatie en context ontbreekt meestal bij te algemene output - niet opmaak of rol."
    }
];

// Prompt exercise configuration
const promptExercise = {
    scenario: "Je hebt een uitgebreid rapport ontvangen en moet de belangrijkste punten delen met collega's.",
    evaluationCriteria: {
        taak: { maxScore: 2, description: "Duidelijke actie/opdracht" },
        context: { maxScore: 2, description: "Achtergrondinformatie" },
        rol: { maxScore: 2, description: "Expertise of perspectief" },
        format: { maxScore: 2, description: "Gewenst eindresultaat" },
        kwaliteit: { maxScore: 2, description: "Helderheid en specificiteit" }
    },
    maxScore: 10,
    // Multiplier to convert 0-10 to 0-20 points
    scoreMultiplier: 3
};

// Scoring thresholds for recommendations
const scoreThresholds = {
    session1: { min: 0, max: 70, label: "Start bij Workshop 1", key: "session1" },
    session2: { min: 71, max: 100, label: "Klaar voor Workshop 2", key: "session2" }
};

// Recommendation messages
const recommendations = {
    session1: {
        badge: "Workshop 1",
        title: "Start bij Workshop 1",
        text: "De basis versterken helpt je het meeste. In Workshop 1 leer je hoe AI werkt, effectief prompten en de basis van contextbeheer.",
        trainingUrl: "workshop1.html"
    },
    session2: {
        badge: "Workshop 2",
        title: "Klaar voor Workshop 2",
        text: "Je hebt voldoende basiskennis. In Workshop 2 leer je hoe je context effectief inzet en een AI-werkomgeving opbouwt.",
        trainingUrl: "workshop2.html"
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { questions, promptExercise, scoreThresholds, recommendations };
}
