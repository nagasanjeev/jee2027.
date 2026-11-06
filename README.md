# JEE Main 2027 Voyage – setup
1. Create a GitHub repo, upload all these files (keep folder structure, incl. the hidden `.github` folder).
2. Settings → Pages → Deploy from branch `main` / root. Your site: https://USER.github.io/REPO/
3. Get a YouTube Data API v3 key (Google Cloud Console). Restrict it to "YouTube Data API v3".
   Repo → Settings → Secrets and variables → Actions → New secret `YT_API_KEY`.
4. Actions → "Update YouTube videos" → Run workflow. It then runs every 12 h and commits videos.json.
   Add trusted teachers' channel IDs to `queries.json` (`channelIds`) for better quality.
5. APK: edit `capacitor.config.json` (server.url = your Pages URL), then Actions → "Build Android APK" → Run.
   Download the `jee2027-apk` artifact and install it (allow unknown sources). It is a debug APK.
The APK loads your live Pages site, so content and video updates reach it without rebuilding. It needs internet.
