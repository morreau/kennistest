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
        displayRecommendation(recommendation);
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
    if (score <= scoreThresholds.session1.max) {
        return { ...recommendations.session1, key: 'session1' };
    } else if (score <= scoreThresholds.session2.max) {
        return { ...recommendations.session2, key: 'session2' };
    } else if (score <= scoreThresholds.workflow.max) {
        return { ...recommendations.workflow, key: 'workflow' };
    } else {
        return { ...recommendations.advanced, key: 'advanced' };
    }
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

        // Change color based on score
        if (currentScore <= 60) {
            resultsElements.scoreRing.style.stroke = '#E85A4F';
        } else if (currentScore <= 80) {
            resultsElements.scoreRing.style.stroke = '#F7C52D';
        } else {
            resultsElements.scoreRing.style.stroke = '#58CC02';
        }
    }, stepDuration);
}

// Display recommendation
function displayRecommendation(recommendation) {
    resultsElements.recommendationBadge.textContent = recommendation.badge;
    resultsElements.recommendationBadge.className = `recommendation-badge recommendation-badge--${recommendation.key}`;
    resultsElements.recommendationTitle.textContent = recommendation.title;
    resultsElements.recommendationText.textContent = recommendation.text;

    // Set training button URL (get element fresh in case it wasn't ready at init)
    const btnTraining = document.getElementById('btnTraining');
    if (btnTraining && recommendation.trainingUrl) {
        btnTraining.href = recommendation.trainingUrl;
    }
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
