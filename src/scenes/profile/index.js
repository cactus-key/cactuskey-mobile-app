import React from 'react';
import i18n from 'i18n-js';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, Layout, Text, TopNavigation } from '@ui-kitten/components';
import { apiGetProfile, apiProfileFollow, apiProfileUnfollow, apiGetPosts, apiGetPostsBefore, apiFollowRequestAccept, apiFollowRequestDecline } from '../../services/profile.service';
import ProfileAvatar from '../../components/atoms/profile-avatar.atom';
import PostList from '../../components/organisms/post-list.organism';
import NavBack from '../../components/atoms/nav-back.atom';
import ProfileLoader from '../../components/organisms/profile-loader.organism';
import { AuthPanel } from '../../components/organisms/auth-panel.organism';

class _ProfileScene extends React.Component {
  constructor(props) {
    super(props);
    this.profileId = this.props.route.params.profileId;
    this.is_current_user = this.props.current_user_id == this.profileId;
    this.state = {
      profile: undefined,
      loading: true
    }
  }

  componentDidMount() {
    apiGetProfile(this.profileId).then((res) => {
      this.setState({
        profile: res.json,
        loading: false
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  fetchPosts = () => {
    return new Promise((resolve) => {
      apiGetPosts(this.profileId).then((res) => {
        resolve(res.json);
      }).catch(error => {
        console.error(error);
      });
    });
  }

  fetchPostsBefore = (last_post) => {
    return new Promise((resolve) => {
      if(last_post == null) return resolve([]);
      apiGetPostsBefore(this.profileId, last_post.id).then((res) => {
        resolve(res.json);
      }).catch(error => {
        console.error(error);
      });
    });
  }

  _renderFollowRequest = () => {
    if(this.state.profile.is_pending_follow_request) {
      return (
        <View style={{marginBottom: 25, alignItems: 'center'}}>
          <Text style={{marginBottom: 10}}>{this.state.profile.name} {i18n.t('profile.wants_to_follow_you')}</Text>
          <View style={{flexDirection: 'row',flexWrap: 'wrap'}}>
            <Button size='small' style={{marginRight: 10}} onPress={() => this._followRequest(true)}>
              {i18n.t('common.accept')}
            </Button>
            <Button size='small' status='basic' onPress={() => this._followRequest(false)}>
              {i18n.t('common.decline')}
            </Button>
          </View>
        </View> 
      );
    }
  }

  _followRequest = (accept) => {
    const method = (accept ? apiFollowRequestAccept : apiFollowRequestDecline);
    const is_pending_follow_request_bkp = this.state.profile.is_pending_follow_request;
    const followed_count_bkp = this.state.profile.followed_count;
    this.setState({
      profile: {...this.state.profile,
        is_pending_follow_request: false,
        followed_count: this.state.profile.followed_count + (accept ? 1 : 0)
      }
    });

    method(this.state.profile.id).then((res) => {
      // OK
    }).catch((err) => {
      this.setState({
        profile: {...this.state.profile,
          is_pending_follow_request: is_follow_accepted_bkp,
          followed_count: followers_count_bkp
        }
      });
    })
  }

  _follow = () => {
    apiProfileFollow(this.state.profile.id).then((res) => {
      this.setState({
        profile: {...this.state.profile,
          is_follow_accepted: (res.json.is_accepted ? 1 : 0),
          followers_count: this.state.profile.followers_count + (res.json.is_accepted ? 1 : 0)
        }
      });
    });
  }

  _unfollow = () => {
    const is_follow_accepted_bkp = this.state.profile.is_follow_accepted;
    const followers_count_bkp = this.state.followers_count;
    this.setState({
      profile: {...this.state.profile,
        is_follow_accepted: null,
        followers_count: this.state.profile.followers_count - (is_follow_accepted_bkp ? 1 : 0)
      }
    });

    // Request
    apiProfileUnfollow(this.state.profile.id).then((res) => {
      // OK
    }).catch((err) => {
      this.setState({profile: {...this.state.profile,
        is_follow_accepted: is_follow_accepted_bkp,
        followers_count: followers_count_bkp
      }});
    });
  }

  _renderFollowBtn = () => {
    if(!this.is_current_user) {
      if(this.state.profile.is_follow_accepted == null) {
        return (<Button style={styles.profileButton} appearance='outline' onPress={this._follow}> {i18n.t('profile.follow_btn')} </Button>);
      } else if(this.state.profile.is_follow_accepted == 0) {
        return (<Button style={styles.profileButton} onPress={this._unfollow}> {i18n.t('profile.pending_request_btn')} </Button>);
      } else if(this.state.profile.is_follow_accepted == 1) {
        return (<Button style={styles.profileButton} onPress={this._unfollow}> {i18n.t('profile.following_btn')} </Button>);
      }
    }
  }

  _renderPosts = () => {
    // If no access to this user...
    if(this.state.profile.is_private && this.state.profile.is_follow_accepted != 1) {
      return (
        <View style={{alignItems: 'center', marginTop: 30}}>
          <Text appearance='hint'>{i18n.t('profile.this_account_is_private')}</Text>
          <Text appearance='hint'>{i18n.t('profile.follow_to_see_posts')}</Text>
        </View>
      );
    } else {
      return (
        <PostList navigation={this.props.navigation}
                  posts={this.fetchPosts}
                  onEndReached={this.fetchPostsBefore} />
      );
    }
  }

  _renderProfile = () => {
    if(this.loading || this.state.profile == undefined) {
      return (<ProfileLoader/>);
    } else {
      return (
      <ScrollView style={styles.contentContainer}>
        <Layout style={styles.header}>
            {this._renderFollowRequest()}
            <View style={styles.profileContainer}>
                <View style={styles.profileDetailsContainer}>
                  <Text category='h6'>
                    {this.state.profile.name}
                  </Text>
                  <Text appearance='hint' category='s1'>
                    @{this.state.profile.username}&nbsp;
                    •&nbsp;{this.state.profile.is_private ? i18n.t('common.private') : i18n.t('common.public')}
                  </Text>
                </View>
                <ProfileAvatar profile={this.state.profile} size='giant'/>
            </View>
            <View style={styles.profileButtonsContainer}>
                {this._renderFollowBtn()}
            </View>
            <Divider style={styles.profileSocialsDivider}/>
            <View style={styles.profileSocialsContainer}>
                <View style={{alignItems: 'center'}}>
                    <Text category='h6'> {this.state.profile.followers_count} </Text>
                    <Text appearance='hint' category='p2'> {i18n.t('profile.followers')} </Text>
                </View>
                <View style={{alignItems: 'center'}}>
                    <Text category='h6'> {this.state.profile.followed_count} </Text>
                    <Text appearance='hint' category='p2'> {i18n.t('profile.following')} </Text>
                </View>
                <View style={{alignItems: 'center'}}>
                    <Text category='h6'> {this.state.profile.posts_count} </Text>
                    <Text appearance='hint' category='p2'> {i18n.t('profile.posts')} </Text>
                </View>
            </View>
        </Layout>
        {this._renderPosts()}
    </ScrollView>);
    }
  }

  render() {
    return (
        <Layout style={{flex: 1}} level='2'>
            <AuthPanel/>
            <TopNavigation
                style={{marginBotton: 1}}
                alignment='center'
                title={this.state.profile === undefined ? i18n.t('common.loading') : this.state.profile.name}
                leftControl={<NavBack navigation={this.props.navigation} />}/>
            <Divider/>
            {this._renderProfile()}
        </Layout>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
    },
    header: {
      padding: 16,
    },
    profileContainer: {
      flexDirection: 'row',
    },
    profileDetailsContainer: {
      flex: 1,
      marginHorizontal: 8,
      paddingTop: 5
    },
    profileAvatar: {
      marginHorizontal: 8,
    },
    profileButtonsContainer: {
      flexDirection: 'row',
      marginVertical: 8,
    },
    profileButton: {
      flex: 1,
      marginVertical: 10,
      marginHorizontal: 4,
    },
    profileSocialsDivider: {
      marginHorizontal: -16,
    },
    profileSocialsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginTop: 24,
      marginBottom: 8,
    },
    postsList: {
      paddingHorizontal: 8,
    },
    postItem: {
      width: 144,
      height: 144,
      borderRadius: 4,
      marginHorizontal: 8,
      overflow: 'hidden',
    },
  });

const mapStateToProps = (state) => {
  return { current_user_id: state.auth.id };
}
const ProfileScene = connect(mapStateToProps)(_ProfileScene);
export { ProfileScene };