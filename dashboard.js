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
  
  // Update default time categories
  document.getElementById('productive-time').textContent = formatTime(categoryStats.productive || 0);
  document.getElementById('neutral-time').textContent = formatTime(categoryStats.neutral || 0);
  document.getElementById('ecommerce-time').textContent = formatTime(categoryStats.ecommerce || 0);
  document.getElementById('video-time').textContent = formatTime(categoryStats.video || 0);
  document.getElementById('social-time').textContent = formatTime(categoryStats.social || 0);
  
  // Update progress bars
  if (totalTime > 0) {
    document.getElementById('productive-bar').style.width = ((categoryStats.productive || 0) / totalTime) * 100 + '%';
    document.getElementById('neutral-bar').style.width = ((categoryStats.neutral || 0) / totalTime) * 100 + '%';
    document.getElementById('ecommerce-bar').style.width = ((categoryStats.ecommerce || 0) / totalTime) * 100 + '%';
    document.getElementById('video-bar').style.width = ((categoryStats.video || 0) / totalTime) * 100 + '%';
    document.getElementById('social-bar').style.width = ((categoryStats.social || 0) / totalTime) * 100 + '%';
  }

  // Add custom categories to the time stats
  const defaultCategories = ['productive', 'neutral', 'ecommerce', 'video', 'social', 'unknown'];
  const customCategoryStats = Object.entries(categoryStats).filter(([cat]) => !defaultCategories.includes(cat));

  if (customCategoryStats.length > 0) {
    const timeByCategory = document.querySelector('.card h2');
    if (timeByCategory && timeByCategory.textContent === '⏱️ Time by Category') {
      const container = timeByCategory.parentElement;

      // Add custom categories
      customCategoryStats.forEach(([categoryName, time]) => {
        if (time > 0) {
          const statRow = document.createElement('div');
          statRow.className = 'stat-row';
          statRow.style.marginTop = '12px';

          const percent = totalTime > 0 ? (time / totalTime) * 100 : 0;

          statRow.innerHTML = `
            <span class="stat-label">
              <span class="stat-icon" style="background: #9E9E9E;">⚡</span>
              ${categoryName}
            </span>
            <span class="stat-value">${formatTime(time)}</span>
          `;

          container.appendChild(statRow);

          const bar = document.createElement('div');
          bar.className = 'bar';
          bar.innerHTML = `<div class="bar-fill" style="background: #9E9E9E; width: ${percent}%"></div>`;
          container.appendChild(bar);
        }
      });
    }
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

// Load and display default categories
function loadDefaultCategories() {
  chrome.runtime.sendMessage({ action: 'getDefaultCategories' }, (response) => {
    const container = document.getElementById('defaultCategoriesList');
    if (!container) return;

    const categories = response.categories || {};
    const distractionLevels = response.distractionLevels || {
      productive: 0,
      neutral: 20,
      ecommerce: 50,
      video: 80,
      social: 95
    };

    const categoryIcons = {
      productive: '✓',
      neutral: '📧',
      ecommerce: '🛍️',
      video: '▶️',
      social: '📱'
    };

    const categoryColors = {
      productive: '#4CAF50',
      neutral: '#9C27B0',
      ecommerce: '#F44336',
      video: '#2196F3',
      social: '#FF9800'
    };

    container.innerHTML = Object.entries(categories).map(([categoryName, sites]) => {
      const distraction = distractionLevels[categoryName] || 0;
      const icon = categoryIcons[categoryName] || '📁';
      const color = categoryColors[categoryName] || '#666';
      const categoryId = `category-${categoryName}`;

      const sitesHTML = sites.map(site => `
        <span style="display: inline-flex; align-items: center; gap: 4px; background: ${color}15; color: ${color}; border: 1px solid ${color}40; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">
          ${site}
          <button class="remove-site-btn" data-category="${categoryName}" data-site="${site}"
                  style="background: none; border: none; color: ${color}; cursor: pointer; padding: 0; margin-left: 2px; font-size: 14px; font-weight: bold; line-height: 1;">×</button>
        </span>
      `).join('');

      return `
        <div style="border: 1px solid #e0e0e0; padding: 12px; margin-bottom: 10px; border-radius: 6px; background: #fafafa;">
          <div class="category-header" data-category="${categoryName}" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span style="font-size: 16px;">${icon}</span>
                <strong style="font-size: 14px; color: #333; text-transform: capitalize;">${categoryName}</strong>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="background: ${distraction <= 25 ? '#c8e6c9' : distraction <= 50 ? '#fff9c4' : distraction <= 75 ? '#ffe0b2' : '#ffcdd2'}; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; color: #333;">
                    <span id="display-${categoryName}">${distraction}%</span> distraction
                  </span>
                  <button class="edit-percentage-btn" data-category="${categoryName}"
                          style="background: none; border: 1px solid #ddd; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-size: 10px; color: #666;">
                    ✎ Edit
                  </button>
                  <input type="number" id="edit-input-${categoryName}" class="percentage-edit-input" data-category="${categoryName}"
                         min="0" max="100" value="${distraction}"
                         style="display: none; width: 50px; padding: 4px; border: 1px solid #667eea; border-radius: 4px; font-size: 11px;">
                  <button class="save-percentage-btn" data-category="${categoryName}"
                          style="display: none; background: #4CAF50; color: white; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">
                    Save
                  </button>
                </div>
                <span style="font-size: 11px; color: #999;">(${sites.length} sites)</span>
              </div>
            </div>
            <span id="arrow-${categoryName}" style="font-size: 18px; transition: transform 0.3s;">▼</span>
          </div>

          <div id="${categoryId}" style="display: none; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;" id="sites-${categoryName}">
              ${sitesHTML}
            </div>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="newSite-${categoryName}" placeholder="Add site (e.g., example.com)"
                     style="flex: 1; padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">
              <button class="add-site-btn" data-category="${categoryName}"
                      style="background: ${color}; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600; white-space: nowrap;">+ Add</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Add event listeners for category headers (toggle expand/collapse)
    container.querySelectorAll('.category-header').forEach(header => {
      header.addEventListener('click', () => {
        const categoryName = header.getAttribute('data-category');
        toggleCategory(categoryName);
      });
    });

    // Add event listeners for remove site buttons
    container.querySelectorAll('.remove-site-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const categoryName = btn.getAttribute('data-category');
        const site = btn.getAttribute('data-site');
        removeSiteFromDefault(categoryName, site);
      });
    });

    // Add event listeners for add site buttons
    container.querySelectorAll('.add-site-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const categoryName = btn.getAttribute('data-category');
        addSiteToDefault(categoryName);
      });
    });

    // Add event listeners for edit percentage buttons
    container.querySelectorAll('.edit-percentage-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const categoryName = btn.getAttribute('data-category');
        startEditingPercentage(categoryName);
      });
    });

    // Add event listeners for save percentage buttons
    container.querySelectorAll('.save-percentage-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const categoryName = btn.getAttribute('data-category');
        savePercentage(categoryName);
      });
    });
  });
}

// Toggle category expand/collapse
function toggleCategory(categoryName) {
  const content = document.getElementById(`category-${categoryName}`);
  const arrow = document.getElementById(`arrow-${categoryName}`);

  if (content.style.display === 'none') {
    content.style.display = 'block';
    arrow.style.transform = 'rotate(180deg)';
  } else {
    content.style.display = 'none';
    arrow.style.transform = 'rotate(0deg)';
  }
}

// Add site to default category
function addSiteToDefault(categoryName) {
  const input = document.getElementById(`newSite-${categoryName}`);
  const site = input.value.trim().toLowerCase();

  if (!site) {
    alert('Please enter a website');
    return;
  }

  chrome.runtime.sendMessage({
    action: 'addSiteToDefaultCategory',
    categoryName: categoryName,
    site: site
  }, (response) => {
    if (response.success) {
      input.value = '';
      loadDefaultCategories();
    }
  });
}

// Remove site from default category
function removeSiteFromDefault(categoryName, site) {
  if (!confirm(`Remove "${site}" from ${categoryName}?`)) return;

  chrome.runtime.sendMessage({
    action: 'removeSiteFromDefaultCategory',
    categoryName: categoryName,
    site: site
  }, (response) => {
    if (response.success) {
      loadDefaultCategories();
    }
  });
}

// Start editing percentage
function startEditingPercentage(categoryName) {
  const editBtn = document.querySelector(`.edit-percentage-btn[data-category="${categoryName}"]`);
  const input = document.getElementById(`edit-input-${categoryName}`);
  const saveBtn = document.querySelector(`.save-percentage-btn[data-category="${categoryName}"]`);
  const display = document.getElementById(`display-${categoryName}`);

  editBtn.style.display = 'none';
  display.parentElement.style.display = 'none';
  input.style.display = 'inline-block';
  saveBtn.style.display = 'inline-block';
  input.focus();
}

// Save percentage
function savePercentage(categoryName) {
  const input = document.getElementById(`edit-input-${categoryName}`);
  const newLevel = parseInt(input.value);

  if (isNaN(newLevel) || newLevel < 0 || newLevel > 100) {
    alert('Please enter a number between 0 and 100');
    return;
  }

  chrome.runtime.sendMessage({
    action: 'setCustomDistractionLevel',
    categoryName: categoryName,
    level: newLevel
  }, (response) => {
    if (response.success) {
      loadDefaultCategories();
    }
  });
}

// Load and display custom categories
function loadCustomCategories() {
  chrome.runtime.sendMessage({ action: 'getCustomCategories' }, (response) => {
    const container = document.getElementById('customCategoriesList');
    if (!container) return;

    const categories = response.customCategories || {};

    if (Object.keys(categories).length === 0) {
      container.innerHTML = '<p style="color: #999; font-size: 12px; font-style: italic;">No custom categories yet. Add one below!</p>';
      return;
    }

    container.innerHTML = Object.entries(categories).map(([name, data]) => {
      const color = '#9E9E9E'; // Gray color for custom categories
      const distraction = data.score;

      const sitesHTML = data.sites.map(site => `
        <span style="display: inline-flex; align-items: center; gap: 4px; background: ${color}15; color: ${color}; border: 1px solid ${color}40; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">
          ${site}
          <button class="remove-custom-site-btn" data-category="${name}" data-site="${site}"
                  style="background: none; border: none; color: ${color}; cursor: pointer; padding: 0; margin-left: 2px; font-size: 14px; font-weight: bold; line-height: 1;">×</button>
        </span>
      `).join('');

      return `
        <div style="border: 1px solid #e0e0e0; padding: 12px; margin-bottom: 10px; border-radius: 6px; background: #fafafa;">
          <div class="custom-category-header" data-category="${name}" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span style="font-size: 16px;">⚡</span>
                <strong style="font-size: 14px; color: #333;">${name}</strong>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="background: ${distraction <= 25 ? '#c8e6c9' : distraction <= 50 ? '#fff9c4' : distraction <= 75 ? '#ffe0b2' : '#ffcdd2'}; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; color: #333;">
                    <span id="custom-display-${name}">${distraction}%</span> distraction
                  </span>
                  <button class="edit-custom-percentage-btn" data-category="${name}"
                          style="background: none; border: 1px solid #ddd; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-size: 10px; color: #666;">
                    ✎ Edit
                  </button>
                  <input type="number" id="custom-edit-input-${name}" class="custom-percentage-edit-input" data-category="${name}"
                         min="0" max="100" value="${distraction}"
                         style="display: none; width: 50px; padding: 4px; border: 1px solid #667eea; border-radius: 4px; font-size: 11px;">
                  <button class="save-custom-percentage-btn" data-category="${name}"
                          style="display: none; background: #4CAF50; color: white; border: none; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">
                    Save
                  </button>
                </div>
                <span style="font-size: 11px; color: #999;">(${data.sites.length} sites)</span>
              </div>
            </div>
            <div style="display: flex; gap: 6px; align-items: center;">
              <span id="custom-arrow-${name}" style="font-size: 18px; transition: transform 0.3s;">▼</span>
            </div>
          </div>

          <div id="custom-category-${name}" style="display: none; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;">
              ${sitesHTML}
            </div>
            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
              <input type="text" id="newCustomSite-${name}" placeholder="Add site (e.g., example.com)"
                     style="flex: 1; padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">
              <button class="add-custom-site-btn" data-category="${name}"
                      style="background: ${color}; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600; white-space: nowrap;">+ Add</button>
            </div>
            <div style="display: flex; justify-content: flex-end;">
              <button class="delete-category-btn" data-category-name="${name.replace(/"/g, '&quot;')}"
                      style="background: #F44336; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600;">
                🗑️ Delete Category
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Add event listeners for custom category headers (toggle expand/collapse)
    container.querySelectorAll('.custom-category-header').forEach(header => {
      header.addEventListener('click', () => {
        const categoryName = header.getAttribute('data-category');
        toggleCustomCategory(categoryName);
      });
    });

    // Add event listeners for remove site buttons
    container.querySelectorAll('.remove-custom-site-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const categoryName = btn.getAttribute('data-category');
        const site = btn.getAttribute('data-site');
        removeSiteFromCustom(categoryName, site);
      });
    });

    // Add event listeners for add site buttons
    container.querySelectorAll('.add-custom-site-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const categoryName = btn.getAttribute('data-category');
        addSiteToCustom(categoryName);
      });
    });

    // Add event listeners for edit percentage buttons
    container.querySelectorAll('.edit-custom-percentage-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const categoryName = btn.getAttribute('data-category');
        startEditingCustomPercentage(categoryName);
      });
    });

    // Add event listeners for save percentage buttons
    container.querySelectorAll('.save-custom-percentage-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const categoryName = btn.getAttribute('data-category');
        saveCustomPercentage(categoryName);
      });
    });

    // Add event listeners to delete buttons
    container.querySelectorAll('.delete-category-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const categoryName = btn.getAttribute('data-category-name');
        deleteCategory(categoryName);
      });
    });
  });
}

