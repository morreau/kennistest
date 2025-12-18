/**
 * Copilot Academy - AI Kennistest
 * Quiz Logic & State Management
 */

// Category Icons (matching skills interstitial)
const categoryIcons = {
    ai_begrip: `<svg viewBox="0 0 256 256" fill="currentColor"><path d="M208,104a79.86,79.86,0,0,1-30.59,62.92A24.29,24.29,0,0,0,168,186v6a8,8,0,0,1-8,8H96a8,8,0,0,1-8-8v-6a24.11,24.11,0,0,0-9.3-19A79.87,79.87,0,0,1,48,104.45C47.76,61.09,82.72,25,126.07,24A80,80,0,0,1,208,104Z" opacity="0.2"/><path d="M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.49C39.74,56.83,78.26,17.14,125.88,16A88,88,0,0,1,216,104Zm-16,0a72,72,0,0,0-73.74-72c-39,.92-70.47,33.39-70.26,72.39a71.65,71.65,0,0,0,27.64,56.3A32,32,0,0,1,96,186v6h64v-6a32.15,32.15,0,0,1,12.47-25.35A71.65,71.65,0,0,0,200,104Zm-16.11-9.34a57.6,57.6,0,0,0-46.56-46.55,8,8,0,0,0-2.66,15.78c16.57,2.79,30.63,16.85,33.44,33.45A8,8,0,0,0,176,104a9,9,0,0,0,1.35-.11A8,8,0,0,0,183.89,94.66Z"/></svg>`,
    prompting: `<svg viewBox="0 0 256 256" fill="currentColor"><path d="M224,64V192a8,8,0,0,1-8,8H80L45.15,230.11A8,8,0,0,1,32,224V64a8,8,0,0,1,8-8H216A8,8,0,0,1,224,64Z" opacity="0.2"/><path d="M116,128a12,12,0,1,1,12,12A12,12,0,0,1,116,128ZM84,140a12,12,0,1,0-12-12A12,12,0,0,0,84,140Zm88,0a12,12,0,1,0-12-12A12,12,0,0,0,172,140Zm60-76V192a16,16,0,0,1-16,16H83l-32.6,28.16-.09.07A15.89,15.89,0,0,1,40,240a16.13,16.13,0,0,1-6.8-1.52A15.85,15.85,0,0,1,24,224V64A16,16,0,0,1,40,48H216A16,16,0,0,1,232,64ZM40,224h0ZM216,64H40V224l34.77-30A8,8,0,0,1,80,192H216Z"/></svg>`,
    context: `<svg viewBox="0 0 256 256" fill="currentColor"><path d="M232,80v88.89a7.11,7.11,0,0,1-7.11,7.11H200V112a8,8,0,0,0-8-8H120L90.13,81.6a8,8,0,0,0-4.8-1.6H64V56a8,8,0,0,1,8-8h45.33a8,8,0,0,1,4.8,1.6L152,72h72A8,8,0,0,1,232,80Z" opacity="0.2"/><path d="M224,64H154.67L126.93,43.2a16.12,16.12,0,0,0-9.6-3.2H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H192.89A15.13,15.13,0,0,0,208,200.89V184h16.89A15.13,15.13,0,0,0,240,168.89V80A16,16,0,0,0,224,64ZM192,200H40V88H85.33l29.87,22.4A8,8,0,0,0,120,112h72Zm32-32H208V112a16,16,0,0,0-16-16H122.67L94.93,75.2a16.12,16.12,0,0,0-9.6-3.2H72V56h45.33L147.2,78.4A8,8,0,0,0,152,80h72Z"/></svg>`
};

// Quiz State
const state = {
    currentScreen: 'welcome',
    currentQuestion: 0,
    answers: {},
    promptResponse: null,
    promptScore: null,
    totalQuestions: questions.length + 1, // MC questions + prompt exercise
    isSubmitting: false
};

// DOM Elements
const screens = {
    welcome: document.getElementById('screenWelcome'),
    skills: document.getElementById('screenSkills'),
    question: document.getElementById('screenQuestion'),
    prompt: document.getElementById('screenPrompt'),
    loading: document.getElementById('screenLoading'),
    promptFeedback: document.getElementById('screenPromptFeedback'),
    results: document.getElementById('screenResults')
};

