# AR Autóverseny Alkalmazás - Dokumentáció

## Bevezetés

Ez a projekt egy **kiterjesztett valóság (AR) autóverseny alkalmazás**, amely React Native és a ViroReact könyvtár segítségével készült. Az alkalmazás a telefon kameráját és AR képességeit használva lehetővé teszi virtuális versenypálya elhelyezését valós felületeken, majd két versenyautó animált futamát jeleníti meg.

### Főbb Funkciók

- **AR felületfelismerés**: ARCore/ARKit alapú sík felület detektálás
- **Interaktív pálya elhelyezés**: Érintéssel történő virtuális objektum pozicionálás
- **Valós idejű animáció**: 30 FPS-es, ease-out interpolációval vezérelt autómozgás
- **Reszponzív UI overlay**: A 3D jelenet felett lebegő natív React Native vezérlőelemek

### Technológiai Stack

| Technológia | Verzió | Funkció |
|-------------|--------|---------|
| React Native | 0.73.3 | Cross-platform mobil keretrendszer |
| @reactvision/react-viro | 2.41.4 | AR/VR renderelő motor |
| TypeScript | 5.0.4 | Statikus típusellenőrzés |
| ARCore/ARKit | - | Platform-specifikus AR szolgáltatások |

---

## Előfeltételek és Telepítés

### Rendszerkövetelmények

- **Node.js** 18+ verzió
- **Android Studio** (Android SDK, Platform-Tools)
- **Xcode** (csak macOS, iOS fejlesztéshez)
- **Fizikai készülék** ARCore/ARKit támogatással

> **Fontos**: Az AR funkciók kizárólag fizikai készüléken működnek – az emulátorok nem támogatják a szükséges szenzoradatokat.

### Telepítési Folyamat

```bash
# 1. Függőségek telepítése
npm install

# 2. iOS pod-ok telepítése (macOS)
cd ios && pod install && cd ..

# 3. Metro bundler indítása
npm start

# 4. Alkalmazás futtatása
npm run android   # vagy: npm run ios
```

Az `android/app/build.gradle` fájlban a `minSdkVersion` értéknek legalább **24**-nek kell lennie az ARCore kompatibilitás miatt.

---

## Architektúra és Technikai Felépítés

### Komponens Hierarchia

Az alkalmazás három fő rétegből áll:

1. **Fő alkalmazás komponens** (`App.tsx` export default): Állapotkezelés és UI overlay
2. **AR jelenet** (`CarRaceSceneAR`): ViroReact alapú 3D jelenet és AR logika
3. **3D objektumok** (`Car`, `RaceTrack`): Újrafelhasználható vizuális komponensek

### ViroReact Integráció

A `ViroARSceneNavigator` komponens szolgál a React Native és a ViroReact AR motor közötti hídként. A `viroAppProps` objektumon keresztül történik az adatátadás a natív UI és a 3D jelenet között:

```typescript
<ViroARSceneNavigator
  initialScene={{ scene: CarRaceSceneAR }}
  viroAppProps={{ isRacing, onTrackPlaced, raceStartTime }}
/>
```

### Anyagrendszer (Materials)

A `ViroMaterials.createMaterials()` függvény globálisan regisztrálja a 3D objektumok megjelenését meghatározó anyagokat. Minden anyag tartalmaz:
- **diffuseColor**: Alap szín (hex formátum)
- **lightingModel**: Árnyékolási modell ("Blinn" fizikai alapú, "Constant" világítás-független)

Az alkalmazás 12 különböző anyagot definiál: autók (piros, kék), pálya felület, szegélyek, sávjelölők, start/célvonal és kerekek.

### 3D Objektum Felépítés

A `Car` és `RaceTrack` komponensek primitív `ViroBox` elemekből épülnek fel. Minden elem három paramétert kap:
- **position**: [X, Y, Z] koordináták méterben
- **scale**: [szélesség, magasság, mélység] méretezés
- **materials**: Hivatkozás a regisztrált anyagokra

Az autó 6 dobozból áll (karosszéria, kabin, 4 kerék), míg a pálya ~25 elemből (felület, szegélyek, vonalak, feliratok).

### AR Felületfelismerés

A `ViroARPlaneSelector` komponens automatikusan detektálja a kamera képén látható sík felületeket. Konfiguráció:
- `minHeight/minWidth`: Minimum felületméret (0.05m)
- `maxPlanes`: Maximum egyidejűleg követett síkok száma (10)
- `onPlaneSelected`: Callback a felület kiválasztásakor

### Animációs Rendszer

A verseny animáció React `useEffect` hook-kal és `setInterval` időzítővel valósul meg:

1. **Inicializálás**: Autók visszaállítása start pozícióra (-0.35m)
2. **Interpoláció**: Ease-out függvény (`1 - (1 - t)³`) a természetes lassuláshoz
3. **Variáció**: Véletlenszerű szorzó (±2-5%) a realisztikusabb mozgáshoz
4. **Frissítési ráta**: 32ms intervallum (~30 FPS)

### AR Követési Állapotok

Az `onTrackingUpdated` callback három állapotot kezel:
- `TRACKING_NORMAL`: Stabil követés, interakció engedélyezett
- `TRACKING_LIMITED`: Gyenge követés, felhasználói figyelmeztetés
- `TRACKING_UNAVAILABLE`: AR nem elérhető (hiányzó szenzor vagy engedély)

---

## Az Alkalmazás Használata

### Indítás és Pálya Elhelyezés

1. Indítsa el az alkalmazást fizikai készüléken
2. Irányítsa a kamerát sík, jól megvilágított felületre (asztal, padló)
3. Várja meg a felületfelismerést (a pálya előnézete megjelenik)
4. Érintse meg a képernyőt a pálya rögzítéséhez

### Verseny Futtatása

- **START RACE**: Elindítja a 3 másodperces versenyt
- **RACE AGAIN**: Új futam az eredmény megjelenése után
- **Reset**: Teljes AR jelenet újrainicializálása


## Testreszabási Lehetőségek

### Vizuális Módosítások

- **Autó színek**: `ViroMaterials` `diffuseColor` értékek módosítása
- **Pálya méret**: `RaceTrack` komponens `scale` paraméterei
- **Új anyagok**: `createMaterials()` bővítése további színekkel

### Játékmenet Paraméterek

- **Verseny időtartam**: `raceDuration` változó (alapértelmezett: 3000ms)
- **Animáció sebesség**: `setInterval` intervallum változtatása

### Bővítési Lehetőségek

- Harmadik autó hozzáadása új állapotváltozóval és `Car` komponenssel
- Hangeffektek integrálása `ViroSound` komponenssel
- Felhasználói input a verseny kimenetelének befolyásolására

---

*Készítette: Ambarus Róbert-Béla - Mesterképzés, 2. évfolyam, VR Projekt*
