# Focus Coach - Productivity & Distraction Tracker

A Chrome extension that tracks your browsing habits and provides real-time feedback on your focus and productivity.

## Features

✅ **Real-time Focus Tracking** - Monitor your concentration as you browse
✅ **Hourly Check-ins** - Get motivated every hour with feedback
✅ **Daily Reports** - End-of-day summary with detailed analytics
✅ **Smart Categorization** - Automatically classifies websites as productive, social, video, etc.
✅ **Custom Categories** - Create your own categories with custom distraction scores
✅ **Fully Customizable** - Add/remove sites from any category and edit distraction percentages
✅ **Distraction Detection** - Identifies when you're getting off-track
✅ **Focus Score** - 0-100 score based on your browsing patterns
✅ **Beautiful Dashboard** - Detailed analytics and insights with expandable categories
✅ **Privacy First** - All data stored locally on your device

## 🎯 What Makes Focus Coach Special?

### Complete Customization
Unlike other productivity trackers, Focus Coach gives you **total control**:
- **Edit any category** - Change distraction percentages from 0-100%
- **Manage all sites** - Add or remove websites from default categories
- **Create unlimited custom categories** - Perfect for specific projects, clients, or workflows
- **Real-time updates** - All changes apply immediately to your tracking

### Smart & Flexible
- **Multi-site categories** - Add dozens of sites to one category with comma-separated input
- **Visual site management** - See all sites as colored chips, remove with one click
- **Expandable UI** - Click to expand categories and manage details
- **Persistent storage** - All customizations saved locally and persist across sessions

### Example Workflows
- **Developer**: Create "My Stack" category (5% distraction) with GitHub, Stack Overflow, your company's tools
- **Student**: Adjust "Video" to 20% for educational YouTube content
- **Freelancer**: Create categories for each client with their specific tools

## How It Works

1. **Install** the extension in Chrome
2. **Browse normally** - The extension tracks your activity silently in the background
3. **Get hourly notifications** - Motivational messages every hour
4. **Check your score** - Click the extension icon to see real-time focus stats
5. **Customize categories** - Add your work tools, adjust distraction levels
6. **Review your report** - Open the full dashboard for detailed daily insights

## Quick Start

After installation:

1. **Browse for a bit** to generate some data (visit a few different websites)
2. **Click the extension icon** to see your current focus scores
3. **Click "📊 Full Report"** to open the dashboard
4. **Customize your categories**:
   - Scroll to "Default Categories" and expand any category
   - Click "✎ Edit" to change distraction percentages
   - Add sites specific to your work/workflow
5. **Create custom categories** for your unique needs (e.g., "My Projects", "Client Work")
6. **Check back regularly** to track your productivity trends!

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

### Default Categories (Editable)

- **Productive (0% distraction)**: GitHub, Stack Overflow, ArXiv, Docs, Dev blogs, Learning sites, Code repositories
- **Neutral (20% distraction)**: Gmail, Slack, Google Drive, Notion, Calendar, Email
- **E-Commerce (50% distraction)**: Amazon, eBay, Shopify, Alibaba, Etsy, Shopping sites
- **Video (80% distraction)**: YouTube, Netflix, Twitch, Vimeo, Streaming platforms
- **Social (95% distraction)**: Twitter/X, Facebook, Instagram, Reddit, TikTok, Discord, LinkedIn Feed

**Note:** All default categories are fully customizable through the dashboard! You can:
- Add or remove websites from any category
- Change the distraction percentage (0-100) for each category
- Customize based on your personal workflow

### Custom Categories

Create unlimited custom categories with:
- Custom name (e.g., "My Work", "Gaming", "Research")
- Multiple websites (comma-separated)
- Custom distraction score (0-100)

## Customization

### Through the Dashboard UI (Recommended)

Access the full dashboard by clicking the extension icon → "📊 Full Report"

#### Managing Default Categories

1. **Expand any default category** (Productive, Social, Video, etc.)
2. **View all sites** in that category as colored chips
3. **Add new sites**:
   - Type website in the input field (e.g., `notion.so`)
   - Click "+ Add" button
4. **Remove sites**: Click the × button on any site chip
5. **Edit distraction percentage**:
   - Click "✎ Edit" next to the percentage badge
   - Enter new percentage (0-100)
   - Click "Save"

#### Creating Custom Categories

1. Scroll to "Custom Categories" section
2. Enter **Category Name** (e.g., "My Work")
3. Enter **Websites** separated by commas (e.g., `jira.com, confluence.com, monday.com`)
4. Set **Distraction Score** (0 = very productive, 100 = very distracting)
5. Click "+ Add Category"

#### Managing Custom Categories

1. **Expand your custom category** by clicking on it
2. **Add sites**: Type in input field → Click "+ Add"
3. **Remove sites**: Click × on any site chip
4. **Edit percentage**: Click "✎ Edit" → Enter new % → Click "Save"
5. **Delete category**: Expand category → Click "🗑️ Delete Category"