const elements = {
    progressContainer: document.getElementById('progressContainer'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    questionCategory: document.getElementById('questionCategory'),
    questionText: document.getElementById('questionText'),
    answersContainer: document.getElementById('answersContainer'),
    btnPrevious: document.getElementById('btnPrevious'),
    btnNext: document.getElementById('btnNext'),
    promptInput: document.getElementById('promptInput'),
    charCount: document.getElementById('charCount'),
    btnSubmitPrompt: document.getElementById('btnSubmitPrompt')
};

// Initialize
function init() {
    showScreen('welcome');
}

// Screen Management
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('screen--active');
    });
    screens[screenName].classList.add('screen--active');
    state.currentScreen = screenName;

    // Show/hide progress bar
    if (screenName === 'question' || screenName === 'prompt') {
        elements.progressContainer.classList.add('visible');
        updateProgress();
    } else {
        elements.progressContainer.classList.remove('visible');
    }

    // Hide header on question and prompt screens to save vertical space
    const header = document.querySelector('.header');
    if (screenName === 'question' || screenName === 'prompt') {
        header.classList.add('header--hidden');
    } else {
        header.classList.remove('header--hidden');
    }
}

// Progress Bar
function updateProgress() {
    const current = state.currentQuestion + 1;
    const total = state.totalQuestions;
    const percentage = (current / total) * 100;

    elements.progressFill.style.width = `${percentage}%`;
    elements.progressText.textContent = `${current}/${total}`;
}

// Start Quiz - show skills interstitial first
function startQuiz() {
    state.currentQuestion = 0;
    state.answers = {};
    state.promptResponse = null;
    state.promptScore = null;
    showScreen('skills');
}

// Start Questions - called from skills screen
function startQuestions() {
    showQuestion(0);
}

// Show Question
function showQuestion(index) {
    if (index < 0) {
        showScreen('welcome');
        return;
    }

    if (index >= questions.length) {
        // Show prompt exercise
        showScreen('prompt');
        state.currentQuestion = index;
        updateProgress();

        // Restore prompt if previously entered
        if (state.promptResponse) {
            elements.promptInput.value = state.promptResponse;
            handlePromptInput();
        }
        return;
    }

    const question = questions[index];
    state.currentQuestion = index;

    // Update UI with category icon
    const icon = categoryIcons[question.categoryKey] || '';
    elements.questionCategory.innerHTML = `<span class="category-icon">${icon}</span>${question.category}`;
    elements.questionText.textContent = question.question;

    // Render answers
    elements.answersContainer.innerHTML = question.answers.map(answer => `
        <div class="answer ${state.answers[question.id] === answer.letter ? 'answer--selected' : ''}"
             onclick="selectAnswer(${question.id}, '${answer.letter}')"
             tabindex="0"
             data-letter="${answer.letter}">
            <span class="answer__letter">${answer.letter}</span>
            <span class="answer__text">${answer.text}</span>
        </div>
    `).join('');

    // Update navigation buttons
    elements.btnPrevious.style.display = index === 0 ? 'none' : 'flex';
    elements.btnNext.disabled = !state.answers[question.id];

    // Show/hide Enter hint based on whether answer is selected
    const enterHint = document.getElementById('enterHint');
    if (enterHint) {
        if (state.answers[question.id]) {
            enterHint.classList.add('visible');
        } else {
            enterHint.classList.remove('visible');
        }
    }

    showScreen('question');
}

// Select Answer
function selectAnswer(questionId, letter) {
    state.answers[questionId] = letter;

    // Update UI
    document.querySelectorAll('.answer').forEach(el => {
        el.classList.remove('answer--selected');
        if (el.dataset.letter === letter) {
            el.classList.add('answer--selected');
        }
    });

    // Enable next button
    elements.btnNext.disabled = false;

    // Show Enter hint
    document.getElementById('enterHint')?.classList.add('visible');
}

// Navigation
function nextQuestion() {
    if (state.currentQuestion < questions.length - 1) {
        showQuestion(state.currentQuestion + 1);
    } else if (state.currentQuestion === questions.length - 1) {
        // Go to prompt exercise
        showQuestion(questions.length);
    }
}

function previousQuestion() {
    if (state.currentScreen === 'prompt') {
        showQuestion(questions.length - 1);
    } else if (state.currentQuestion > 0) {
        showQuestion(state.currentQuestion - 1);
    } else {
        showScreen('welcome');
    }
}

// Prompt Exercise
function handlePromptInput() {
    const value = elements.promptInput.value;
    const length = value.length;

    elements.charCount.textContent = `${length} tekens`;
    state.promptResponse = value;

    // Enable submit button if there's content (minimum 20 characters)
    elements.btnSubmitPrompt.disabled = length < 20;
}

