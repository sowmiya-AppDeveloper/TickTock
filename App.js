import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {colors} from './Src/Common/Colors';
import Route from './Src/Router/Router';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{height: '100%', backgroundColor: colors.black}}>
        <Route />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
  },
});

export default App;