// Add new custom category
function addCustomCategory() {
  const name = document.getElementById('categoryName').value.trim();
  const sitesInput = document.getElementById('categorySites').value.trim();
  const score = parseInt(document.getElementById('categoryScore').value);

  if (!name || !sitesInput) {
    alert('Please fill in category name and websites');
    return;
  }

  if (isNaN(score) || score < 0 || score > 100) {
    alert('Score must be between 0 and 100');
    return;
  }

  const sites = sitesInput.split(',').map(s => s.trim()).filter(s => s);

  if (sites.length === 0) {
    alert('Please enter at least one website');
    return;
  }

  chrome.runtime.sendMessage({
    action: 'saveCustomCategory',
    categoryName: name,
    sites: sites,
    score: score
  }, () => {
    // Show success message
    const addBtn = document.getElementById('addCategoryBtn');
    const originalText = addBtn.textContent;
    addBtn.textContent = `✓ Added "${name}" with ${sites.length} site${sites.length > 1 ? 's' : ''}!`;
    addBtn.style.background = '#4CAF50';

    // Clear inputs
    document.getElementById('categoryName').value = '';
    document.getElementById('categorySites').value = '';
    document.getElementById('categoryScore').value = '0';

    // Reload list
    loadCustomCategories();

    // Reset button after 2 seconds
    setTimeout(() => {
      addBtn.textContent = originalText;
      addBtn.style.background = '';
    }, 2000);
  });
}