async function submitPrompt() {
    if (state.isSubmitting) return;

    const prompt = elements.promptInput.value.trim();
    if (!prompt || prompt.length < 20) {
        alert('Schrijf minimaal 20 tekens voor je prompt.');
        return;
    }

    state.isSubmitting = true;
    state.promptResponse = prompt;
    showScreen('loading');

    try {
        // Call Cloudflare Worker to evaluate prompt
        const score = await evaluatePrompt(prompt);
        state.promptScore = score;
        showPromptFeedback(score);
    } catch (error) {
        console.error('Error evaluating prompt:', error);
        // Fallback: use basic local evaluation
        state.promptScore = evaluatePromptLocally(prompt);
        showPromptFeedback(state.promptScore);
    } finally {
        state.isSubmitting = false;
    }
}

// Evaluate prompt via Cloudflare Worker (Gemini API)
async function evaluatePrompt(prompt) {
    // Worker URL - Cloudflare Worker with Gemini API
    const workerUrl = 'https://llm-kennis-api.morreau.workers.dev';

    try {
        const response = await fetch(workerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Worker API error:', error);
        // Fallback to local evaluation
        return evaluatePromptLocally(prompt);
    }
}

// Fallback: Basic local prompt evaluation (universal criteria)
function evaluatePromptLocally(prompt) {
    const promptLower = prompt.toLowerCase();
    let scores = {
        duidelijkheid: { score: 0, feedback: "" },
        specificiteit: { score: 0, feedback: "" },
        context: { score: 0, feedback: "" },
        verwachting: { score: 0, feedback: "" },
        effectiviteit: { score: 0, feedback: "" }
    };

    // Check for DUIDELIJKHEID (clarity - is the request clear?)
    const taskKeywords = ['maak', 'schrijf', 'analyseer', 'vat samen', 'samenvatten', 'creëer', 'geef', 'lever', 'help', 'maak'];
    if (taskKeywords.some(kw => promptLower.includes(kw))) {
        scores.duidelijkheid.score = promptLower.includes('voor') || promptLower.includes('zodat') || promptLower.includes('omdat') ? 2 : 1;
        scores.duidelijkheid.feedback = scores.duidelijkheid.score === 2 ? "Duidelijke vraag" : "Vraag aanwezig maar kan helderder";
    } else {
        scores.duidelijkheid.feedback = "Onduidelijk wat gevraagd wordt";
    }

    // Check for SPECIFICITEIT (specific details)
    const detailKeywords = ['kwartaal', 'rapport', 'mt', 'overleg', 'sales', 'klant', 'markt', 'cijfers', 'resultaten', 'afdeling', 'team', 'management', 'directie'];
    const detailCount = detailKeywords.filter(kw => promptLower.includes(kw)).length;
    if (detailCount >= 3) {
        scores.specificiteit.score = 2;
        scores.specificiteit.feedback = "Goed gespecificeerd";
    } else if (detailCount >= 1) {
        scores.specificiteit.score = 1;
        scores.specificiteit.feedback = "Enkele details, kan specifieker";
    } else {
        scores.specificiteit.feedback = "Te vaag, meer details nodig";
    }

    // Check for CONTEXT (background information)
    const contextKeywords = ['bevat', 'bestaat uit', 'gaat over', 'informatie', 'data', 'gegevens', 'inhoud', 'onderwerp'];
    const hasContext = contextKeywords.some(kw => promptLower.includes(kw)) || detailCount >= 2;
    if (hasContext && prompt.length > 80) {
        scores.context.score = 2;
        scores.context.feedback = "Goede context gegeven";
    } else if (hasContext || prompt.length > 50) {
        scores.context.score = 1;
        scores.context.feedback = "Enige context, kan uitgebreider";
    } else {
        scores.context.feedback = "Meer achtergrondinformatie nodig";
    }

    // Check for VERWACHTING (expected output/format)
    const formatKeywords = ['bullet', 'punten', 'lijst', 'tabel', 'samenvatting', 'paragraaf', 'slides', 'email', 'maximaal', 'kort', 'uitgebreid', 'beknopt', 'overzicht', 'hoofdpunten'];
    if (formatKeywords.some(kw => promptLower.includes(kw))) {
        scores.verwachting.score = 2;
        scores.verwachting.feedback = "Duidelijk aangegeven wat je wilt";
    } else if (promptLower.includes('voor') && (promptLower.includes('overleg') || promptLower.includes('vergadering') || promptLower.includes('presentatie'))) {
        scores.verwachting.score = 1;
        scores.verwachting.feedback = "Doel impliciet, format kan explicieter";
    } else {
        scores.verwachting.feedback = "Geef aan wat voor output je wilt";
    }

    // Check for EFFECTIVITEIT (overall - would this work?)
    const wordCount = prompt.split(/\s+/).length;
    const totalPartialScore = scores.duidelijkheid.score + scores.specificiteit.score + scores.context.score + scores.verwachting.score;
    if (wordCount >= 25 && totalPartialScore >= 5) {
        scores.effectiviteit.score = 2;
        scores.effectiviteit.feedback = "Zou goed resultaat opleveren";
    } else if (wordCount >= 15 && totalPartialScore >= 3) {
        scores.effectiviteit.score = 1;
        scores.effectiviteit.feedback = "Redelijk, maar kan effectiever";
    } else {
        scores.effectiviteit.feedback = "Prompt is te beperkt";
    }

    // Calculate total
    const totaal = scores.duidelijkheid.score + scores.specificiteit.score + scores.context.score + scores.verwachting.score + scores.effectiviteit.score;

    return {
        duidelijkheid: scores.duidelijkheid,
        specificiteit: scores.specificiteit,
        context: scores.context,
        verwachting: scores.verwachting,
        effectiviteit: scores.effectiviteit,
        totaal
    };
}

// Show Prompt Feedback Screen
function showPromptFeedback(evaluation) {
    const criteria = ['duidelijkheid', 'specificiteit', 'context', 'verwachting', 'effectiviteit'];
    const labels = {
        duidelijkheid: 'Duidelijkheid',
        specificiteit: 'Specificiteit',
        context: 'Context',
        verwachting: 'Verwachte output',
        effectiviteit: 'Effectiviteit'
    };
    const descriptions = {
        duidelijkheid: 'Is helder wat je vraagt?',
        specificiteit: 'Zijn er concrete details?',
        context: 'Is er voldoende achtergrond?',
        verwachting: 'Weet AI wat je wilt?',
        effectiviteit: 'Werkt dit in de praktijk?'
    };

    const container = document.getElementById('feedbackCriteria');
    container.innerHTML = criteria.map(c => {
        const score = evaluation[c]?.score ?? 0;
        const feedback = evaluation[c]?.feedback || '';
        const colorClass = score === 2 ? 'feedback-item--green' : score === 1 ? 'feedback-item--yellow' : 'feedback-item--red';
        const scoreText = score === 2 ? 'Goed' : score === 1 ? 'Redelijk' : 'Ontbreekt';

        return `
            <div class="feedback-item ${colorClass}">
                <div class="feedback-header">
                    <span class="feedback-label">${labels[c]}</span>
                    <span class="feedback-score">${scoreText}</span>
                </div>
                <p class="feedback-description">${descriptions[c]}</p>
                <p class="feedback-text">${feedback}</p>
            </div>
        `;
    }).join('');

    showScreen('promptFeedback');
}

// Restart Quiz
function restartQuiz() {
    state.currentQuestion = 0;
    state.answers = {};
    state.promptResponse = null;
    state.promptScore = null;
    elements.promptInput.value = '';
    handlePromptInput();
    showScreen('welcome');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

// Keyboard Navigation
document.addEventListener('keydown', handleKeyboardNavigation);

function handleKeyboardNavigation(e) {
    // Don't interfere with typing in textarea
    if (e.target.tagName === 'TEXTAREA') {
        // Only handle Cmd/Ctrl+Enter for submit
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!elements.btnSubmitPrompt.disabled) submitPrompt();
        }
        return;
    }

    const key = e.key.toUpperCase();

    switch (state.currentScreen) {
        case 'welcome':
            if (e.key === 'Enter') startQuiz();
            break;

        case 'skills':
            if (e.key === 'Enter') startQuestions();
            break;

        case 'question':
            // A/B/C/D or 1/2/3/4 to select answer
            const letterMap = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
            const letter = letterMap[key] || key;

            if (['A', 'B', 'C', 'D'].includes(letter)) {
                const question = questions[state.currentQuestion];
                selectAnswer(question.id, letter);
            }

            // Enter to proceed (if answer selected)
            if (e.key === 'Enter' && !elements.btnNext.disabled) {
                nextQuestion();
            }

            // Backspace or Left Arrow to go back
            if ((e.key === 'Backspace' || e.key === 'ArrowLeft') && state.currentQuestion > 0) {
                e.preventDefault();
                previousQuestion();
            }
            break;

        case 'prompt':
            // Backspace to go back (when not in textarea)
            if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
                e.preventDefault();
                previousQuestion();
            }
            break;
    }
}
