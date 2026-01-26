/**
 * Copilot Academy - AI Kennistest
 * Results Calculation & Export
 */

// DOM Elements for Results
const resultsElements = {
    scoreRing: document.getElementById('scoreRing'),
    scoreValue: document.getElementById('scoreValue'),
    recommendationBadge: document.getElementById('recommendationBadge'),
    recommendationTitle: document.getElementById('recommendationTitle'),
    recommendationText: document.getElementById('recommendationText'),
    breakdownItems: document.getElementById('breakdownItems'),
    btnTraining: document.getElementById('btnTraining')
};

// Calculate and show results
function showResults() {
    const scores = calculateScores();
    const totalScore = scores.total;
    const recommendation = getRecommendation(totalScore);

    // Show results screen
    showScreen('results');

    // Animate score ring
    setTimeout(() => {
        animateScore(totalScore);
        displayRecommendation(recommendation, scores);
        displayBreakdown(scores);
    }, 100);
}

// Calculate all scores
function calculateScores() {
    let mcScore = 0;
    let maxMcScore = 0;
    let categoryScores = {
        ai_begrip: { correct: 0, total: 0, maxPoints: 0 },
        context: { correct: 0, total: 0, maxPoints: 0 },
        prompting: { correct: 0, total: 0, maxPoints: 0 }
    };

    // Calculate MC question scores
    questions.forEach(q => {
        const pointsPerQuestion = 10 * q.weight;
        maxMcScore += pointsPerQuestion;

        if (categoryScores[q.categoryKey]) {
            categoryScores[q.categoryKey].total++;
            categoryScores[q.categoryKey].maxPoints += pointsPerQuestion;
        }

        const userAnswer = state.answers[q.id];
        const correctAnswer = q.answers.find(a => a.correct);

        if (userAnswer === correctAnswer.letter) {
            mcScore += pointsPerQuestion;
            if (categoryScores[q.categoryKey]) {
                categoryScores[q.categoryKey].correct++;
            }
        }
    });

    // Normalize MC score to 80 points max
    const normalizedMcScore = Math.round((mcScore / maxMcScore) * 80);

    // Calculate prompt score (0-20 points)
    let promptScore = 0;
    if (state.promptScore) {
        // Prompt score is 0-10, multiply by 2 for 0-20 range
        promptScore = state.promptScore.totaal * promptExercise.scoreMultiplier;
    }

    // Total score out of 100
    const totalScore = normalizedMcScore + promptScore;

    return {
        total: Math.round(totalScore),
        mc: normalizedMcScore,
        prompt: promptScore,
        categories: categoryScores,
        promptDetails: state.promptScore
    };
}

// Get recommendation based on score
function getRecommendation(score) {
    if (score <= 70) {
        return { ...recommendations.session1, key: 'session1' };
    } else {
        return { ...recommendations.session2, key: 'session2' };
    }
}

// Get weak areas based on category scores
function getWeakAreas(scores) {
    const weakAreas = [];

    // Check AI Begrip (4 questions)
    const aiBegripPct = scores.categories.ai_begrip.correct / scores.categories.ai_begrip.total;
    if (aiBegripPct < 0.5) {
        weakAreas.push({
            category: 'AI Begrip',
            description: 'Hoe AI werkt, hallucinaties herkennen en output verifiëren'
        });
    }

    // Check Context & Prompting (4 questions combined)
    const contextCorrect = scores.categories.context.correct + scores.categories.prompting.correct;
    const contextTotal = scores.categories.context.total + scores.categories.prompting.total;
    const contextPct = contextCorrect / contextTotal;
    if (contextPct < 0.5) {
        weakAreas.push({
            category: 'Context & Prompting',
            description: 'Context effectief inzetten en specifieke prompts schrijven'
        });
    }

    // Check Praktijkopdracht (score out of 10)
    const promptScore = scores.promptDetails ? scores.promptDetails.totaal : 0;
    if (promptScore < 5) {
        weakAreas.push({
            category: 'Praktijkopdracht',
            description: 'Effectieve prompts formuleren voor zakelijke taken'
        });
    }

    return weakAreas;
}

