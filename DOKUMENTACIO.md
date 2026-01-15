# 🏎️ AR Autóverseny Alkalmazás - Dokumentáció

## Tartalomjegyzék

1. [Bevezetés](#bevezetés)
2. [Előfeltételek és Telepítés](#előfeltételek-és-telepítés)
3. [Projekt Struktúra](#projekt-struktúra)
4. [Kód Felépítése és Magyarázat](#kód-felépítése-és-magyarázat)
5. [Az Alkalmazás Használata](#az-alkalmazás-használata)
6. [Testreszabás és Továbbfejlesztés](#testreszabás-és-továbbfejlesztés)

---

## Bevezetés

Ez a projekt egy **kiterjesztett valóság (AR) autóverseny alkalmazás**, amely React Native és a ViroReact könyvtár segítségével készült. Az alkalmazás lehetővé teszi a felhasználók számára, hogy a telefon kameráját használva egy virtuális versenypályát helyezzenek el egy sík felületen (asztal, padló), majd két autó versenyét nézzék végig valós időben.

### Főbb Funkciók

- **AR felületfelismerés**: A kamera automatikusan felismeri a sík felületeket
- **Interaktív pálya elhelyezés**: Egyszerű érintéssel helyezhetjük el a pályát
- **Animált autóverseny**: Két autó (piros és kék) versenye valósághű animációval
- **Modern UI**: Átlátható felhasználói felület gombok és állapotjelzők

### Használt Technológiák

| Technológia | Verzió | Leírás |
|-------------|--------|--------|
| React Native | 0.73.3 | Mobil alkalmazás keretrendszer |
| @reactvision/react-viro | 2.41.4 | AR/VR könyvtár React Native-hez |
| TypeScript | 5.0.4 | Típusos JavaScript |

---

## Előfeltételek és Telepítés

### Rendszerkövetelmények

Mielőtt elkezdenénk, győződjünk meg róla, hogy az alábbi szoftverek telepítve vannak:

1. **Node.js** (18-as verzió vagy újabb)
2. **npm** vagy **yarn** csomagkezelő
3. **Android Studio** (Android fejlesztéshez)
   - Android SDK
   - Android SDK Platform-Tools
   - Android Virtual Device (AVD)
4. **Xcode** (iOS fejlesztéshez, csak macOS-en)
5. **Fizikai készülék** AR képességekkel (emulátor nem támogatott AR-hez!)

### React Native Környezet Beállítása

Kövessük a hivatalos React Native dokumentációt a környezet beállításához:
[React Native Environment Setup](https://reactnative.dev/docs/environment-setup)

### Projekt Telepítése

#### 1. lépés: Projekt klónozása vagy létrehozása

Új projekt létrehozása ViroReact-tal:

```bash
npx react-native init ARCarRace --template react-native-template-typescript
cd ARCarRace
```

#### 2. lépés: ViroReact telepítése

```bash
npm install @reactvision/react-viro
```

#### 3. lépés: Függőségek telepítése

```bash
npm install
```

#### 4. lépés: iOS függőségek (csak macOS)

```bash
cd ios
pod install
cd ..
```

#### 5. lépés: Android konfiguráció

Az `android/app/build.gradle` fájlban győződjünk meg róla, hogy a `minSdkVersion` legalább **24**:

```gradle
android {
    defaultConfig {
        minSdkVersion 24
        targetSdkVersion 34
    }
}
```

### Alkalmazás Indítása

#### Metro bundler elindítása

Nyissunk egy terminált és futtassuk:

```bash
npm start
```

#### Alkalmazás futtatása fizikai készüléken

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

> ⚠️ **Fontos**: Az AR funkciók csak fizikai készüléken működnek! Az emulátor/szimulátor nem támogatja az AR-t.

---

## Projekt Struktúra

```
VR_project/
├── App.tsx                 # Fő alkalmazás komponens
├── package.json            # Projekt függőségek és scriptek
├── tsconfig.json           # TypeScript konfiguráció
├── babel.config.js         # Babel konfiguráció
├── metro.config.js         # Metro bundler konfiguráció
├── android/                # Android natív kód
│   ├── app/
│   │   └── build.gradle    # Android build konfiguráció
│   └── settings.gradle
├── ios/                    # iOS natív kód
│   ├── Podfile             # CocoaPods függőségek
│   └── ViroStarterKit/
└── __tests__/              # Teszt fájlok
```

---

## Kód Felépítése és Magyarázat

Az alkalmazás teljes forráskódja az `App.tsx` fájlban található. Nézzük meg a főbb komponenseket részletesen.

### 1. Importok és Függőségek

```typescript
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroBox,
  ViroMaterials,
  ViroNode,
  ViroTrackingReason,
  ViroTrackingStateConstants,
  ViroText,
  ViroARPlaneSelector,
  ViroAmbientLight,
  ViroSpotLight,
} from "@reactvision/react-viro";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
```

**Magyarázat:**
- **ViroARScene**: Az AR jelenet fő konténere
- **ViroARSceneNavigator**: AR jelenetek közötti navigáció
- **ViroBox**: 3D doboz objektum létrehozása
- **ViroMaterials**: Anyagok (színek, textúrák) definiálása
- **ViroNode**: 3D objektumok csoportosítása
- **ViroARPlaneSelector**: Sík felületek felismerése és kiválasztása
- **ViroAmbientLight/ViroSpotLight**: Világítás komponensek

### 2. Anyagok (Materials) Definiálása

Az anyagok határozzák meg a 3D objektumok megjelenését:

```typescript
ViroMaterials.createMaterials({
  redCar: {
    diffuseColor: "#FF3B30",    // Piros szín
    lightingModel: "Blinn",      // Fénymodell
  },
  blueCar: {
    diffuseColor: "#007AFF",    // Kék szín
    lightingModel: "Blinn",
  },
  trackSurface: {
    diffuseColor: "#333333",    // Sötétszürke pálya
    lightingModel: "Blinn",
  },
  trackBorder: {
    diffuseColor: "#FFD700",    // Arany szegély
    lightingModel: "Blinn",
  },
  wheel: {
    diffuseColor: "#1A1A1A",    // Fekete kerék
    lightingModel: "Blinn",
  },
});
```

**Anyagtípusok:**
- `redCar`, `blueCar`: Autók színei
- `trackSurface`: Pálya felület
- `trackBorder`, `trackBorderGlow`: Pálya szegélyek
- `laneLine`: Sávjelölő vonalak
- `startLine`, `finishLine`: Start és célvonal
- `wheel`: Autó kerekek

### 3. Autó Komponens (Car)

Az autó egy újrafelhasználható komponens, amely 3D dobozokból épül fel:

```typescript
const Car = ({ 
  position, 
  material 
}: { 
  position: [number, number, number]; 
  material: string 
}) => (
  <ViroNode position={position}>
    {/* Autó teste */}
    <ViroBox 
      scale={[0.12, 0.04, 0.06]} 
      materials={[material]} 
    />
    {/* Autó kabinja */}
    <ViroBox 
      position={[0.01, 0.03, 0]} 
      scale={[0.06, 0.03, 0.05]} 
      materials={[material]} 
    />
    {/* Kerekek - 4 db */}
    <ViroBox 
      position={[0.035, -0.02, 0.03]} 
      scale={[0.02, 0.02, 0.01]} 
      materials={["wheel"]} 
    />
    <ViroBox 
      position={[0.035, -0.02, -0.03]} 
      scale={[0.02, 0.02, 0.01]} 
      materials={["wheel"]} 
    />
    <ViroBox 
      position={[-0.035, -0.02, 0.03]} 
      scale={[0.02, 0.02, 0.01]} 
      materials={["wheel"]} 
    />
    <ViroBox 
      position={[-0.035, -0.02, -0.03]} 
      scale={[0.02, 0.02, 0.01]} 
      materials={["wheel"]} 
    />
  </ViroNode>
);
```

**Komponens felépítése:**
- `ViroNode`: Csoportosító elem, amely tartalmazza az autó összes részét
- `position`: Az autó pozíciója [X, Y, Z] koordinátákban
- `scale`: Az objektum méretezése [szélesség, magasság, mélység]
- Az autó 6 `ViroBox`-ból áll: test, kabin és 4 kerék

### 4. Versenypálya Komponens (RaceTrack)

A versenypálya szintén 3D dobozokból épül fel:

```typescript
const RaceTrack = ({ isPlaced }: { isPlaced: boolean }) => (
  <>
    {/* Fő pálya felület */}
    <ViroBox 
      position={[0, 0, 0]} 
      scale={[1, 0.02, 0.5]} 
      materials={["trackSurface"]} 
    />

    {/* Világító szegélyek */}
    <ViroBox 
      position={[0, 0.02, 0.24]} 
      scale={[1.02, 0.025, 0.025]} 
      materials={[isPlaced ? "trackBorderGlow" : "trackBorder"]} 
    />
    
    {/* Sávjelző vonalak (közép) */}
    <ViroBox 
      position={[-0.35, 0.015, 0]} 
      scale={[0.08, 0.008, 0.015]} 
      materials={["laneLine"]} 
    />
    
    {/* Start vonal (zöld) */}
    <ViroBox 
      position={[-0.42, 0.015, 0]} 
      scale={[0.025, 0.01, 0.4]} 
      materials={["startLine"]} 
    />
    <ViroText 
      text="START" 
      scale={[0.06, 0.06, 0.06]} 
      position={[-0.42, 0.1, 0]} 
    />
    
    {/* Célvonal (kockás minta) */}
    <ViroBox 
      position={[0.45, 0.015, 0.15]} 
      scale={[0.03, 0.008, 0.05]} 
      materials={["finishLine"]} 
    />
  </>
);
```

**Pálya elemei:**
- Fő pálya felület (szürke)
- 4 szegély vonal (arany/sárga)
- 4 sarok kiemelés (világító)
- Középvonal (szaggatott fehér)
- Start vonal (zöld) + "START" felirat
- Célvonal (kockás mintázat) + "FINISH" felirat
- Sáv jelölők (piros és kék)

### 5. AR Jelenet Komponens (CarRaceSceneAR)

Ez a fő AR jelenet, amely kezeli a követést és az animációt:

```typescript
const CarRaceSceneAR = (props: any) => {
  const [statusText, setStatusText] = useState(
    "Point camera at a flat surface (desk/table)"
  );
  const [trackPlaced, setTrackPlaced] = useState(false);
  
  // Autók pozíciói
  const [redCarX, setRedCarX] = useState(-0.35);
  const [blueCarX, setBlueCarX] = useState(-0.35);
  
  // Props a navigátorból
  const isRacing = props.sceneNavigator?.viroAppProps?.isRacing || false;
  const raceStartTime = props.sceneNavigator?.viroAppProps?.raceStartTime || 0;
```

**Állapotkezelés:**
- `statusText`: Felhasználói útmutató szöveg
- `trackPlaced`: Pálya le van-e helyezve
- `redCarX`, `blueCarX`: Autók X pozíciója (animációhoz)

### 6. Verseny Animáció

Az animáció a `useEffect` hook segítségével valósul meg:

```typescript
useEffect(() => {
  if (isRacing && raceStartTime > 0) {
    // Autók visszaállítása start pozícióra
    setRedCarX(-0.35);
    setBlueCarX(-0.35);
    
    const startTime = Date.now();
    const raceDuration = 3000;  // 3 másodperc
    const redEndX = 0.38;       // Piros autó végpozíció
    const blueEndX = 0.40;      // Kék autó végpozíció (győztes)
    
    const animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / raceDuration, 1);
      
      // Ease-out animáció (lassulás a végén)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      // Véletlenszerű variáció a realisztikusabb mozgásért
      const redProgress = easeProgress * (0.95 + Math.random() * 0.05);
      const blueProgress = easeProgress * (0.98 + Math.random() * 0.02);
      
      // Pozíciók frissítése
      setRedCarX(-0.35 + (redEndX - (-0.35)) * Math.min(redProgress, 1));
      setBlueCarX(-0.35 + (blueEndX - (-0.35)) * Math.min(blueProgress, 1));
      
      if (progress >= 1) {
        clearInterval(animationInterval);
      }
    }, 32);  // ~30 FPS
    
    return () => clearInterval(animationInterval);
  }
}, [isRacing, raceStartTime]);
```

**Animáció jellemzői:**
- 3 másodperces verseny időtartam
- Ease-out easing függvény (lassulás a végén)
- Véletlenszerű variáció a realisztikusabb hatásért
- A kék autó mindig nyer (nagyobb végpozíció)
- ~30 FPS frissítési ráta

### 7. AR Követés Kezelése

```typescript
function onInitialized(state: any, reason: ViroTrackingReason) {
  if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
    if (!trackPlaced) {
      setStatusText("Tap on your desk to place the race track!");
    }
  } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
    setStatusText("AR tracking unavailable");
  } else if (state === ViroTrackingStateConstants.TRACKING_LIMITED) {
    setStatusText("Move slowly to improve tracking...");
  }
}
```

**Követési állapotok:**
- `TRACKING_NORMAL`: Normál követés, pálya elhelyezhető
- `TRACKING_UNAVAILABLE`: AR nem elérhető
- `TRACKING_LIMITED`: Korlátozott követés (mozogjon lassan)

### 8. Fő Alkalmazás Komponens

```typescript
export default () => {
  const [isRacing, setIsRacing] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [trackPlaced, setTrackPlaced] = useState(false);
  const [showAR, setShowAR] = useState(true);
  const [raceStartTime, setRaceStartTime] = useState(0);

  const handleStartRace = () => {
    if (!trackPlaced) return;
    
    if (raceFinished) {
      // Újraindítás
      setIsRacing(false);
      setRaceFinished(false);
      setTimeout(() => {
        setRaceStartTime(Date.now());
        setIsRacing(true);
        setTimeout(() => setRaceFinished(true), 3100);
      }, 100);
    } else {
      // Első indítás
      setRaceStartTime(Date.now());
      setIsRacing(true);
      setTimeout(() => setRaceFinished(true), 3100);
    }
  };

  const handleResetAR = () => {
    setIsRacing(false);
    setRaceFinished(false);
    setTrackPlaced(false);
    setRaceStartTime(0);
    setShowAR(false);
    setTimeout(() => setShowAR(true), 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      {showAR ? (
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{
            scene: CarRaceSceneAR,
          }}
          viroAppProps={{ 
            isRacing, 
            onTrackPlaced: handleTrackPlaced,
            raceStartTime,
          }}
          style={styles.arView}
        />
      ) : (
        <View style={styles.resetOverlay}>
          <Text>🔄 Resetting AR...</Text>
        </View>
      )}
      {/* UI Overlay komponensek */}
    </SafeAreaView>
  );
};
```

**Fő funkciók:**
- `handleStartRace()`: Verseny indítása
- `handleResetAR()`: AR jelenet újraindítása
- `handleTrackPlaced()`: Pálya elhelyezésének kezelése

---

## Az Alkalmazás Használata

### 1. Alkalmazás Indítása

1. Csatlakoztassa fizikai készülékét a számítógéphez
2. Engedélyezze az USB hibakeresést (Android) vagy bízzon meg a számítógépben (iOS)
3. Futtassa a megfelelő parancsot:

```bash
# Android
npm run android

# iOS
npm run ios
```

### 2. Pálya Elhelyezése

1. **Nyissa meg az alkalmazást** a telefonján
2. **Irányítsa a kamerát** egy sík felületre (asztal, padló)
3. **Várjon**, amíg az alkalmazás felismeri a felületet
4. **Érintse meg** a kiválasztott felületet a pálya elhelyezéséhez

> 💡 **Tipp**: A legjobb eredményért jól megvilágított, mintás felületet használjon!

### 3. Verseny Indítása

1. A pálya elhelyezése után megjelenik a **"START RACE!"** gomb
2. Nyomja meg a gombot a verseny indításához
3. Figyelje az autók versenyét!
4. A verseny végén megjelenik a győztes

### 4. Újrakezdés

- **Új verseny**: Nyomja meg a "RACE AGAIN" gombot
- **Teljes újraindítás**: Nyomja meg a "Reset" gombot a fejlécben

## Testreszabás és Továbbfejlesztés

### Autó Színének Módosítása

A `ViroMaterials.createMaterials()` függvényben módosítsa a színeket:

```typescript
ViroMaterials.createMaterials({
  redCar: {
    diffuseColor: "#00FF00",  // Módosítsa zöldre
    lightingModel: "Blinn",
  },
  // ...
});
```

### Verseny Időtartamának Módosítása

Az animáció sebességét a `raceDuration` változó módosításával állíthatja:

```typescript
const raceDuration = 5000;  // 5 másodperc (alapértelmezett: 3000)
```

### Győztes Megváltoztatása

A `redEndX` és `blueEndX` értékek módosításával változtathatja meg a győztest:

```typescript
const redEndX = 0.42;   // Piros autó messzebbre jut
const blueEndX = 0.38;  // Kék autó rövidebb utat tesz meg
// Így a piros autó nyer!
```

### Új Anyag Hozzáadása

```typescript
ViroMaterials.createMaterials({
  // Meglévő anyagok...
  greenCar: {
    diffuseColor: "#00FF00",
    lightingModel: "Blinn",
  },
});
```

### Harmadik Autó Hozzáadása

1. Definiáljon új anyagot
2. Adjon hozzá új állapotváltozót
3. Adja hozzá a Car komponenst a jelenethez:

```typescript
const [greenCarX, setGreenCarX] = useState(-0.35);

// A JSX-ben:
<Car position={[greenCarX, 0.04, 0]} material="greenCar" />
```

---

## Hibakeresés és Gyakori Problémák

### "AR tracking unavailable" üzenet

- Győződjön meg róla, hogy fizikai készüléket használ
- Ellenőrizze, hogy a kamera engedélyezve van-e
- Próbáljon jobb megvilágítású helyre menni

### Pálya nem jelenik meg

- Mozgassa lassan a kamerát
- Keresse a sík felületet (asztal, padló)
- Próbálja meg a "Reset" gombot

### Alkalmazás összeomlik

- Ellenőrizze, hogy minden függőség telepítve van
- Futtassa: `npm install`
- Android: `cd android && ./gradlew clean`

---

## Összefoglalás

Ez a dokumentáció bemutatta az AR Autóverseny alkalmazás felépítését, telepítését és használatát. A projekt kiváló alapot nyújt kiterjesztett valóság alkalmazások fejlesztéséhez React Native és ViroReact segítségével.

### Főbb tanulságok:

1. **ViroReact** egyszerűvé teszi az AR fejlesztést React Native-ben
2. **3D objektumok** összetett formák `ViroBox` komponensekből építhetők
3. **Animációk** a React `useState` és `useEffect` hookjaival valósíthatók meg
4. **AR felületfelismerés** automatikusan működik a `ViroARPlaneSelector` komponenssel

### További Források

- [ViroReact Dokumentáció](https://viro-community.readme.io/)
- [React Native Dokumentáció](https://reactnative.dev/docs/getting-started)
- [ViroReact Discord](https://discord.gg/YfxDBGTxvG)

---

*Készítette: [Ambarus Róbert-Béla] - Mesterképzés, 2. évfolyam, VR Projekt*
