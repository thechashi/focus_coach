// Focus Coach - Background Service Worker
// Tracks browsing habits and provides feedback

let sessionData = {
  currentTab: null,
  startTime: null,
  hourlyLogs: [], // Array of hourly focus scores
  dailyLog: [],   // Array of all sessions today
  categoryStats: {
    productive: 0,
    social: 0,
    video: 0,
    neutral: 0,
    unknown: 0,
    ecommerce: 0
  }
};

// Category classification rules
const categoryRules = {
  productive: [
    // Code & Development Platforms
    'github.com', 'gitlab.com', 'bitbucket.org', 'stackoverflow.com',
    'npmjs.org', 'npm.js', 'pypi.org', 'maven.apache.org',
    'rubygems.org', 'crates.io', 'packagist.org',

    // Learning Platforms
    'coursera.org', 'udemy.com', 'edx.org', 'codecademy.com',
    'treehouse.com', 'pluralsight.com', 'skillshare.com', 'datacamp.com',
    'linkedin.com/learning', 'khanacademy.org', 'mitopencourseware.org',

    // Technical Content & Blogs
    'medium.com', 'dev.to', 'hashnode.com', 'substack.com',
    'blog.', 'news.ycombinator.com',

    // Research & Academic
    'arxiv.org', 'scholar.google', 'researchgate.net', 'ieee.org',
    'acm.org', 'nature.com', 'science.org', 'springer.com',

    // Language & Framework Documentation
    'python.org', 'javascript.com', 'cplusplus.com', 'rust-lang.org',
    'golang.org', 'java.com', 'ruby-lang.org', 'php.net',
    'w3.org', 'mdn.mozilla.org', 'developer.mozilla.org', 'docs.',
    'documentation', 'api.', 'gitbook.io', 'readthedocs.org',

    // Generic Learning Keywords
    'tutorial', 'guide', 'learn', 'course', 'workshop', 'class',
    'academic', 'research', 'whitepaper', 'specification', 'standard',
    'conference', 'symposium', 'seminar'
  ],
  social: [
    // Facebook ecosystem
    'facebook.com', 'messenger.com', 'instagram.com',
    // Twitter/X
    'twitter.com', 'x.com',
    // Reddit
    'reddit.com', 'old.reddit.com',
    // TikTok
    'tiktok.com', 'vt.tiktok.com',
    // Snapchat
    'snapchat.com', 'snap.com',
    // Discord
    'discord.com', 'discordapp.com',
    // Pinterest
    'pinterest.com', 'pinterest.co.uk',
    // Telegram
    'telegram.org', 't.me',
    // WhatsApp Web
    'web.whatsapp.com',
    // Bluesky
    'bsky.app',
    // Mastodon
    'mastodon.social',
    // Threads
    'threads.net',
    // BeReal
    'bereal.com',
    // Nextdoor
    'nextdoor.com',
    // Quora
    'quora.com',
    // Tumblr
    'tumblr.com',
    // WeChat
    'web.wechat.com',
    // Viber
    'web.viber.com'
  ],
  video: [
    // YouTube
    'youtube.com', 'youtu.be', 'm.youtube.com',
    // Netflix
    'netflix.com', 'www.netflix.com',
    // Twitch
    'twitch.tv', 'www.twitch.tv',
    // Vimeo
    'vimeo.com', 'player.vimeo.com',
    // Disney+
    'disneyplus.com', 'www.disneyplus.com',
    // Hulu
    'hulu.com', 'www.hulu.com',
    // Amazon Prime Video
    'primevideo.com', 'amazon.com/primevideo',
    // Apple TV+
    'tv.apple.com',
    // HBO Max
    'hbomax.com', 'max.com',
    // Paramount+
    'paramountplus.com',
    // Peacock
    'peacocktv.com',
    // Pluto TV
    'pluto.tv',
    // Roku Channel
    'therokuchannel.com',
    // Dailymotion
    'dailymotion.com',
    // Rumble
    'rumble.com',
    // Odysee
    'odysee.com',
    // Bitchute
    'bitchute.com',
    // Crunchyroll
    'crunchyroll.com',
    // Funimation
    'funimation.com',
    // WeTV
    'wetv.vip',
    // Bilibili (Chinese)
    'bilibili.com',
    // Kick
    'kick.com',
    // DLive
    'dlive.tv'
  ],
  ecommerce: [
    // Amazon ecosystem
    'amazon.com', 'amazon.co.uk', 'amazon.de', 'amazon.fr',
    'amazon.in', 'amazon.jp', 'amazon.ca', 'amazon.com.au',
    // eBay
    'ebay.com', 'ebay.co.uk', 'ebay.de', 'ebay.fr',
    'ebay.com.au', 'ebay.ca',
    // Shopify stores
    'shopify.com', 'myshopify.com',
    // Alibaba ecosystem
    'alibaba.com', 'aliexpress.com', '1688.com',
    // Etsy
    'etsy.com', 'www.etsy.com',
    // Wish
    'wish.com',
    // Wayfair
    'wayfair.com',
    // Target
    'target.com',
    // Walmart
    'walmart.com',
    // Best Buy
    'bestbuy.com',
    // Home Depot
    'homedepot.com',
    // Lowe's
    'lowes.com',
    // Costco
    'costco.com',
    // Ikea
    'ikea.com',
    // H&M
    'hm.com',
    // Zara
    'zara.com',
    // ASOS
    'asos.com',
    // Fashion Nova
    'fashionnova.com',
    // Shein
    'shein.com',
    // Temu
    'temu.com',
    // PinDuoDuo
    'pinduoduo.com',
    // Mercado Libre
    'mercadolibre.com', 'ml.com',
    // OLX
    'olx.com',
    // Flipkart (India)
    'flipkart.com',
    // Myntra (India)
    'myntra.com',
    // Daraz (South Asia)
    'daraz.com',
    // Lazada (Southeast Asia)
    'lazada.com',
    // Shopee (Southeast Asia)
    'shopee.com', 'shopee.sg', 'shopee.ph',
    // 11street
    '11street.com',
    // QVC
    'qvc.com',
    // HSN
    'hsn.com',
    // GrubHub (food delivery, treat as shopping)
    'grubhub.com',
    // DoorDash
    'doordash.com',
    // Uber Eats
    'ubereats.com',
    // Instacart
    'instacart.com',
    // Airbnb (accommodation shopping)
    'airbnb.com',
    // Booking.com
    'booking.com',
    // Expedia
    'expedia.com',
    // Hotels.com
    'hotels.com',
    // eBid
    'ebid.net',
    // Mercari
    'mercari.com',
    // Poshmark
    'poshmark.com',
    // Depop
    'depop.com',
    // Vinted
    'vinted.com',
    // The RealReal
    'therealreal.com',
    // Vestiaire Collective
    'vestiairecollective.com'
  ],
  neutral: [
    'gmail.com', 'outlook.com', 'mail.', 'slack.com', 'google.com',
    'microsoft.com', 'notion.so', 'drive.google.com', 'calendar'
  ]
};