// Toggle custom category expand/collapse
function toggleCustomCategory(categoryName) {
  const content = document.getElementById(`custom-category-${categoryName}`);
  const arrow = document.getElementById(`custom-arrow-${categoryName}`);

  if (content.style.display === 'none') {
    content.style.display = 'block';
    arrow.style.transform = 'rotate(180deg)';
  } else {
    content.style.display = 'none';
    arrow.style.transform = 'rotate(0deg)';
  }
}

// Add site to custom category
function addSiteToCustom(categoryName) {
  const input = document.getElementById(`newCustomSite-${categoryName}`);
  const site = input.value.trim().toLowerCase();

  if (!site) {
    alert('Please enter a website');
    return;
  }

  // Get current category data
  chrome.runtime.sendMessage({ action: 'getCustomCategories' }, (response) => {
    const categories = response.customCategories || {};
    const currentCategory = categories[categoryName];

    if (!currentCategory) {
      alert('Category not found');
      return;
    }

    // Add site if not already present
    if (!currentCategory.sites.includes(site)) {
      currentCategory.sites.push(site);

      // Save updated category
      chrome.runtime.sendMessage({
        action: 'saveCustomCategory',
        categoryName: categoryName,
        sites: currentCategory.sites,
        score: currentCategory.score
      }, () => {
        input.value = '';
        loadCustomCategories();
      });
    } else {
      alert('Site already exists in this category');
    }
  });
}

