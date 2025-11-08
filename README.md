# Focus Coach - Productivity & Distraction Tracker

A Chrome extension that tracks your browsing habits and provides real-time feedback on your focus and productivity.

## Features

✅ **Real-time Focus Tracking** - Monitor your concentration as you browse
✅ **Hourly Check-ins** - Get motivated every hour with feedback
✅ **Daily Reports** - End-of-day summary with detailed analytics
✅ **Smart Categorization** - Automatically classifies websites as productive, social, video, etc.
✅ **Distraction Detection** - Identifies when you're getting off-track
✅ **Focus Score** - 0-100 score based on your browsing patterns
✅ **Beautiful Dashboard** - Detailed analytics and insights
✅ **Privacy First** - All data stored locally on your device

## How It Works

1. **Install** the extension in Chrome
2. **Browse normally** - The extension tracks your activity silently in the background
3. **Get hourly notifications** - Motivational messages every hour
4. **Check your score** - Click the extension icon to see real-time focus stats
5. **Review your report** - Open the full dashboard for detailed daily insights

## Installation

### Method 1: Load Unpacked (Development)

1. Clone/download this folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Select this folder
6. Done! The extension is now installed

### Method 2: Manual Installation

1. Download all files from this repository
2. Follow steps 2-6 above

## File Structure

```
focus-coach-extension/
├── manifest.json          # Extension configuration
├── background.js          # Main tracking logic
├── popup.html             # Quick-access popup UI
├── popup.js               # Popup functionality
├── dashboard.html         # Full report dashboard
├── dashboard.js           # Dashboard functionality
└── README.md              # This file
```

## Score Breakdown

### 85-100: 🚀 Amazing Focus
- You're in the zone! Excellent concentration
- Keep this momentum going
- Consider longer focus sessions

### 70-84: 💪 Great Work
- Strong focus with minor distractions
- You're on track to meet your goals
- Take regular breaks to sustain this level

### 50-69: 😐 Some Distraction
- You're somewhat off-track
- Try closing unnecessary tabs
- Use Pomodoro technique (25 min focused work)

### 25-49: ⚠️ Very Distracted
- Major distractions detected
- Close social media tabs
- Consider a real break to reset

### 0-24: 🆘 Highly Scattered
- Your focus is very fragmented
- Turn off notifications
- Take a real break, then refocus

## Category Classifications

- **Productive**: GitHub, Stack Overflow, ArXiv, Docs, Dev blogs, Learning sites
- **Social**: Twitter, Facebook, Instagram, Reddit, TikTok, Discord, LinkedIn
- **Video**: YouTube, Netflix, Twitch, Vimeo
- **E-Commerce**: Amazon, eBay, Shopify, Alibaba, Etsy
- **Neutral**: Gmail, Slack, Google Drive, Notion (productivity tools)

## Privacy

✅ All data is stored **locally** on your device
✅ No data is sent to external servers
✅ No tracking or analytics
✅ No personal information is collected
✅ You can delete all data anytime

## Customization

You can edit the category rules in `background.js` to customize which sites count as productive:

```javascript
const categoryRules = {
  productive: [
    'yoursite.com',
    'another-productive-site.com',
    // Add more...
  ],
  // etc...
};
```

## Troubleshooting

### Extension not showing notifications
- Check Chrome notification settings
- Make sure notifications are enabled for this extension

### Dashboard not loading
- Try refreshing the page
- Clear browser cache
- Reload the extension

### Incorrect categorization
- Edit the category rules in `background.js`
- Reload the extension after making changes

## Future Features

- [ ] Block distracting sites during focus time
- [ ] Pomodoro timer integration
- [ ] Weekly statistics
- [ ] Custom productivity goals
- [ ] Export reports as PDF
- [ ] Leaderboard with friends
- [ ] AI-powered recommendations
- [ ] Integration with task apps

## Support

For issues or suggestions, please report them!

## License

MIT License - Feel free to modify and share

---

**Made with ❤️ to help you stay focused**
