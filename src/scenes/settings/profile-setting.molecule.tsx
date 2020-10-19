import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { Divider, Layout, Text } from '@ui-kitten/components';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface ProfileSettingProps extends ViewProps {
  hint: string;
  value: string;
  onPress: () => void;
}

export const ProfileSetting = (props: ProfileSettingProps): React.ReactElement => {

  const { style, hint, value, onPress, ...layoutProps } = props;

  return (
    <React.Fragment>
      <TouchableOpacity activeOpacity={0.7}
                        onPress={onPress}>
        <Layout
          {...layoutProps}
          style={[styles.container, style]}>
          <Text
            appearance='hint'
            category='s1'>
            {hint}
          </Text>
          <Text category='s1'>
            {value}
          </Text>
        </Layout>
      </TouchableOpacity>
      <Divider/>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});