// Focus Coach Popup Script

function formatTime(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m`;
}

function updateUI(data) {
  const { hourlyScore, dailyScore, hourlyFeedback, dailyFeedback, categoryStats } = data;
  
  // Update hourly score
  document.getElementById('hourlyScore').textContent = Math.round(hourlyScore);
  document.getElementById('hourlyEmoji').textContent = hourlyFeedback.emoji;
  document.getElementById('hourlyMessage').textContent = hourlyFeedback.message;
  document.getElementById('hourlyFeedback').textContent = hourlyFeedback.details;
  document.getElementById('hourlyBar').style.width = hourlyScore + '%';
  
  // Update daily score
  document.getElementById('dailyScore').textContent = Math.round(dailyScore);
  document.getElementById('dailyEmoji').textContent = dailyFeedback.emoji;
  document.getElementById('dailyMessage').textContent = dailyFeedback.message;
  document.getElementById('dailyFeedback').textContent = dailyFeedback.details;
  document.getElementById('dailyBar').style.width = dailyScore + '%';
  
  // Update category stats
  document.getElementById('stat-productive').textContent = formatTime(categoryStats.productive);
  document.getElementById('stat-neutral').textContent = formatTime(categoryStats.neutral);
  document.getElementById('stat-social').textContent = formatTime(categoryStats.social);
  document.getElementById('stat-video').textContent = formatTime(categoryStats.video);
  document.getElementById('stat-ecommerce').textContent = formatTime(categoryStats.ecommerce);
  
  // Show content, hide loading
  document.getElementById('loading').style.display = 'none';
  document.getElementById('content').style.display = 'block';
}

function refreshData() {
  document.getElementById('loading').style.display = 'block';
  document.getElementById('content').style.display = 'none';
  
  chrome.runtime.sendMessage({ action: 'getCurrentScore' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error:', chrome.runtime.lastError);
      return;
    }
    updateUI(response);
  });
}

function openDashboard() {
  chrome.tabs.create({ url: 'dashboard.html' });
}

// Load data on popup open
document.addEventListener('DOMContentLoaded', () => {
  refreshData();

  // Add event listeners for buttons
  document.getElementById('refreshBtn').addEventListener('click', refreshData);
  document.getElementById('dashboardBtn').addEventListener('click', openDashboard);

  // Refresh every 10 seconds
  setInterval(refreshData, 10000);
});