// Animate score display
function animateScore(targetScore) {
    const duration = 1000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentScore = 0;
    const increment = targetScore / steps;

    // Score ring animation
    const circumference = 2 * Math.PI * 54; // radius = 54
    const maxOffset = circumference;

    const interval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(interval);
        }

        // Update score value
        resultsElements.scoreValue.textContent = Math.round(currentScore);

        // Update ring
        const progress = currentScore / 100;
        const offset = maxOffset - (progress * maxOffset);
        resultsElements.scoreRing.style.strokeDashoffset = offset;

        // Change color based on score (binary threshold at 70)
        if (currentScore <= 70) {
            resultsElements.scoreRing.style.stroke = '#E85A4F';
        } else {
            resultsElements.scoreRing.style.stroke = '#58CC02';
        }
    }, stepDuration);
}

// Display recommendation
function displayRecommendation(recommendation, scores) {
    // Hide the redundant badge (title already shows recommendation)
    resultsElements.recommendationBadge.style.display = 'none';
    resultsElements.recommendationTitle.textContent = recommendation.title;
    resultsElements.recommendationText.textContent = recommendation.text;

    // Set training button URL (get element fresh in case it wasn't ready at init)
    const btnTraining = document.getElementById('btnTraining');
    if (btnTraining && recommendation.trainingUrl) {
        btnTraining.href = recommendation.trainingUrl;
    }

    // Display weak areas
    displayWeakAreas(scores, recommendation.key);
}

// Display weak areas explanation
function displayWeakAreas(scores, recommendationKey) {
    const weakAreas = getWeakAreas(scores);

    // Find or create weak areas container
    let weakAreasContainer = document.getElementById('weakAreasContainer');
    if (!weakAreasContainer) {
        weakAreasContainer = document.createElement('div');
        weakAreasContainer.id = 'weakAreasContainer';
        weakAreasContainer.className = 'weak-areas';
        const recommendationEl = document.querySelector('.results-recommendation');
        if (recommendationEl) {
            recommendationEl.appendChild(weakAreasContainer);
        }
    }

    if (weakAreas.length === 0) {
        // No weak areas - show positive reinforcement for W2
        if (recommendationKey === 'session2') {
            weakAreasContainer.innerHTML = `
                <div class="weak-areas__positive">
                    <span class="weak-areas__icon">✓</span>
                    <span>Je scoorde goed op alle onderdelen!</span>
                </div>
            `;
        } else {
            weakAreasContainer.innerHTML = '';
        }
    } else {
        // Show weak areas with explanations
        const weakAreasList = weakAreas.map(area => `
            <li>
                <strong>${area.category}</strong>: ${area.description}
            </li>
        `).join('');

        weakAreasContainer.innerHTML = `
            <div class="weak-areas__header">Jouw aandachtspunten:</div>
            <ul class="weak-areas__list">
                ${weakAreasList}
            </ul>
        `;
    }

    // Add wrong answers collapsible section
    displayWrongAnswers(weakAreasContainer);
}

// Get wrong answers data
function getWrongAnswers() {
    const wrongAnswers = [];

    questions.forEach(q => {
        const userAnswer = state.answers[q.id];
        const correctAnswer = q.answers.find(a => a.correct);

        if (userAnswer !== correctAnswer.letter) {
            const userAnswerObj = q.answers.find(a => a.letter === userAnswer);
            wrongAnswers.push({
                question: q.question,
                userAnswer: userAnswer,
                userAnswerText: userAnswerObj ? userAnswerObj.text : '(niet beantwoord)',
                correctAnswer: correctAnswer.letter,
                correctAnswerText: correctAnswer.text,
                explanation: q.explanation
            });
        }
    });

    return wrongAnswers;
}

