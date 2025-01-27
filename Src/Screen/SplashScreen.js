import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Animated, {BounceInDown, FadeInUp} from 'react-native-reanimated';
import {colors} from '../Common/Colors';

const SplashScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('home');
    }, 1000);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        entering={FadeInUp.duration(800).delay(200)}
        style={styles.statsContainer}>
        <Animated.Image
          source={require('../Assets/Images/timer.png')}
          style={styles.launchImg}
          entering={BounceInDown.duration(1000)}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 15,
    textAlign: 'center',
  },
  launchImg: {
    height: 150,
    width: 150,
    borderRadius: 10,
  },
  statsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
