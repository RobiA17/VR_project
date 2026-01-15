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

// Register materials for the cars and track
ViroMaterials.createMaterials({
  redCar: {
    diffuseColor: "#FF3B30",
    lightingModel: "Blinn",
  },
  blueCar: {
    diffuseColor: "#007AFF",
    lightingModel: "Blinn",
  },
  trackSurface: {
    diffuseColor: "#333333",
    lightingModel: "Blinn",
  },
  trackBorder: {
    diffuseColor: "#FFD700",
    lightingModel: "Blinn",
  },
  trackBorderGlow: {
    diffuseColor: "#FFFF00",
    lightingModel: "Constant",
  },
  laneLine: {
    diffuseColor: "#FFFFFF",
    lightingModel: "Constant",
  },
  startLine: {
    diffuseColor: "#00FF00",
    lightingModel: "Constant",
  },
  finishLine: {
    diffuseColor: "#FFFFFF",
    lightingModel: "Constant",
  },
  checkerBlack: {
    diffuseColor: "#000000",
    lightingModel: "Blinn",
  },
  redLane: {
    diffuseColor: "#FF3B30",
    lightingModel: "Constant",
  },
  blueLane: {
    diffuseColor: "#007AFF",
    lightingModel: "Constant",
  },
  wheel: {
    diffuseColor: "#1A1A1A",
    lightingModel: "Blinn",
  },
});

// Car component
const Car = ({ position, material }: { position: [number, number, number]; material: string }) => (
  <ViroNode position={position}>
    <ViroBox scale={[0.12, 0.04, 0.06]} materials={[material]} />
    <ViroBox position={[0.01, 0.03, 0]} scale={[0.06, 0.03, 0.05]} materials={[material]} />
    <ViroBox position={[0.035, -0.02, 0.03]} scale={[0.02, 0.02, 0.01]} materials={["wheel"]} />
    <ViroBox position={[0.035, -0.02, -0.03]} scale={[0.02, 0.02, 0.01]} materials={["wheel"]} />
    <ViroBox position={[-0.035, -0.02, 0.03]} scale={[0.02, 0.02, 0.01]} materials={["wheel"]} />
    <ViroBox position={[-0.035, -0.02, -0.03]} scale={[0.02, 0.02, 0.01]} materials={["wheel"]} />
  </ViroNode>
);

// Racing Track component with highlighted borders
const RaceTrack = ({ isPlaced }: { isPlaced: boolean }) => (
  <>
    {/* Main track surface */}
    <ViroBox position={[0, 0, 0]} scale={[1, 0.02, 0.5]} materials={["trackSurface"]} />

    {/* Glowing border edges - brighter when placed */}
    <ViroBox position={[0, 0.02, 0.24]} scale={[1.02, 0.025, 0.025]} materials={[isPlaced ? "trackBorderGlow" : "trackBorder"]} />
    <ViroBox position={[0, 0.02, -0.24]} scale={[1.02, 0.025, 0.025]} materials={[isPlaced ? "trackBorderGlow" : "trackBorder"]} />
    <ViroBox position={[-0.5, 0.02, 0]} scale={[0.025, 0.025, 0.5]} materials={[isPlaced ? "trackBorderGlow" : "trackBorder"]} />
    <ViroBox position={[0.5, 0.02, 0]} scale={[0.025, 0.025, 0.5]} materials={[isPlaced ? "trackBorderGlow" : "trackBorder"]} />

    {/* Corner highlights */}
    <ViroBox position={[-0.5, 0.03, 0.24]} scale={[0.04, 0.04, 0.04]} materials={["trackBorderGlow"]} />
    <ViroBox position={[0.5, 0.03, 0.24]} scale={[0.04, 0.04, 0.04]} materials={["trackBorderGlow"]} />
    <ViroBox position={[-0.5, 0.03, -0.24]} scale={[0.04, 0.04, 0.04]} materials={["trackBorderGlow"]} />
    <ViroBox position={[0.5, 0.03, -0.24]} scale={[0.04, 0.04, 0.04]} materials={["trackBorderGlow"]} />

    {/* Lane divider (center dashed line) */}
    <ViroBox position={[-0.35, 0.015, 0]} scale={[0.08, 0.008, 0.015]} materials={["laneLine"]} />
    <ViroBox position={[-0.2, 0.015, 0]} scale={[0.08, 0.008, 0.015]} materials={["laneLine"]} />
    <ViroBox position={[-0.05, 0.015, 0]} scale={[0.08, 0.008, 0.015]} materials={["laneLine"]} />
    <ViroBox position={[0.1, 0.015, 0]} scale={[0.08, 0.008, 0.015]} materials={["laneLine"]} />
    <ViroBox position={[0.25, 0.015, 0]} scale={[0.08, 0.008, 0.015]} materials={["laneLine"]} />

    {/* Start line (green) */}
    <ViroBox position={[-0.42, 0.015, 0]} scale={[0.025, 0.01, 0.4]} materials={["startLine"]} />
    <ViroText text="START" scale={[0.06, 0.06, 0.06]} position={[-0.42, 0.1, 0]} style={textStyles.startText} />

    {/* Finish line (checkered pattern) */}
    <ViroBox position={[0.45, 0.015, 0.15]} scale={[0.03, 0.008, 0.05]} materials={["finishLine"]} />
    <ViroBox position={[0.45, 0.015, 0.05]} scale={[0.03, 0.008, 0.05]} materials={["checkerBlack"]} />
    <ViroBox position={[0.45, 0.015, -0.05]} scale={[0.03, 0.008, 0.05]} materials={["finishLine"]} />
    <ViroBox position={[0.45, 0.015, -0.15]} scale={[0.03, 0.008, 0.05]} materials={["checkerBlack"]} />
    <ViroBox position={[0.42, 0.015, 0.15]} scale={[0.03, 0.008, 0.05]} materials={["checkerBlack"]} />
    <ViroBox position={[0.42, 0.015, 0.05]} scale={[0.03, 0.008, 0.05]} materials={["finishLine"]} />
    <ViroBox position={[0.42, 0.015, -0.05]} scale={[0.03, 0.008, 0.05]} materials={["checkerBlack"]} />
    <ViroBox position={[0.42, 0.015, -0.15]} scale={[0.03, 0.008, 0.05]} materials={["finishLine"]} />
    <ViroText text="FINISH" scale={[0.06, 0.06, 0.06]} position={[0.45, 0.1, 0]} style={textStyles.finishText} />

    {/* Lane color indicators */}
    <ViroBox position={[-0.48, 0.015, 0.1]} scale={[0.04, 0.008, 0.15]} materials={["redLane"]} />
    <ViroBox position={[-0.48, 0.015, -0.1]} scale={[0.04, 0.008, 0.15]} materials={["blueLane"]} />

    {/* Lane labels */}
    <ViroText text="RED" scale={[0.05, 0.05, 0.05]} position={[-0.48, 0.08, 0.1]} style={textStyles.redLabel} />
    <ViroText text="BLUE" scale={[0.05, 0.05, 0.05]} position={[-0.48, 0.08, -0.1]} style={textStyles.blueLabel} />
  </>
);