// Display "view mistakes" link (replaces inline wrong answers)
function displayWrongAnswers(container) {
    const wrongAnswers = getWrongAnswers();

    // Remove any existing wrong answers section or link
    const existingSection = document.getElementById('wrongAnswersSection');
    if (existingSection) existingSection.remove();
    const existingLink = document.getElementById('viewMistakesLink');
    if (existingLink) existingLink.remove();

    if (wrongAnswers.length === 0) {
        return;
    }

    // Create "view mistakes" link
    const link = document.createElement('button');
    link.id = 'viewMistakesLink';
    link.className = 'view-mistakes-link';
    link.innerHTML = `
        Bekijk je ${wrongAnswers.length} ${wrongAnswers.length === 1 ? 'fout' : 'fouten'}
        <svg viewBox="0 0 256 256" fill="currentColor">
            <path d="M221.66 133.66l-72 72a8 8 0 0 1-11.32-11.32L196.69 136H40a8 8 0 0 1 0-16h156.69l-58.35-58.34a8 8 0 0 1 11.32-11.32l72 72a8 8 0 0 1 0 11.32z"/>
        </svg>
    `;
    link.onclick = openDrawer;
    container.appendChild(link);
}

// Open mistakes drawer
function openDrawer() {
    const wrongAnswers = getWrongAnswers();
    const drawer = document.getElementById('mistakesDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const content = document.getElementById('drawerContent');
    const countEl = document.getElementById('mistakeCount');

    if (!drawer || !content) return;

    // Update count
    if (countEl) countEl.textContent = wrongAnswers.length;

    // Render mistake cards
    content.innerHTML = wrongAnswers.map(wa => `
        <div class="mistake-card">
            <div class="mistake-card__question">${wa.question}</div>
            <div class="mistake-answer mistake-answer--wrong">
                <span class="mistake-icon">✗</span>
                <span>${wa.userAnswer}. ${wa.userAnswerText}</span>
            </div>
            <div class="mistake-answer mistake-answer--correct">
                <span class="mistake-icon">✓</span>
                <span>${wa.correctAnswer}. ${wa.correctAnswerText}</span>
            </div>
            <div class="mistake-card__explanation">→ ${wa.explanation}</div>
        </div>
    `).join('');

    // Open drawer
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Close mistakes drawer
function closeDrawer() {
    const drawer = document.getElementById('mistakesDrawer');
    const overlay = document.getElementById('drawerOverlay');

    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
}

// Display score breakdown
function displayBreakdown(scores) {
    const items = [
        {
            label: 'AI Begrip',
            score: scores.categories.ai_begrip.correct,
            max: scores.categories.ai_begrip.total
        },
        {
            label: 'Context & Prompting',
            score: scores.categories.context.correct + scores.categories.prompting.correct,
            max: scores.categories.context.total + scores.categories.prompting.total
        },
        {
            label: 'Praktijkopdracht',
            score: scores.promptDetails ? scores.promptDetails.totaal : 0,
            max: 10
        }
    ];

    resultsElements.breakdownItems.innerHTML = items.map(item => {
        const percentage = (item.score / item.max) * 100;
        return `
            <div class="breakdown-item">
                <span class="breakdown-item__label">${item.label}</span>
                <div class="breakdown-item__bar">
                    <div class="breakdown-item__fill" style="width: ${percentage}%"></div>
                </div>
                <span class="breakdown-item__score">${item.score}/${item.max}</span>
            </div>
        `;
    }).join('');
}

// Download result as PNG
async function downloadResult(format = 'png') {
    const resultsScreen = document.getElementById('screenResults');
    const content = resultsScreen.querySelector('.screen__content');

    try {
        // Create canvas from results content
        const canvas = await html2canvas(content, {
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false,
            useCORS: true
        });

        if (format === 'png') {
            // Download as PNG
            const link = document.createElement('a');
            link.download = 'copilot-academy-kennistest-resultaat.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    } catch (error) {
        console.error('Error generating image:', error);
        alert('Er ging iets mis bij het downloaden. Probeer het opnieuw.');
    }
}

// Share result (if Web Share API is available)
async function shareResult() {
    const scores = calculateScores();
    const recommendation = getRecommendation(scores.total);

    const shareData = {
        title: 'Mijn AI Kennistest Resultaat',
        text: `Ik heb ${scores.total}/100 gescoord op de AI Kennistest van Copilot Academy! Aanbeveling: ${recommendation.title}`,
        url: 'https://test.copilot-academy.nl'
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            console.log('Share cancelled or failed:', error);
        }
    } else {
        // Fallback: copy to clipboard
        const text = `${shareData.text}\n${shareData.url}`;
        navigator.clipboard.writeText(text).then(() => {
            alert('Link gekopieerd naar klembord!');
        });
    }
}
