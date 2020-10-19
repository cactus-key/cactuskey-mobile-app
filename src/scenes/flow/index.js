import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Modal, Alert } from 'react-native';
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

class _FlowScene extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            new_post_img: null
        }
    }

    componentDidMount = async () => {
        // Ask push notification permission
        const device_data = await fetchExpoDeviceData();

        // Store data in Redux
        this.props.dispatch({
            type: "STORE_DEVICE_DATA",
            value: device_data
        });
    }

  renderNewPost = () => (
    <TopNavigationAction
      icon={() => (<Feather name="plus-circle" color='#CCC' size={24}/>)}
      activeOpacity={0.5}
      onPress={() => this.props.auth_user_id ? this.pickNewPost() : this.props.dispatch({type: 'OPEN_AUTH_MODAL'})}
    />
  );

  renderSettings = () => (
    <TopNavigationAction
      icon={() => (<Feather name="user" color='#CCC' size={26}/>)}
      activeOpacity={0.5}
      onPress={() => this.props.auth_user_id ? this.props.navigation.navigate(AppRoute.SETTINGS) : this.props.dispatch({type: 'OPEN_AUTH_MODAL'})}
    />
  );

  fetchPosts = () => {
    return new Promise((resolve) => {
    flowService.list().then((res) => {
        resolve(res.json);
      }).catch(error => {
        console.error(error);
      });
    });
  }

  // Called when user refresh by scrolling up
  // to pull latest posts. First post of the current
  // list is provided. It should return a promise
  // resolving with new posts
  fetchPostsAfter = (first_post) => {
    const method = (first_post == null ? flowService.list() : flowService.listAfter(first_post.id));
    return new Promise((resolve) => {
      method.then((res) => {
        resolve(res.json);
      }).catch(error => {
        console.error(error);
      });
    });
  }

  fetchPostsBefore = (last_post) => {
    return new Promise((resolve) => {
      if(last_post == null) return resolve([]);
      flowService.listBefore(last_post.id).then((res) => {
        resolve(res.json);
      }).catch(error => {
        console.error(error);
      });
    });
  }

  pickNewPost = async () => {
    // Ask permission to access camera roll
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        return alert('Sorry, app need camera roll permissions to pick post picture.');
      }
    }

    // Pick image in camera roll
    let imgData = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0
    });

    // Exit if picking cancelled
    if (imgData.cancelled) return console.log("Picking cancelled.");

    const MAX_SIZE_IN_BYTES = 500000;

    let fileInfo = await FileSystem.getInfoAsync(imgData.uri, {size: true});

    // Check file size
    if(fileInfo.size > MAX_SIZE_IN_BYTES) return Alert.alert("New Post", "Picked image is too large");

    // // Compress
    // resizeResult = await ImageManipulator.manipulateAsync(
    //   resizeResult.uri,
    //   [{resize: {width: img_width}}]
    //   // [{compress: 0}]
    // );
    // fileInfo = await FileSystem.getInfoAsync(resizeResult.uri, {size: true});

    // ImagePicker saves the taken photo to disk and returns a local URI to it
    let localUri = imgData.uri;
    let filename = localUri.split('/').pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Open modal
    this.setState({new_post_img: {uri: localUri, name: filename, type}});
  }

  render() {
    return (
        <Layout style={styles.container} level='2'>
            <AuthPanel/>
            <TopNavigation alignment='center'
                           title='LOGO'
                           rightControls={[this.renderNewPost()]}
                           leftControl={this.renderSettings()} />

            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.new_post_img !== null}>
                <NewPostModal closeModal={() => {this.setState({new_post_img: null})}}
                              img={this.state.new_post_img}></NewPostModal>
            </Modal>
            <PostList navigation={this.props.navigation}
                      posts={this.fetchPosts}
                      onRefresh={this.fetchPostsAfter}
                      onEndReached={this.fetchPostsBefore} />
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
        auth_user_id: state.auth.id
    };
}
const FlowScene = connect(mapStateToProps)(_FlowScene);
export { FlowScene };