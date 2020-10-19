import React from 'react';
import i18n from "../../../i18n";
import { RefreshControl, View } from 'react-native';
import SkeletonContent from "react-native-skeleton-content";
import { default as customTheme } from '../../styles/theme.json';
import { Layout, TopNavigation, List } from '@ui-kitten/components';
import { apiGetNotifications, apiGetNotificationsAfter } from '../../services/notification.service'
import Notification from '../../components/molecules/notification.organism';

class NotificationsScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifs: [],
      loading: true,
      refreshing: false
    }
  }

  componentDidMount() {
    apiGetNotifications().then((res) => {
      // OK
      this.setState({
        notifs: res.json,
        loading: false
      });
    })
    .catch((err) => console.error(err));
  }

  _renderNotifs = () => {
    if(!this.state.loading) {
      return (
        <List style={styles.list}
              data={this.state.notifs}
              refreshControl={(<RefreshControl tintColor={'white'} refreshing={this.state.refreshing} onRefresh={this._onRefresh} />)}
              renderItem={(info) => (<Notification navigation={this.props.navigation} notification={info.item}/>)} />
      )
    }
  }

  // called when user refresh list to load latest notifs
  _onRefresh = () => {
    // Enable spinner
    this.setState({refreshing: true});

    // Determine first notif of the list
    let first_notif = null;
    if(this.state.notifs.length > 0) first_notif = this.state.notifs[0];

    // Provide first notif to method
    const _this = this;
    apiGetNotificationsAfter(first_notif.id).then((res) => {
      // Append notifs at the beginning of the list
      _this.setState({
          notifs: res.json.concat(_this.state.notifs),
          refreshing: false
      });
    }).catch((error) => {
      _this.setState({refreshing: false});
    });
  }

  _renderLoader = () => {
    if(this.state.loading) {
      return (
        <View style={{flex: 1}}>
          <View style={{marginTop: 15, flexDirection: 'row'}}>
              <SkeletonContent
                  containerStyle={{flex: 1}}
                  boneColor={customTheme['color-basic-700']}
                  highlightColor={customTheme['color-basic-800']}
                  layout={[
                      { width: 40, height: 40, marginBottom: 6, borderRadius: 60, marginHorizontal: 10 }
                  ]}></SkeletonContent>
              <SkeletonContent
                  containerStyle={{flex: 5, paddingTop: 10, paddingLeft: 15}}
                  boneColor={customTheme['color-basic-700']}
                  highlightColor={customTheme['color-basic-800']}
                  layout={[
                      { width: 110, height: 16, marginBottom: 10 }
                  ]}></SkeletonContent>
          </View>
          <View style={{marginTop: 5, flexDirection: 'row'}}>
              <SkeletonContent
                  containerStyle={{flex: 1}}
                  boneColor={customTheme['color-basic-700']}
                  highlightColor={customTheme['color-basic-800']}
                  layout={[
                      { width: 40, height: 40, marginBottom: 6, borderRadius: 60, marginHorizontal: 10 }
                  ]}></SkeletonContent>
              <SkeletonContent
                  containerStyle={{flex: 5, paddingTop: 10, paddingLeft: 15}}
                  boneColor={customTheme['color-basic-700']}
                  highlightColor={customTheme['color-basic-800']}
                  layout={[
                      { width: 150, height: 16, marginBottom: 10 }
                  ]}></SkeletonContent>
          </View>
          <View style={{marginTop: 5, flexDirection: 'row'}}>
              <SkeletonContent
                  containerStyle={{flex: 1}}
                  boneColor={customTheme['color-basic-700']}
                  highlightColor={customTheme['color-basic-800']}
                  layout={[
                      { width: 40, height: 40, marginBottom: 6, borderRadius: 60, marginHorizontal: 10 }
                  ]}></SkeletonContent>
              <SkeletonContent
                  containerStyle={{flex: 5, paddingTop: 10, paddingLeft: 15}}
                  boneColor={customTheme['color-basic-700']}
                  highlightColor={customTheme['color-basic-800']}
                  layout={[
                      { width: 190, height: 16, marginBottom: 10 }
                  ]}></SkeletonContent>
          </View>
          <View style={{marginTop: 5, flexDirection: 'row'}}>
              <SkeletonContent
                  containerStyle={{flex: 1}}
                  boneColor={customTheme['color-basic-700']}
                  highlightColor={customTheme['color-basic-800']}
                  layout={[
                      { width: 40, height: 40, marginBottom: 6, borderRadius: 60, marginHorizontal: 10 }
                  ]}></SkeletonContent>
              <SkeletonContent
                  containerStyle={{flex: 5, paddingTop: 10, paddingLeft: 15}}
                  boneColor={customTheme['color-basic-700']}
                  highlightColor={customTheme['color-basic-800']}
                  layout={[
                      { width: 170, height: 16, marginBottom: 10 }
                  ]}></SkeletonContent>
          </View>
      </View>
      );
    }
  }

  render() {
    return (
        <Layout style={{flex: 1}} level='2'>
            <TopNavigation
                style={{marginBotton: 1}}
                alignment='center'
                title={i18n.t('notifs.notifications')}/>
            {this._renderLoader()}
            {this._renderNotifs()}
        </Layout>
    );
  }
}

const styles = {
  list: {
    flex: 1,
  },
};

export { NotificationsScene };