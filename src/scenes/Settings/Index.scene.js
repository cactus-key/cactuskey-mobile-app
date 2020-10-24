import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Layout, Text, Toggle } from '@ui-kitten/components';
import i18n from '../../../i18n';
import { Setting } from '../../components/settings/setting';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import ExpoConstants from 'expo-constants';

class _IndexScene extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        services: [],
        is_loading: true,
        is_edit_mode: false,
      }
  }

  toggleDarkMode = () => {
    this.props.dispatch({
      type: "SET_CURRENT_THEME",
      value: (this.props.current_theme === 'dark' ? 'light' : 'dark')
    });
  }

  render() {
    return (
        <Layout style={styles.container} level='1'>
          <ScrollView>
            <View style={styles.header}>
              <TouchableOpacity style={styles.headerArrowBack} onPress={() => this.props.navigation.goBack()}>
                <Feather name="chevron-left" color='#CCC' size={24}/>
              </TouchableOpacity>
              <Text category='h3' style={styles.headerTitle}>{i18n.t('settings.title')}</Text>
            </View>
            <Layout style={styles.settingsWrapper} level='2'>
                <Text appearance='hint' style={styles.categoryText}>
                  {i18n.t('settings.general.title')}
                </Text>
                <Setting icon="moon" color="#7944E6" hint={i18n.t('settings.general.dark_mode')}>
                  <Toggle
                    status='control'
                    checked={this.props.current_theme == 'dark'}
                    onChange={this.toggleDarkMode}
                  />
                </Setting>

                <Text appearance='hint' style={styles.categoryText}>
                  {i18n.t('settings.about.text', {version: `${ExpoConstants.nativeAppVersion}`})}
                </Text>
            </Layout>
          </ScrollView>
        </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  headerArrowBack: {
    paddingTop: 8,
    marginRight: 12
  },
  headerTitle: {
    fontFamily: 'Roboto_Bold',
  },
  settingsWrapper: {
    flex: 1,
    minHeight: '100%'
  },
  categoryText: {
    textTransform: 'uppercase',
    fontFamily: 'Roboto_Medium',
    paddingTop: 30,
    paddingBottom: 5,
    paddingHorizontal: 20
  },
  defaultText: {
    paddingHorizontal: 20
  }
});

const mapStateToProps = (state) => {
    return {
      current_theme: state.settings.current_theme
    };
}
const IndexScene = connect(mapStateToProps)(_IndexScene);
export { IndexScene };