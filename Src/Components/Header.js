import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../Common/Colors';

const Header = props => {
  const navigation = useNavigation();
  const onPressBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <View style={styles.leftIcon}>
          <View style={styles.arrowContainer}>
            <MaterialIcons
              name="arrow-back-ios"
              color={colors.black}
              size={20}
              style={{marginStart: 5}}
              onPress={onPressBack}
            />
          </View>
          <Text
            style={{
              fontSize: 20,
              color: colors.black,
              fontWeight: '600',
            }}>
            {props.title}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  leftIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowContainer: {
    borderColor: 'gray',
    borderRadius: 5,

    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.white,
  },
});
