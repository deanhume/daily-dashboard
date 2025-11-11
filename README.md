# Daily Home Dashboard 🏠

This is a simple web app for home use that displays the current date, weather, bin collection days, and daily kids activities. It is currently customised to the UK but could be extended anywhere. The idea behind this is to hook it up to a Raspberry Pi and touch screen for use in the home.

## ✨ Features

- **📅 Current Date** - Displays today's date in an easy-to-read format (e.g., "Tuesday 11th November")
- **☀️ Weather** - Shows current temperature and weather icon for your location
- **🗑️ Bin Collection Days** - Alternates between rubbish/garden waste and recycling collection weeks
- **🎨 Kids Activities** - Displays 5 daily activities specific to each day of the week

## 🚀 Setup

1. Clone this repository
2. Copy `config.example.js` to `config.js`
3. Add your OpenWeatherMap API key to `config.js`
4. Update the weather location in `config.js` if needed
5. Customize the kids activities in `activities.json` for each day of the week
6. Open `index.html` in a browser or serve via a local web server

**Note:** The `config.js` file is gitignored to keep your API key secure. Never commit this file to the repository.

## ⚙️ Customization

### Kids Activities

Edit `activities.json` to customize activities for each day of the week. Each day can have up to 5 activities:

```json
{
  "monday": [
    "Dance party time",
    "Morning stretch",
    ...
  ],
  "tuesday": [
    "Puzzle time",
    ...
  ]
}
```

### Bin Collection

The bin collection schedule is calculated based on even/odd weeks. Update the logic in `determineBinCollection()` in `main.js` to match your local collection schedule.

## 🔌 APIs

This web app uses the following service:

- [OpenWeatherMap.org API](https://openweathermap.org/)
