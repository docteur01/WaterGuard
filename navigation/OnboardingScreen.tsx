
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import * as Animatable from 'react-native-animatable';

export default function OnboardingScreen({ navigation } : any ) {
  const getAnimation = (animation = 'fadeInUp', duration = 1500) => {
    return { animation, duration };
  };

  // Composants personnalisés pour les boutons
  const NextButton = ({ ...props }) => (
    <TouchableOpacity style={styles.nextButton} {...props}>
      <View style={styles.solidButton}>
        <Text style={styles.nextButtonText}>Suivant</Text>
      </View>
    </TouchableOpacity>
  );

  const SkipButton = ({ ...props }) => (
    <TouchableOpacity style={styles.skipButton} {...props}>
      <Text style={styles.skipButtonText}>Passer</Text>
    </TouchableOpacity>
  );

  const DoneButton = ({ ...props }) => (
    <TouchableOpacity style={styles.doneButton} {...props}>
      <View style={styles.doneButtonBackground}>
        <Text style={styles.nextButtonText}>Commencer 📦</Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <Onboarding
      onDone={() => navigation.navigate('Login')}
      onSkip={() => navigation.navigate('MainTabs')} // a changer apres
      NextButtonComponent={NextButton}
      SkipButtonComponent={SkipButton}
      DoneButtonComponent={DoneButton}
      pages={[
        {
          backgroundColor: '#F0FFF4',
          image: (
            <Animatable.Image style={[styles.image, { transform: [{ rotate: '90deg' }] }]} 
              source={require('../assets/Onboarding_images/Onboarding_package.png')}
              
              {...getAnimation('fadeInDown')}
            />
          ),
          title: (
            <Animatable.View {...getAnimation()}>
              <Text style={styles.title}>
                Bienvenue sur{'\n'}
                <Text style={styles.brandName}>PicknDrop 📦</Text>
              </Text>
            </Animatable.View>
          ),
          subtitle: (
            <Animatable.View {...getAnimation('pulse', 2000)}>
              <Text style={styles.subtitle}>
                Votre solution complète pour l'envoi et la réception de colis en toute simplicité
              </Text>
            </Animatable.View>
          ),
        },
        {
          backgroundColor: '#68434344',
          image: (
            <Animatable.Image
              source={require('../assets/Onboarding_images/Onboarding_tracking.png')}
              style={styles.image}
              {...getAnimation('fadeInDown')}
            />
          ),
          title: (
            <Animatable.Text style={styles.title} {...getAnimation()}>
              Suivi en temps réel ⏱
            </Animatable.Text>
          ),
          subtitle: (
            <Animatable.Text style={styles.subtitle} {...getAnimation('pulse', 2000)}>
              Suivez vos colis en temps réel étape par étape avec précision et recevez des notifications à chaque étape de la livraison.
            </Animatable.Text>
          ),
        },
        {
          backgroundColor: '#ff914dda',
          image: (
            <Animatable.Image
              source={require('../assets/Onboarding_images/Onboarding_delivery.png')}
              style={styles.image}
              {...getAnimation('fadeInDown')}
            />
          ),
          title: (
            <Animatable.Text style={[styles.title, { color: '#fff' }]} {...getAnimation()}>
              Livraison rapide 🚚
            </Animatable.Text>
          ),
          subtitle: (
            <Animatable.Text style={[styles.subtitle, { color: '#fff' }]} {...getAnimation('pulse', 2000)}>
              Expédiez vos colis en toute sécurité et rapidement. Créez votre compte et découvrez une nouvelle façon d'envoyer vos colis
            </Animatable.Text>
          ),
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },

  // Button Styles
  nextButton: {
    marginHorizontal: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  doneButton: {
    marginHorizontal: 20,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#28A745',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  solidButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    borderWidth: 2,
    borderColor: '#FF8E53',
  },
  doneButtonBackground: {
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28A745',
    borderWidth: 2,
    borderColor: '#34CE57',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  skipButton: {
    padding: 10,
    marginHorizontal: 20,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  
  // Text Styles
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2C3E50',
    lineHeight: 36,
  },
  brandName: {
    color: '#FF6B35',
    fontSize: 32,
    fontWeight: '800',
  },
  highlight: {
    color: '#4A90E2',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 10,
    marginHorizontal: 30,
    lineHeight: 24,
    color: '#5A6C7D',
  },
});
