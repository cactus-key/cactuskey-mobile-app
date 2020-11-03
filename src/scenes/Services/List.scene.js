import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Image, View, Dimensions, Platform } from 'react-native';
import { Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { AppRoute } from '../../navigations/app.routes';
import { Feather } from '@expo/vector-icons';
import ServicesList from '../../components/services/services-list';
import { BugsnagService } from '../../services/bugsnag.service';
import i18n from '../../../i18n';

class _ListScene extends React.Component {

    constructor(props) {
        super(props);
        this.logger = BugsnagService.sceneBreadcrumbLogger('Services/List');

        this.state = {
          services: [],
          is_loading: true,
          is_edit_mode: false
        }

        this.menu = {current: {}};
        this.hideMenu = () => this.menu.current.hide();
        this.showMenu = () => this.menu.current.show();
    }

    renderTopNavigation = () => {
      if (Platform.OS === 'android') {
        return (
          <View>
            <TopNavigation
              alignment="start"
              rightControls={[
                this.renderEditModeToggle(),
                <Menu ref={this.menu} button={<Feather onPress={this.showMenu} name="more-vertical" color='#CCC' size={26}/>}>
                  <MenuItem onPress={this.addNewService}>
                    {i18n.t('services.no_services_button')}
                  </MenuItem>
                  <MenuItem onPress={this.openSettings}>
                    {i18n.t('settings.title')}
                  </MenuItem>
                </Menu>
              ]} />
          </View>
        );
      } else {
        return (
          <TopNavigation
            alignment="center"
            leftControl={this.renderEditModeToggle()}
            rightControls={[this.renderNewService(), this.renderMenuBtn()]} />
        );
      }
    }

  renderEditModeToggle = () => (
    <TopNavigationAction
      icon={() => (<Feather name={this.state.is_edit_mode ? "check" : "edit-2"} color='#CCC' size={24}/>)}
      activeOpacity={0.5}
      style={styles.topNavAction}
      onPress={this.toggleEditMode}
    />
  );

  toggleEditMode = () => {
    this.logger(`Toggle edit mode pressed (now=${!this.state.is_edit_mode})`);
    this.setState({is_edit_mode: !this.state.is_edit_mode})
  }

  renderNewService = () => (
    <TopNavigationAction
      icon={() => (<Feather name="plus" color='#CCC' size={29}/>)}
      activeOpacity={0.5}
      style={styles.topNavAction}
      onPress={this.addNewService}
    />
  );

  addNewService = () => {
    this.logger('Add new service click');
    if (Platform.OS === 'android') this.hideMenu();
    this.props.navigation.navigate(
      AppRoute.SERVICES_ADD,
      {reloadServicesList: () => this.listReloadCallback()}
    );
  }

  renderMenuBtn = () => (
    <TopNavigationAction
      icon={() => (<Feather name="menu" color='#CCC' size={29}/>)}
      activeOpacity={0.5}
      style={styles.topNavAction}
      onPress={this.openSettings}
    />
  );

  openSettings = () => {
    this.logger('Open settings menu');
    if (Platform.OS === 'android') this.hideMenu();
    this.props.navigation.navigate(AppRoute.SETTINGS_INDEX);
  }

  renderAndroidMenu = () => (
    <TopNavigationAction
      icon={() => (<Feather name="more-vertical" color='#CCC' size={26}/>)}
      activeOpacity={0.5}
      onPress={() => {
        this.logger('Open settings menu');
        this.props.navigation.navigate(AppRoute.SETTINGS_INDEX);
      }}
    />
  );

  render() {
    return (
        <Layout style={styles.container}>
            <View style={styles.logoWrapper}>
              <Image style={styles.logo} source={require('../../assets/logo.png')}/>
            </View>
            {this.renderTopNavigation()}
            <ServicesList navigation={this.props.navigation}
                      setReloadCallback={(callback) => this.listReloadCallback = callback}
                      style={styles.servicesList}
                      is_edit_mode={this.state.is_edit_mode}
                      onNewClick={this.addNewService} />
        </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60
  },
  servicesList: {
    flex: 1
  },
  topNavAction: {
    width: 30,
    height: 30
  },
  logoWrapper: {
    position: 'absolute',
    width: 70,
    left: Platform.OS === 'android' ? 15 : (Dimensions.get('window').width - 70)/2,
    flex: 1,
    alignItems: Platform.OS === 'android' ? 'flex-start' : 'center',
    zIndex: 1000
  },
  logo: {
    marginTop: 10,
    width: 70,
    height: 35
  }
});

const mapStateToProps = (state) => {
    return {
        // auth_user_id: state.auth.id
    };
}
const ListScene = connect(mapStateToProps)(_ListScene);
export { ListScene };