// Remove site from custom category
function removeSiteFromCustom(categoryName, site) {
  if (!confirm(`Remove "${site}" from ${categoryName}?`)) return;

  // Get current category data
  chrome.runtime.sendMessage({ action: 'getCustomCategories' }, (response) => {
    const categories = response.customCategories || {};
    const currentCategory = categories[categoryName];

    if (!currentCategory) {
      alert('Category not found');
      return;
    }

    // Remove site
    const updatedSites = currentCategory.sites.filter(s => s !== site);

    // Save updated category
    chrome.runtime.sendMessage({
      action: 'saveCustomCategory',
      categoryName: categoryName,
      sites: updatedSites,
      score: currentCategory.score
    }, () => {
      loadCustomCategories();
    });
  });
}

// Start editing custom category percentage
function startEditingCustomPercentage(categoryName) {
  const editBtn = document.querySelector(`.edit-custom-percentage-btn[data-category="${categoryName}"]`);
  const input = document.getElementById(`custom-edit-input-${categoryName}`);
  const saveBtn = document.querySelector(`.save-custom-percentage-btn[data-category="${categoryName}"]`);
  const display = document.getElementById(`custom-display-${categoryName}`);

  editBtn.style.display = 'none';
  display.parentElement.style.display = 'none';
  input.style.display = 'inline-block';
  saveBtn.style.display = 'inline-block';
  input.focus();
}