const CarRaceSceneAR = (props: any) => {
  const [statusText, setStatusText] = useState("Point camera at a flat surface (desk/table)");
  const [trackPlaced, setTrackPlaced] = useState(false);
  
  // Car positions - managed locally for animation
  const [redCarX, setRedCarX] = useState(-0.35);
  const [blueCarX, setBlueCarX] = useState(-0.35);
  
  const isRacing = props.sceneNavigator?.viroAppProps?.isRacing || false;
  const onTrackPlaced = props.sceneNavigator?.viroAppProps?.onTrackPlaced;
  const raceStartTime = props.sceneNavigator?.viroAppProps?.raceStartTime || 0;

  // Animation effect - move cars when racing
  useEffect(() => {
    if (isRacing && raceStartTime > 0) {
      // Reset car positions at race start
      setRedCarX(-0.35);
      setBlueCarX(-0.35);
      
      const startTime = Date.now();
      const raceDuration = 3000;
      const redEndX = 0.38;
      const blueEndX = 0.40;
      
      const animationInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / raceDuration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const redProgress = easeProgress * (0.95 + Math.random() * 0.05);
        const blueProgress = easeProgress * (0.98 + Math.random() * 0.02);
        
        setRedCarX(-0.35 + (redEndX - (-0.35)) * Math.min(redProgress, 1));
        setBlueCarX(-0.35 + (blueEndX - (-0.35)) * Math.min(blueProgress, 1));
        
        if (progress >= 1) {
          clearInterval(animationInterval);
        }
      }, 32);
      
      return () => clearInterval(animationInterval);
    }
  }, [isRacing, raceStartTime]);

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

  const handlePlaneSelected = () => {
    setTrackPlaced(true);
    setStatusText("🏁 Track placed! Press START RACE!");
    if (onTrackPlaced) {
      onTrackPlaced();
    }
  };

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {/* Lighting */}
      <ViroAmbientLight color="#FFFFFF" intensity={200} />
      
      {/* Status text floating above */}
      <ViroText
        text={statusText}
        scale={[0.3, 0.3, 0.3]}
        position={[0, 0.2, -1]}
        style={textStyles.statusText}
        outerStroke={{ type: "Outline", width: 2, color: "#000000" }}
      />

      {/* AR Plane Selector - content stays anchored after selection */}
      <ViroARPlaneSelector
        minHeight={0.05}
        minWidth={0.05}
        maxPlanes={10}
        onPlaneSelected={handlePlaneSelected}
      >
        {/* Spotlight on the track */}
        <ViroSpotLight
          position={[0, 1, 0]}
          direction={[0, -1, 0]}
          attenuationStartDistance={2}
          attenuationEndDistance={5}
          innerAngle={30}
          outerAngle={60}
          color="#FFFFFF"
          intensity={500}
          castsShadow={true}
        />
        
        {/* Track and cars - scale up slightly when placed */}
        <ViroNode scale={trackPlaced ? [0.6, 0.6, 0.6] : [0.4, 0.4, 0.4]}>
          <RaceTrack isPlaced={trackPlaced} />
          
          {/* Red Car */}
          <Car position={[redCarX, 0.04, 0.1]} material="redCar" />
          
          {/* Blue Car */}
          <Car position={[blueCarX, 0.04, -0.1]} material="blueCar" />
        </ViroNode>
      </ViroARPlaneSelector>
    </ViroARScene>
  );
};