// Categorize URL based on domain
function categorizeURL(url) {
  try {
    const domain = new URL(url).hostname.toLowerCase();

    for (const [category, sites] of Object.entries(categoryRules)) {
      for (const site of sites) {
        if (domain.includes(site)) {
          return category;
        }
      }
    }
    return 'unknown';
  } catch (e) {
    return 'unknown';
  }
}

// Get distraction level for current URL
function getDistractionLevel(category) {
  const distractionMap = {
    productive: 0,    // 0% distraction
    neutral: 20,      // 20% distraction (email breaks are ok)
    ecommerce: 50,    // 50% distraction (shopping is distracting)
    video: 80,        // 80% distraction
    social: 95,       // 95% distraction (very distracting)
    unknown: 1       // 40% distraction (assume moderate)
  };
  return distractionMap[category] || 40;
}

// Track when user switches tabs
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (chrome.runtime.lastError) return;

    const now = Date.now();

    // Log previous tab session if exists
    if (sessionData.currentTab) {
      const duration = now - sessionData.startTime;
      const category = categorizeURL(sessionData.currentTab.url);

      let domain = 'unknown';
      try {
        domain = new URL(sessionData.currentTab.url).hostname;
      } catch (e) {
        // Invalid URL (chrome://, about:blank, etc.)
        domain = sessionData.currentTab.url || 'unknown';
      }

      const entry = {
        url: sessionData.currentTab.url,
        domain: domain,
        category: category,
        duration: duration,
        timestamp: sessionData.startTime,
        distractionLevel: getDistractionLevel(category)
      };

      sessionData.dailyLog.push(entry);
      sessionData.categoryStats[category] += duration;

      // Save to storage
      saveToStorage();
    }

    // Update current tab
    sessionData.currentTab = tab;
    sessionData.startTime = now;

    // Check if we should send hourly feedback (every 60 minutes)
    checkAndSendHourlyFeedback();
  });
});

