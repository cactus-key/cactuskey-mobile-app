import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView, View, Linking } from 'react-native';
import { Layout, Text, withStyles } from '@ui-kitten/components';
import i18n from '../../../i18n';
import { Setting } from '../../components/settings/setting';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import ExpoConstants from 'expo-constants';
import {AppConstants} from '../../constants/app.constants';
import { BugsnagService } from '../../services/bugsnag.service';

class _IndexScene extends React.Component {

  constructor(props) {
      super(props);
      this.logger = BugsnagService.sceneBreadcrumbLogger('Settings');

      this.state = {
        services: [],
        is_loading: true,
        is_edit_mode: false,
      }
  }

  toggleDarkMode = () => {
    this.logger('Toggle dark mode');
    this.props.dispatch({
      type: "SET_CURRENT_THEME",
      value: (this.props.current_theme === 'dark' ? 'light' : 'dark')
    });
  }

  openWebsite = () => {
    this.logger('Open website');
    Linking.openURL(AppConstants.WEBSITE_URL);
  }

  render() {
    return (
        <Layout style={styles.container} level='2'>
          <ScrollView style={styles.scrollView} bounces={false}>
            <Layout style={styles.header} level='1'>
              <TouchableOpacity style={styles.headerArrowBack} onPress={() => this.props.navigation.goBack()}>
                <Feather name="chevron-left" color='#CCC' size={24}/>
              </TouchableOpacity>
              <Text category='h3' style={styles.headerTitle}>{i18n.t('settings.title')}</Text>
            </Layout>
            <Layout style={styles.settingsWrapper} level='2'>
                {/* <Text appearance='hint' style={styles.categoryText}>
                  {i18n.t('settings.general.title')}
                </Text>
                <Setting icon="moon" color="#7944E6" hint={i18n.t('settings.general.dark_mode')}>
                  <Toggle
                    status='control'
                    checked={this.props.current_theme == 'dark'}
                    onChange={this.toggleDarkMode}
                  />
                </Setting> */}

                <Text appearance='hint' style={styles.categoryText}>
                  {`CactusKey - Version ${ExpoConstants.nativeAppVersion}`}
                </Text>
                <TouchableOpacity onPress={this.openWebsite}>
                  <Text appearance='hint' style={[styles.categoryText, {paddingTop: 0, textTransform: 'none'}]}>
                    {AppConstants.WEBSITE_URL}
                  </Text>
                </TouchableOpacity>
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
  scrollView: {
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
    marginRight: 15
  },
  headerTitle: {
    fontFamily: 'Roboto_Bold',
  },
  settingsWrapper: {
    flex: 1,
    minHeight: '100%',
    height: '100%'
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
const IndexScene = connect(mapStateToProps)(withStyles(_IndexScene));
export { IndexScene };