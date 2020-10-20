import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { AppRoute } from '../../navigations/app.routes';
import { Feather } from '@expo/vector-icons';
import ServicesList from '../../components/services/services-list';

class _ListScene extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          services: [],
          is_loading: true,
          is_edit_mode: false
        }
    }

    addNewService = () => {
      this.props.navigation.navigate(
        AppRoute.SERVICES_ADD,
        {reloadServicesList: () => this.listReloadCallback()}
      );
    }

    renderEditModeToggle = () => (
      <TopNavigationAction
        icon={() => (<Feather name={this.state.is_edit_mode ? "check" : "edit-2"} color='#CCC' size={24}/>)}
        activeOpacity={0.5}
        onPress={() => {
          this.setState({is_edit_mode: !this.state.is_edit_mode})
        }}
      />
    );

  renderNewService = () => (
    <TopNavigationAction
      icon={() => (<Feather name="plus" color='#CCC' size={24}/>)}
      activeOpacity={0.5}
      onPress={this.addNewService}
    />
  );

  render() {
    return (
        <Layout style={styles.container} level='2'>
            <TopNavigation alignment='center'
                           title='LOGO'
                           leftControl={this.renderEditModeToggle()}
                           rightControls={[this.renderNewService()]} />
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
  }
});

const mapStateToProps = (state) => {
    return {
        // auth_user_id: state.auth.id
    };
}
const ListScene = connect(mapStateToProps)(_ListScene);
export { ListScene };