// Check if it's been an hour and send feedback
function checkAndSendHourlyFeedback() {
  chrome.storage.local.get(['lastHourlyFeedback'], (result) => {
    const now = Date.now();
    const lastFeedback = result.lastHourlyFeedback || 0;

    // Send feedback every 60 minutes
    if (now - lastFeedback > 60 * 60 * 1000) {
      const hourlyScore = calculateHourlyScore();
      const feedback = generateFeedback(hourlyScore, 'hourly');

      // Send notification with error handling
      try {
        if (chrome.notifications) {
          chrome.notifications.create('hourly-focus', {
            type: 'basic',
            iconUrl: '/images/icon128.png',
            title: '⏰ Hourly Focus Check-in',
            message: feedback.message,
            contextMessage: feedback.emoji,
            priority: 1
          }, (notificationId) => {
            if (chrome.runtime.lastError) {
              console.error('Notification error:', chrome.runtime.lastError);
            }
          });
        }
      } catch (e) {
        console.error('Failed to create notification:', e);
      }

      // Update last feedback time
      chrome.storage.local.set({
        lastHourlyFeedback: now,
        lastHourlyScore: hourlyScore
      });
    }
  });
}

// Calculate focus score for the last hour
function calculateHourlyScore() {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  const lastHourSessions = sessionData.dailyLog.filter(
    entry => entry.timestamp > oneHourAgo
  );

  if (lastHourSessions.length === 0) {
    return 100; // No data = perfect score
  }

  // Calculate average distraction level
  const totalDistraction = lastHourSessions.reduce((sum, s) => {
    return sum + (s.distractionLevel * s.duration);
  }, 0);

  const totalTime = lastHourSessions.reduce((sum, s) => sum + s.duration, 0);
  const avgDistraction = totalTime > 0 ? totalDistraction / totalTime : 0;

  // Score = 100 - average distraction
  return Math.max(0, 100 - avgDistraction);
}

// Calculate focus score for the day
function calculateDailyScore() {
  if (sessionData.dailyLog.length === 0) {
    return 100;
  }

  const totalDistraction = sessionData.dailyLog.reduce((sum, s) => {
    return sum + (s.distractionLevel * s.duration);
  }, 0);

  const totalTime = sessionData.dailyLog.reduce((sum, s) => sum + s.duration, 0);
  const avgDistraction = totalTime > 0 ? totalDistraction / totalTime : 0;

  return Math.max(0, 100 - avgDistraction);
}

