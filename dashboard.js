// Focus Coach Dashboard Script

function formatTime(milliseconds) {
  const totalMinutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function generateTips(score, categoryStats) {
  const tips = [];
  
  if (score < 50) {
    tips.push('Close unnecessary browser tabs');
    tips.push('Use the Pomodoro Technique (25 min focus + 5 min break)');
    tips.push('Turn off notifications for a focused session');
  } else if (score < 70) {
    tips.push('You\'re doing well! Take structured breaks');
    tips.push('Try time-blocking for your most important work');
    tips.push('Set specific goals for each focus session');
  } else {
    tips.push('Excellent focus today! Keep it up!');
    tips.push('Share your strategy with colleagues');
    tips.push('Consider a longer focus session tomorrow');
  }
  
  if (categoryStats.social > categoryStats.productive) {
    tips.push('Try blocking social media during work hours');
  }
  
  if (categoryStats.video > 0) {
    tips.push('Consider scheduling video time as a reward after work');
  }
  
  return tips.slice(0, 4);
}

function updateDashboard(response) {
  const { dailyScore, dailyFeedback, categoryStats, dailyLog } = response;
  
  // Update header
  document.getElementById('dailyScoreDisplay').textContent = Math.round(dailyScore);
  document.getElementById('dailyEmoji').textContent = dailyFeedback.emoji;
  document.getElementById('dateDisplay').textContent = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  document.getElementById('timeDisplay').textContent = new Date().toLocaleTimeString();
  
  // Update feedback
  document.getElementById('feedbackEmoji').textContent = dailyFeedback.emoji;
  document.getElementById('feedbackTitle').textContent = dailyFeedback.message;
  document.getElementById('feedbackText').textContent = dailyFeedback.details;
  
  // Update tips
  const tips = generateTips(dailyScore, categoryStats);
  const tipsList = document.getElementById('tips');
  tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
  
  // Calculate totals
  const totalTime = Object.values(categoryStats).reduce((a, b) => a + b, 0);
  const productivePercent = totalTime > 0 ? (categoryStats.productive / totalTime) * 100 : 0;
  
  // Update time categories
  document.getElementById('productive-time').textContent = formatTime(categoryStats.productive);
  document.getElementById('neutral-time').textContent = formatTime(categoryStats.neutral);
  document.getElementById('ecommerce-time').textContent = formatTime(categoryStats.ecommerce);
  document.getElementById('video-time').textContent = formatTime(categoryStats.video);
  document.getElementById('social-time').textContent = formatTime(categoryStats.social);
  
  // Update progress bars
  if (totalTime > 0) {
    document.getElementById('productive-bar').style.width = (categoryStats.productive / totalTime) * 100 + '%';
    document.getElementById('neutral-bar').style.width = (categoryStats.neutral / totalTime) * 100 + '%';
    document.getElementById('ecommerce-bar').style.width = (categoryStats.ecommerce / totalTime) * 100 + '%';
    document.getElementById('video-bar').style.width = (categoryStats.video / totalTime) * 100 + '%';
    document.getElementById('social-bar').style.width = (categoryStats.social / totalTime) * 100 + '%';
  }
  
  document.getElementById('productiveTimeDisplay').textContent = Math.round(productivePercent) + '%';
  
  // Update statistics
  document.getElementById('total-time').textContent = formatTime(totalTime);
  document.getElementById('tab-switches').textContent = dailyLog.length;
  
  if (dailyLog.length > 0) {
    const avgSessionTime = totalTime / dailyLog.length;
    document.getElementById('avg-session').textContent = formatTime(avgSessionTime);
  }
  
  // Calculate distraction percentage
  const distractionScore = 100 - dailyScore;
  document.getElementById('distraction').textContent = Math.round(distractionScore) + '%';
  
  // Focus rating (0-10 scale)
  const focusRating = Math.round(dailyScore / 10);
  document.getElementById('focus-rating').textContent = focusRating + '/10';
  
  // Color code the score
  const scoreContainer = document.querySelector('.header');
  if (dailyScore >= 85) {
    scoreContainer.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
  } else if (dailyScore >= 70) {
    scoreContainer.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  } else if (dailyScore >= 50) {
    scoreContainer.style.background = 'linear-gradient(135deg, #FF9800 0%, #E65100 100%)';
  } else {
    scoreContainer.style.background = 'linear-gradient(135deg, #F44336 0%, #C62828 100%)';
  }
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ action: 'getCurrentScore' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error:', chrome.runtime.lastError);
      return;
    }
    updateDashboard(response);
  });

  // Add event listeners for buttons
  document.getElementById('refreshBtn').addEventListener('click', () => {
    location.reload();
  });
  document.getElementById('closeBtn').addEventListener('click', () => {
    window.close();
  });
});
