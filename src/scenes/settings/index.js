import React from 'react';
import i18n from 'i18n-js';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import { Drawer, Button, Layout, TopNavigation, Spinner } from '@ui-kitten/components';
import {AppRoute} from '../../navigations/app.routes';
import { ProfileAvatar } from './profile-avatar.atom';
import { ProfileSetting } from './profile-setting.molecule';
import { apiGetUser, apiUpdateUser, apiPostAvatar, apiDeleteAvatar } from '../../services/user.service';
import { Feather } from '@expo/vector-icons';
import DialogInput from 'react-native-dialog-input';
import { default as customTheme } from '../../styles/theme.json';
import NavBack from '../../components/atoms/nav-back.atom';
import {authLogout} from '../../services/auth.service';
import ActionSheet from 'react-native-actionsheet';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

function featherMenuIcon(name) {
  return (<Feather name={name} color={customTheme['color-basic-300']} size='20'/>);
}

const drawerData = [
  // {
  //   title: 'Invite Friends',
  //   route: AppRoute.AUTH_EMAIL,
  //   icon: () => featherMenuIcon('user-plus')
  // },
  // {
  //   title: 'Saved',
  //   route: AppRoute.AUTH_EMAIL,
  //   icon: () => featherMenuIcon('bookmark')
  // },
  // {
  //   title: 'Notifications',
  //   route: AppRoute.AUTH_EMAIL,
  //   icon: () => featherMenuIcon('bell')
  // },
  // {
  //   title: 'Privacy',
  //   route: AppRoute.AUTH_EMAIL,
  //   icon: () => featherMenuIcon('lock')
  // },
  // {
  //   title: 'Blocking',
  //   route: AppRoute.AUTH_EMAIL,
  //   icon: () => featherMenuIcon('slash')
  // },
  // {
  //   title: 'Security and Login',
  //   route: AppRoute.AUTH_EMAIL,
  //   icon: () => featherMenuIcon('shield')
  // },
  // {
  //   title: 'Help',
  //   route: AppRoute.AUTH_EMAIL,
  //   icon: () => featherMenuIcon('help-circle')
  // },
  // {
  //   title: 'About',
  //   route: AppRoute.AUTH_EMAIL,
  //   icon: () => featherMenuIcon('info')
  // },
  {
    title: i18n.t('settings.log_out'),
    route: 'logout',
    icon: () => featherMenuIcon('log-out')
  }
];