// Generate motivational feedback based on score
function generateFeedback(score, period = 'daily') {
  let emoji, message, details;

  if (score >= 85) {
    emoji = '🚀';
    message = 'Amazing focus! You\'re crushing it!';
    details = 'Your concentration is exceptional. Keep up this momentum!';
  } else if (score >= 70) {
    emoji = '💪';
    message = 'Great work! You\'re staying focused.';
    details = 'You\'re doing well. Just a bit of distraction, but overall solid!';
  } else if (score >= 50) {
    emoji = '😐';
    message = 'You\'re somewhat distracted. Time to refocus?';
    details = 'Try taking a break or closing some tabs to regain focus.';
  } else if (score >= 25) {
    emoji = '⚠️';
    message = 'Lots of distractions detected. Let\'s get back on track!';
    details = 'Close social media, silence notifications, and focus for 25 minutes (Pomodoro).';
  } else {
    emoji = '🆘';
    message = 'Your focus is very scattered. Major intervention needed!';
    details = 'Consider blocking distracting sites and taking a real break first.';
  }

  return { emoji, message, details, score };
}

// Save session data to Chrome storage
function saveToStorage() {
  chrome.storage.local.set({
    dailyLog: sessionData.dailyLog,
    categoryStats: sessionData.categoryStats,
    lastUpdated: Date.now()
  });
}

// Reset daily data at midnight
function checkAndResetDaily() {
  chrome.storage.local.get(['lastReset'], (result) => {
    const now = new Date();
    const lastReset = result.lastReset ? new Date(result.lastReset) : null;

    // Reset if it's a new day
    if (!lastReset || now.toDateString() !== lastReset.toDateString()) {
      // Send end-of-day report
      const dailyScore = calculateDailyScore();
      const feedback = generateFeedback(dailyScore, 'daily');

      // Send notification with error handling
      try {
        if (chrome.notifications) {
          chrome.notifications.create('daily-summary', {
            type: 'basic',
            iconUrl: '/images/icon128.png',
            title: '📊 Daily Focus Summary',
            message: `${feedback.emoji} ${feedback.message}`,
            contextMessage: feedback.details,
            priority: 2
          }, (notificationId) => {
            if (chrome.runtime.lastError) {
              console.error('Notification error:', chrome.runtime.lastError);
            }
          });
        }
      } catch (e) {
        console.error('Failed to create notification:', e);
      }

      // Save yesterday's data
      chrome.storage.local.set({
        yesterdayScore: dailyScore,
        yesterdayLog: sessionData.dailyLog,
        yesterdayStats: sessionData.categoryStats,
        lastReset: now.toISOString()
      });

      // Reset today's session
      sessionData = {
        currentTab: null,
        startTime: null,
        hourlyLogs: [],
        dailyLog: [],
        categoryStats: {
          productive: 0,
          social: 0,
          video: 0,
          neutral: 0,
          unknown: 0,
          ecommerce: 0
        }
      };

      saveToStorage();
    }
  });
}

// Set up alarms for periodic checks (replacing setInterval for service worker compatibility)
chrome.alarms.create('checkDailyReset', { periodInMinutes: 10 });
chrome.alarms.create('checkHourlyFeedback', { periodInMinutes: 5 });

// Listen for alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkDailyReset') {
    checkAndResetDaily();
  } else if (alarm.name === 'checkHourlyFeedback') {
    checkAndSendHourlyFeedback();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCurrentScore') {
    const hourlyScore = calculateHourlyScore();
    const dailyScore = calculateDailyScore();

    sendResponse({
      hourlyScore,
      dailyScore,
      hourlyFeedback: generateFeedback(hourlyScore, 'hourly'),
      dailyFeedback: generateFeedback(dailyScore, 'daily'),
      dailyLog: sessionData.dailyLog,
      categoryStats: sessionData.categoryStats
    });
  }
});

// Initialize on install/update
chrome.runtime.onInstalled.addListener(() => {
  // Set up alarms
  chrome.alarms.create('checkDailyReset', { periodInMinutes: 10 });
  chrome.alarms.create('checkHourlyFeedback', { periodInMinutes: 5 });

  // Initialize storage
  chrome.storage.local.get(['lastReset'], (result) => {
    if (!result.lastReset) {
      chrome.storage.local.set({ lastReset: new Date().toISOString() });
    }
  });
});

// Initialize on startup
chrome.storage.local.get(['lastReset'], (result) => {
  if (!result.lastReset) {
    chrome.storage.local.set({ lastReset: new Date().toISOString() });
  }
});