export default () => {
  const [isRacing, setIsRacing] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [trackPlaced, setTrackPlaced] = useState(false);
  const [showAR, setShowAR] = useState(true);
  const [raceStartTime, setRaceStartTime] = useState(0);

  const handleTrackPlaced = () => {
    setTrackPlaced(true);
  };

  const handleStartRace = () => {
    if (!trackPlaced) return;
    
    if (raceFinished) {
      setIsRacing(false);
      setRaceFinished(false);
      setTimeout(() => {
        setRaceStartTime(Date.now());
        setIsRacing(true);
        setTimeout(() => setRaceFinished(true), 3100);
      }, 100);
    } else {
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
            scene: CarRaceSceneAR as () => JSX.Element,
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
          <Text style={styles.resetOverlayText}>🔄 Resetting AR...</Text>
          <Text style={styles.resetSubtext}>Point at a flat surface</Text>
        </View>
      )}

      {/* UI Overlay */}
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>🏎️ AR CAR RACE 🏎️</Text>
          {!trackPlaced && (
            <Text style={styles.instruction}>
              👆 Point at desk & TAP to place track
            </Text>
          )}
          {trackPlaced && !isRacing && (
            <Text style={styles.instructionGreen}>
              ✅ Track placed! Ready to race!
            </Text>
          )}
          <TouchableOpacity style={styles.resetButton} onPress={handleResetAR}>
            <Text style={styles.resetButtonText}>🔄 Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.raceButton,
              (!trackPlaced || (isRacing && !raceFinished)) && styles.raceButtonDisabled,
            ]}
            onPress={handleStartRace}
            disabled={!trackPlaced || (isRacing && !raceFinished)}
          >
            <Text style={styles.raceButtonText}>
              {!trackPlaced
                ? "📍 Place Track First"
                : !isRacing
                ? "🚦 START RACE!"
                : raceFinished
                ? "🔄 RACE AGAIN"
                : "🏁 RACING..."}
            </Text>
          </TouchableOpacity>
        </View>

        {raceFinished && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>🏆 BLUE WINS! 🏆</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const textStyles = {
  statusText: {
    fontFamily: "Arial",
    fontSize: 12,
    color: "#FFFFFF",
    textAlignVertical: "center" as const,
    textAlign: "center" as const,
  },
  startText: {
    fontFamily: "Arial",
    fontSize: 10,
    color: "#00FF00",
    textAlignVertical: "center" as const,
    textAlign: "center" as const,
  },
  finishText: {
    fontFamily: "Arial",
    fontSize: 10,
    color: "#FFFFFF",
    textAlignVertical: "center" as const,
    textAlign: "center" as const,
  },
  redLabel: {
    fontFamily: "Arial",
    fontSize: 8,
    color: "#FF3B30",
    textAlignVertical: "center" as const,
    textAlign: "center" as const,
  },
  blueLabel: {
    fontFamily: "Arial",
    fontSize: 8,
    color: "#007AFF",
    textAlignVertical: "center" as const,
    textAlign: "center" as const,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arView: {
    flex: 1,
  },
  resetOverlay: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  resetOverlayText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  resetSubtext: {
    fontSize: 14,
    color: "#888888",
    marginTop: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    pointerEvents: "box-none",
  },
  header: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    paddingVertical: 12,
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  instruction: {
    fontSize: 14,
    color: "#FFD700",
    marginTop: 6,
    textAlign: "center",
    fontWeight: "600",
  },
  instructionGreen: {
    fontSize: 14,
    color: "#00FF00",
    marginTop: 6,
    textAlign: "center",
    fontWeight: "600",
  },
  resetButton: {
    marginTop: 10,
    backgroundColor: "#444444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#666666",
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "box-none",
  },
  raceButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 35,
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  raceButtonDisabled: {
    backgroundColor: "#555555",
    borderColor: "#777777",
  },
  raceButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  resultContainer: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  resultText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
});
