import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';

export const Setting = (props) => {

  const { hint, icon, color, children, ...touchableOpacityProps } = props;

  return (
    <React.Fragment>
      <TouchableOpacity
        activeOpacity={0.6}
        {...touchableOpacityProps}
        style={styles.container}>
          <View style={styles.hintWrapper}>
            <View style={[styles.iconWrapper, {backgroundColor: color}]}>
              <Feather color="white" name={icon} size={22} style={styles.icon}/>
            </View>
            <Text category='h6' style={styles.text}>
              {hint}
            </Text>
          </View>
          {children}
      </TouchableOpacity>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    maxHeight: 60
  },
  hintWrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  iconWrapper: {
    width: 40,
    height: 40,
    marginRight: 14,
    backgroundColor: 'gray',
    borderRadius: 10
  },
  icon: {
    marginLeft: 9,
    marginTop: 7
  },
  text: {
    fontFamily: 'Roboto_Regular',
    marginTop: 7,
    fontSize: 17
  }
});