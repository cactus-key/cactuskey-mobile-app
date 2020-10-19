import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Modal, Alert, View } from 'react-native';
import { Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import flowService from '../../services/flow.service';
import { fetchExpoDeviceData } from '../../services/device_session.service';
import PostList from '../../components/organisms/post-list.organism';
import * as ImageManipulator from 'expo-image-manipulator';
import { AppRoute } from '../../navigations/app.routes';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import { NewPostModal } from '../newpost'
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { AuthPanel } from '../../components/organisms/auth-panel.organism';
import ServicesList from '../../components/services/services-list';
import {Service} from '../../models/Service';
import { Issuer } from '../../models/Issuer';

class _ListScene extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            new_post_img: null
        }
    }

    componentDidMount = async () => {
        // // Ask push notification permission
        // const device_data = await fetchExpoDeviceData();

        // // Store data in Redux
        // this.props.dispatch({
        //     type: "STORE_DEVICE_DATA",
        //     value: device_data
        // });
    }

    renderNewService = () => (
    <TopNavigationAction
      icon={() => (<Feather name="plus" color='#CCC' size={24}/>)}
      activeOpacity={0.5}
      onPress={() => this.props.auth_user_id ? this.pickNewPost() : this.props.dispatch({type: 'OPEN_AUTH_MODAL'})}
    />
  );

  render() {
    return (
        <Layout style={styles.container} level='2'>
            {/* <AuthPanel/> */}
            <TopNavigation alignment='center'
                           title='LOGO'
                           rightControls={[this.renderNewService()]} />
            <ServicesList navigation={this.props.navigation}
                      services={[new Service("pierre.avinain@gmail.com", new Issuer("Google"), "JBSWY3DPEHPK3PXP")]}
                      style={{flex: 1}} />
        </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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