### Example Use Cases

**Scenario 1: YouTube for Learning**
- Default: YouTube is in Video category (80% distraction)
- Solution: Create "Learning Videos" category with 10% distraction
- Add `youtube.com` to your custom category

**Scenario 2: Work Tools**
- Create "My Work" category with 5% distraction
- Add: `jira.com, confluence.com, monday.com, asana.com`
- These sites now count as highly productive!

**Scenario 3: Adjust Social Media Impact**
- Expand "Social" category
- Click "✎ Edit" on the 95% percentage
- Change to 70% if you use it for professional networking

## Privacy

✅ All data is stored **locally** on your device
✅ No data is sent to external servers
✅ No tracking or analytics
✅ No personal information is collected
✅ You can delete all data anytime

## Troubleshooting

### Extension not showing notifications
- Check Chrome notification settings
- Make sure notifications are enabled for this extension

### Dashboard not loading
- Try refreshing the page
- Clear browser cache
- Reload the extension at `chrome://extensions/`

### Incorrect categorization
- Open the dashboard (click extension icon → "📊 Full Report")
- Expand the relevant category
- Add or remove sites as needed
- Or create a custom category for specific sites

### Custom categories not saving
- Make sure you've entered both a category name and at least one website
- Check that the distraction score is between 0-100
- Reload the extension if issues persist

### Changes not reflecting in scores
- Your focus score updates in real-time as you browse
- Changes to categories take effect immediately for new browsing sessions
- Historical data from before the change remains unchanged

## Dashboard Features

### Quick Popup
Click the extension icon to see:
- **This Hour** - Your focus score for the last 60 minutes
- **Today** - Overall daily focus score
- **Time by Category** - Breakdown of where you spent time (including custom categories!)
- Quick access to full dashboard

### Full Dashboard
Click "📊 Full Report" to access:
- **Daily Focus Summary** - Detailed score with personalized feedback
- **Today's Tips** - AI-generated suggestions based on your behavior
- **Time by Category** - Visual breakdown with progress bars
- **Daily Statistics** - Total time, tab switches, average session, distraction %, focus rating
- **Default Categories Management** - Expandable categories with site management
- **Custom Categories** - Create and manage your own categories

## Future Features

- [x] ~~Custom categories~~ ✅ Implemented
- [x] ~~Editable distraction percentages~~ ✅ Implemented
- [x] ~~Custom category site management~~ ✅ Implemented
- [ ] Block distracting sites during focus time
- [ ] Pomodoro timer integration
- [ ] Weekly/monthly statistics and trends
- [ ] Custom productivity goals and targets
- [ ] Export reports as PDF
- [ ] Focus session history and analytics
- [ ] Browser sync across devices
- [ ] Integration with task management apps

## Visual Guide

### Category Management Interface

```
📋 Default Categories
├── ✓ Productive (0% distraction) ▼
│   ├── Sites: [github.com] [stackoverflow.com] [docs.] [+ Add]
│   └── [✎ Edit %] [Input: 0] [Save]
│
├── 📱 Social (95% distraction) ▼
│   ├── Sites: [twitter.com] [facebook.com] [instagram.com] [+ Add]
│   └── [✎ Edit %] [Input: 95] [Save]
│
└── ...

⚙️ Custom Categories
├── ⚡ My Work (5% distraction) ▼
│   ├── Sites: [jira.com] [confluence.com] [monday.com] [+ Add]
│   ├── [✎ Edit %] [Input: 5] [Save]
│   └── [🗑️ Delete Category]
│
└── [+ Add New Category]
    ├── Category Name: _________
    ├── Websites: _________
    ├── Score (0-100): [_____]
    └── [+ Add Category]
```

### Score Indicators

- 🚀 **85-100**: Amazing Focus (green badge)
- 💪 **70-84**: Great Work (light green badge)
- 😐 **50-69**: Some Distraction (yellow badge)
- ⚠️ **25-49**: Very Distracted (orange badge)
- 🆘 **0-24**: Highly Scattered (red badge)

## Tips for Best Results

1. **Customize first** - Spend 5 minutes setting up your categories before you start tracking
2. **Be honest** - Set distraction percentages based on YOUR workflow, not defaults
3. **Regular reviews** - Check your dashboard daily to spot patterns
4. **Adjust as needed** - Your workflow changes, so should your categories
5. **Use multiple categories** - Don't try to fit everything into default categories
6. **Start strict** - It's easier to lower distraction percentages than raise them

## Support

For issues or suggestions, please report them!

## License

MIT License - Feel free to modify and share

---

**Made with ❤️ to help you stay focused**

*Focus Coach - Because awareness is the first step to better productivity* 🎯
