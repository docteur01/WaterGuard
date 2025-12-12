import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  Animated,
  Dimensions,
  Easing,
  View,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

const { width, height } = Dimensions.get("window");

// ── Goutte d'eau qui tombe (forme améliorée) ─────────────────
const FallingDrop = ({ delay = 0, left }: { delay?: number; left: number }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(-100);
      opacity.setValue(1);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height + 100,
          duration: 6000 + Math.random() * 4000,
          delay,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 3000,
          delay: 5000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    
    // Démarrer immédiatement
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.drop,
        {
          left,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {/* Tête ronde de la goutte */}
      <View style={styles.dropHead} />
      {/* Queue allongée de la goutte */}
      <View style={styles.dropTail} />
    </Animated.View>
  );
};

// ── Bouton circulaire de progression SANS SVG ─────────────────────
const CircularProgressButton = ({ progress }: { progress: number }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: progress / 100,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View style={styles.progressContainer}>
          {/* Cercle de fond gris foncé */}
          <View style={styles.progressTrack} />

          {/* Cercle de progression animé (bleu cyan) */}
          <Animated.View
            style={[
              styles.progressFill,
              {
                transform: [{ rotate: rotation }],
              },
            ]}
          />

          {/* Centre avec pourcentage ou ✓ */}
          <View style={styles.progressInner}>
            <Text style={styles.progressText}>
              {progress < 100 ? `${Math.round(progress)}%` : "✓"}
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function StartScreen({ navigation }: any) {
  const { user, loading } = useAuth();
  const [progress, setProgress] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Progression automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1.8;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (!loading) {
              navigation.replace(user ? "MainTabs" : "Onboarding");
            }
          }, 800);
          return 100;
        }
        return next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [progress, navigation, user, loading]);

  // Animations d'entrée
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulsation douce du titre
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.03, duration: 1800, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.97, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // 12 gouttes bien réparties avec délais échelonnés
  const drops = [...Array(12)].map((_, i) => ({
    left: (width / 12) * i + Math.random() * 40 - 20,
    delay: i * 200 + Math.random() * 300, // Délais plus courts pour démarrer rapidement
  }));

  return (
    <View style={styles.container}>
      {/* Fond bleu nuit océan */}
      <View style={styles.background} />

      {/* Pluie de gouttes */}
      {drops.map((drop, i) => (
        <FallingDrop key={i} left={drop.left} delay={drop.delay} />
      ))}

      {/* Titre animé */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.title}>
          <Text style={styles.titlePick}>waterguard</Text>
        </Text>
        <Text style={styles.subtitle}>Votre assistant intelligent</Text>
      </Animated.View>

      {/* Bouton progression en bas */}
      <View style={styles.footer}>
        <CircularProgressButton progress={progress} />
        <Text style={styles.loadingText}>
          {progress < 100 ? "Préparation en cours..." : "Prêt à démarrer !"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a192f",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0a192f",
  },
  drop: {
    position: "absolute",
    width: 6,
    height: 24,
    alignItems: "center",
  },
  dropHead: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0, 212, 255, 0.85)",
    shadowColor: "#00d4ff",
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 8,
  },
  dropTail: {
    width: 2,
    height: 18,
    backgroundColor: "rgba(0, 212, 255, 0.6)",
    shadowColor: "#00d4ff",
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 6,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 3,
  },
  titlePick: {
    color: "#00d4ff",
    textShadowColor: "#00d4ff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    marginTop: 20,
    fontSize: 18,
    color: "#88d8ff",
    fontStyle: "italic",
    textAlign: "center",
    opacity: 0.9,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 90,
  },

  // ─── Cercle de progression natif ───
  progressContainer: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  progressTrack: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: "rgba(255,255,255,0.15)",
    position: "absolute",
  },
  progressFill: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: "#00d4ff",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#00d4ff",
    position: "absolute",
  },
  progressInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(10, 25, 47, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(0, 212, 255, 0.3)",
  },
  progressText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  loadingText: {
    marginTop: 24,
    fontSize: 16,
    color: "#a0e7ff",
    fontWeight: "500",
  },
});