// Save custom category percentage
function saveCustomPercentage(categoryName) {
  const input = document.getElementById(`custom-edit-input-${categoryName}`);
  const newScore = parseInt(input.value);

  if (isNaN(newScore) || newScore < 0 || newScore > 100) {
    alert('Please enter a number between 0 and 100');
    return;
  }

  // Get current category data
  chrome.runtime.sendMessage({ action: 'getCustomCategories' }, (response) => {
    const categories = response.customCategories || {};
    const currentCategory = categories[categoryName];

    if (!currentCategory) {
      alert('Category not found');
      return;
    }

    // Save updated category with new score
    chrome.runtime.sendMessage({
      action: 'saveCustomCategory',
      categoryName: categoryName,
      sites: currentCategory.sites,
      score: newScore
    }, () => {
      loadCustomCategories();
    });
  });
}

// Delete custom category
function deleteCategory(name) {
  if (!confirm(`Delete category "${name}"?`)) return;

  chrome.runtime.sendMessage({
    action: 'deleteCustomCategory',
    categoryName: name
  }, () => {
    loadCustomCategories();
  });
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

  // Load default categories
  loadDefaultCategories();

  // Load custom categories
  loadCustomCategories();

  // Add event listeners for buttons
  document.getElementById('refreshBtn').addEventListener('click', () => {
    location.reload();
  });
  document.getElementById('closeBtn').addEventListener('click', () => {
    window.close();
  });

  const addBtn = document.getElementById('addCategoryBtn');
  if (addBtn) {
    addBtn.addEventListener('click', addCustomCategory);
  }
});
