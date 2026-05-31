# 📱 Sumi Sensei — iPad Native App Setup

This guide turns the web app into a proper native iPad app that runs on your M1/M2 iPad.
No App Store needed — just Xcode on your Mac.

---

## Prerequisites

| Requirement | Details |
|-------------|----------|
| Mac | macOS 13+ recommended |
| Xcode | Install from Mac App Store (free) |
| Apple ID | Free is fine — gives 7-day installs. $99/yr dev account = 1 year. |
| Node.js | v18+ |

---

## Step 1 — Install dependencies

```bash
git clone https://github.com/madan123051/Learnyourbaby.git
cd Learnyourbaby
npm install
```

---

## Step 2 — Add the iOS platform (first time only)

```bash
npx cap add ios
```

This creates an `ios/` folder with a full Xcode project.

---

## Step 3 — Build and open in Xcode

```bash
npm run cap:ios
```

This does three things automatically:
1. `npm run build` — compiles TypeScript + Vite
2. `npx cap sync ios` — copies dist into the Xcode project
3. `npx cap open ios` — opens Xcode

---

## Step 4 — Configure signing in Xcode

1. In Xcode, click the **Sumi Sensei** project in the left sidebar
2. Select the **App** target
3. Go to **Signing & Capabilities** tab
4. Check **Automatically manage signing**
5. Choose your **Apple ID** team (add your Apple ID under Xcode → Settings → Accounts if needed)

---

## Step 5 — Install on your iPad

**Option A — USB cable (easiest)**
1. Connect iPad to Mac via USB
2. Trust the Mac on your iPad if prompted
3. Select your iPad in the Xcode device picker (top bar)
4. Press ▶ Run
5. On iPad: Settings → General → VPN & Device Management → trust your Apple ID

**Option B — Wireless install**
1. Pair iPad wirelessly: Window → Devices and Simulators → add device
2. Same run steps as above, no cable needed

---

## App icon (optional but nice)

Add your icon files to `public/icons/`:
- `icon-120.png` — 120×120
- `icon-152.png` — 152×152  
- `icon-180.png` — 180×180
- `icon-192.png` — 192×192
- `icon-512.png` — 512×512

Then re-run `npm run cap:ios`.

You can use an online tool like [https://www.appicon.co](https://www.appicon.co) to generate all sizes from one image.

---

## Updating the app

After making code changes:

```bash
npm run cap:sync   # rebuild + sync to Xcode
```

Then run again from Xcode (or Xcode will auto-detect changes).

---

## Re-install frequency

| Account type | Install valid for |
|---|---|
| Free Apple ID | 7 days — run from Xcode again to refresh |
| Apple Developer ($99/yr) | 1 year — also unlocks AltStore/SideStore for OTA |

---

## Capabilities enabled

- ✅ iPad sidebar navigation (≥768px)
- ✅ iPhone bottom tab bar (unchanged)
- ✅ Full-screen, no browser chrome
- ✅ Safe-area insets (notch/Dynamic Island)
- ✅ Haptic feedback (via @capacitor/haptics)
- ✅ Splash screen
- ✅ Status bar styling
- ✅ Landscape + portrait support
- ✅ Offline — no internet needed after install
