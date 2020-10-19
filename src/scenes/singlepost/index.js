import React from 'react';
import i18n from 'i18n-js';
import { connect } from 'react-redux';
import { View, ScrollView, StyleSheet, Button, Keyboard } from 'react-native';
import { default as customTheme } from '../../styles/theme.json';
import { Layout, TopNavigation, TopNavigationAction, Input } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import { AppRoute } from '../../navigations/app.routes';
import { apiGetPost } from '../../services/post.service';
import { apiCreateComment } from '../../services/comment.service';
import Post from '../../components/organisms/post.organism';
import {KeyboardAvoidingView} from '../../components/organisms/keyboard-avoiding-view';
import PostComments from '../../components/organisms/post-comments.organism.js';
import PostLoader from '../../components/organisms/post-loader.organism';

class _SinglePostScene extends React.Component {
  constructor(props) {
    super(props);
    this.postId = this.props.route.params.postId;
    this.state = {
      loading: true,
      post: undefined,
      scrollEnabled: true
    }
    this.newComment = '';
  }

  componentDidMount() {
    this._loadPost();
  }

  _loadPost = () => {
    apiGetPost(this.postId).then((res) => {
      this.setState({
        loading: false,
        post: res.json
      });
    }).catch((err) => console.error(err));
  }

  _openProfile = () => {
    this.props.navigation.navigate(AppRoute.PROFILE, {profileId: this.state.post.profile.id});
  }

  _scrollBlocker = (is_blocked) => {
    this.setState({scrollEnabled: !is_blocked});
  }

  _renderBackAction = () => (
    <TopNavigationAction
      icon={() => (<Feather name="chevron-left" color='#CCC' size={26}/>)}
      onPress={this.props.navigation.goBack}
    />
  )

  _renderLoader = () => {
    if(this.state.loading) {
      return (<PostLoader/>);
    }
  }

  _renderPost = () => {
    if(!this.state.loading && this.state.post != undefined) {
      return (
        <ScrollView scrollEnabled={this.state.scrollEnabled}>
          <Post navigation={this.props.navigation}
                post={this.state.post}
                shouldDisplayCommentsCounter={false}
                scrollBlocker={this._scrollBlocker}></Post>
          <PostComments navigation={this.props.navigation} post={this.state.post}/>
        </ScrollView>
      )
    }
  }

  _onNewCommentInput = (text) => {
    this.newComment = text;
  }

  _submitNewComment = () => {
    if(this.newComment === '') return;
    Keyboard.dismiss();
    this.newCommentInput.clear();

    apiCreateComment(this.state.post.id, this.newComment).then((res) => {
      // OK, reload post
      this.setState({loading: true});
      this._loadPost();
    }).catch((err) => {
      alert(i18n.t('common.an_error_occured_please_try_again_later'));
      return console.error(err);
    });
  }

  _renderNewComment = () => {
    if(!this.state.loading && this.state.post != undefined) {
      return (
        <KeyboardAvoidingView style={styles.newCommentContainer}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 4}}>
              <Input placeholder={i18n.t('post.comment.add_a_comment')}
                    status='basic'
                    size='large'
                    autoCapitalize='sentences'
                    style={{width: '100%'}}
                    multiline={true}
                    maxLength={255}
                    onChangeText={this._onNewCommentInput}
                    ref={input => { this.newCommentInput = input }} />
            </View>
            <View style={{flex: 1, paddingTop: 4}}>
              <Button title={i18n.t('post.comment.post_comment_btn')}
                      color={customTheme['color-basic-300']}
                      onPress={this._submitNewComment}></Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      );
    }
  }

  render() {
    return (
      <Layout style={{flex: 1}} level='2'>
        <TopNavigation
            style={{marginBotton: 1}}
            alignment='center'
            title={i18n.t('post.post')}
            leftControl={this._renderBackAction()}/>
        {this._renderLoader()}
        {this._renderPost()}
        {this._renderNewComment()}
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  newCommentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopColor: customTheme['color-basic-700'],
    borderTopWidth: 0.5,
    flexDirection: 'row',
    backgroundColor: customTheme['color-basic-800'],
    height: 70
  }
});

const SinglePostScene = connect()(_SinglePostScene);
export { SinglePostScene };