class SettingsScene extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        user: undefined,
        processing: true,
        isUpdatingName: false
      }
    }

    componentDidMount() {
      apiGetUser().then((res) => {
        this.setState({
          user: res.json,
          processing: false
        });
      }).catch((error) => console.error(error));
    }

    onRouteSelect = (index) => {
        const route = drawerData[index];

        // If logout, logout through API
        if(route.route === 'logout') {
          authLogout(Constants.installationId);
          this.props.navigation.navigate(AppRoute.AUTH_EMAIL);
        }
        else this.props.navigation.navigate(route.route);
    }

    onDoneButtonPress = () => {
        this.props.navigation.goBack();
    }

    renderPhotoButton = () => (
      <Button
        style={styles.editAvatarButton}
        status='basic'
        onPress={() => this.ProfileActionSheet.show()}
        icon={() => (<Feather name="camera" color='black' size={20}/>)}
      />
    );

    updateName = (name) => {
      this.setState({isUpdatingName: false});

      // Nothing if no change
      if(name === this.state.user.name) return;
      
      apiUpdateUser({name}).then((res) => {
        this.setState({user: res.json}); // OK
      }).catch((error) => {
        alert(i18n.t('common.an_error_occured_please_try_again_later'));
        console.error(error)
      });
    }

    updateAvatar = async () => {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          alert(i18n.t('common.app_need_camera_permission'));
          return;
        }
      }

      console.log("Picking profile picture...");
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        allowsMultipleSelection: false,
        aspect: [1, 1],
        quality: 0
      });
  
      if (result.cancelled) return console.log("Picking cancelled.");

      // ImagePicker saves the taken photo to disk and returns a local URI to it
      let localUri = result.uri;
      let filename = localUri.split('/').pop();

      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      console.log("Uploading profile picture...");
      this.setState({processing: true});
      apiPostAvatar(localUri, filename, type).then((res) => {
        alert(i18n.t('settings.profile_picture_updated_successfully'));
        this.setState({
          user: res.json,
          processing: false
        });
      }).catch((error) => {
        this.setState({processing: false});
        alert(i18n.t('common.an_error_occured_please_try_again_later'));
        console.error(error)
      });
    }

    removeAvatar = () => {
      if(this.state.user.avatar_url === null) return;
      
      Alert.alert(
        i18n.t('settings.remove_profile_picture'),
        i18n.t('common.are_you_sure'),
        [
          {text: i18n.t('settings.yes_remove'), style: 'destructive', onPress: () => {
            this.setState({processing: true});
            apiDeleteAvatar().then((res) => {
              alert(i18n.t('settings.profile_picture_removed_successfully'));
              this.setState({
                user: res.json,
                processing: false
              });
            }).catch((error) => {
              this.setState({processing: false});
              alert(i18n.t('common.an_error_occured_please_try_again_later'));
              console.error(error);
            });
          }},
          {
            text: i18n.t('common.cancel'), style: 'cancel',
          }
        ],
        {cancelable: true},
      );
    }

    toggleAccountPrivacy = () => {
      if(!this.state.user) return;

      let text, btnText;
      if(this.state.user.is_private) {
        text = i18n.t('settings.private_to_public_hint');
        btnText = i18n.t('settings.change_to') + ' ' + i18n.t('common.public');
      } else {
        text = i18n.t('settings.public_to_private_hint');
        btnText = i18n.t('settings.change_to') + ' ' + i18n.t('common.private');
      }

      Alert.alert(
        i18n.t('settings.change_privacy'),
        text,
        [
          {text: btnText, style: 'destructive', onPress: () => {
            this.setState({processing: true});
            apiUpdateUser({is_private: 1-this.state.user.is_private}).then((res) => {
              this.setState({
                user: res.json,
                processing: false
              });
            }).catch((error) => {
              this.setState({processing: false});
              alert(i18n.t('common.an_error_occured_please_try_again_later'));
              console.error(error);
            });
          }},
          {
            text: i18n.t('common.cancel'), style: 'cancel',
          }
        ],
        {cancelable: true},
      );
    }

    renderAvatar = () => {
      if(this.state.processing || !this.state.user) {
        return (
          <View style={{alignItems: 'center', marginTop: 15}}><Spinner size='giant'/></View>
        );
      } else {
        let img;
        if(this.state.user.avatar_url == null) {
            img = require('../../assets/images/profile.png');
        } else {
            img = {uri: this.state.user.avatar_url};
        }

        return (
          <ProfileAvatar
            style={styles.profileAvatar}
            source={img}
            editButton={this.renderPhotoButton}
          />
        );
      }
    }

    render() {
        return (
            <Layout
              style={[styles.container]}
              level='2'>
              <TopNavigation
                style={styles.header}
                alignment='center'
                title={i18n.t('settings.settings')}
                leftControl={<NavBack navigation={this.props.navigation} />}/>
              <ScrollView>

              <ActionSheet
              ref={o => this.ProfileActionSheet = o}
              options={[
                i18n.t('settings.upload_profile_picture'),
                i18n.t('settings.remove_profile_picture'),
                i18n.t('common.cancel')
              ]}
              cancelButtonIndex={2}
              destructiveButtonIndex={1}
              onPress={(i) => {
                  switch(i) {
                      case 0: return this.updateAvatar();
                      case 1: return this.removeAvatar();
                  }
              }}
              />
              {this.renderAvatar()}

              <ProfileSetting
                style={[styles.profileSetting, styles.section]}
                hint={i18n.t('common.name')}
                value={this.state.user ? this.state.user.name : ''}
                onPress={() => {if(this.state.user) this.setState({isUpdatingName: true})}}
              />
              <DialogInput isDialogVisible={this.state.isUpdatingName}
                          title={i18n.t('common.name')}
                          submitText={i18n.t('common.change')}
                          initValueTextInput={this.state.user ? this.state.user.name : ''}
                          submitInput={ (inputText) => this.updateName(inputText) }
                          closeDialog={() => this.setState({isUpdatingName: false})}>
              </DialogInput>

              <ProfileSetting
                style={styles.profileSetting}
                hint={i18n.t('common.username')}
                value={this.state.user ? this.state.user.username : ''}
              />
              <ProfileSetting
                style={styles.profileSetting}
                hint={i18n.t('common.email')}
                value={this.state.user ? this.state.user.email : ''}
              />
              <ProfileSetting
                style={styles.profileSetting}
                hint={i18n.t('settings.account_privacy')}
                value={this.state.user ? (this.state.user.is_private ? i18n.t('common.private') : i18n.t('common.public')) : ''}
                onPress={this.toggleAccountPrivacy}
              />

              <SafeAreaView style={[styles.section, {marginBottom: 30}]}>
                <Drawer
                    data={drawerData}
                    onSelect={this.onRouteSelect}
                />
              </SafeAreaView>
              </ScrollView>
            </Layout>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      marginBottom: 1,
    },
    profileAvatar: {
        marginTop: 8,
      aspectRatio: 1.0,
      height: 140,
      alignSelf: 'center',
    },
    editAvatarButton: {
      aspectRatio: 1.0,
      height: 48,
      borderRadius: 24,
    },
    profileSetting: {
      padding: 16,
    },
    section: {
      marginTop: 24,
    }
});

export {SettingsScene};