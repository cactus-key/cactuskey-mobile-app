import React from 'react';
import i18n from 'i18n-js';
import moment from 'moment';
import 'moment/locale/fr';
import { connect } from 'react-redux';
import { default as customTheme } from '../../styles/theme.json';
import { View, StyleSheet, Alert } from 'react-native';
import { Text } from '@ui-kitten/components';
import { AppRoute } from '../../navigations/app.routes';
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import ProfileAvatar from '../atoms/profile-avatar.atom.js';
import ActionSheet from 'react-native-actionsheet';
import { apiDeleteComment } from '../../services/comment.service';

class _PostComment extends React.Component {
    constructor(props) {
        super(props);
        this.post = this.props.post;
        this.state = {
            comment: this.props.comment,
            spinnerOverlay: false
        }

        moment.locale(i18n.locale);
    }

    _openProfile = () => {
        this.props.navigation.navigate(AppRoute.PROFILE, {profileId: this.state.comment.profile.id});
    }

    _openMore = () => {
        if(this.state.comment.profile.id == this.props.current_user_id) {
            this.OwnerActionSheet.show();
        } else {
            this.OtherActionSheet.show();
        }
    }

    _delete = () => {
        Alert.alert(
            i18n.t('post.comment.delete_comment'),
            i18n.t('post.comment.are_you_sure_you_want_to_delete_comment'),
            [
              {text: i18n.t('common.delete'), style: 'destructive', onPress: () => {
                  apiDeleteComment(this.post.id, this.state.comment.id).then((res) => {
                    this.props.onDelete();
                    console.log(i18n.t('post.comment.comment_deleted_successfully'));
                  }).catch((err) => console.error(err));
              }},
              {
                text: i18n.t('common.cancel'), style: 'cancel',
              }
            ],
            {cancelable: true},
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <SpinnerOverlay visible={this.state.spinnerOverlay}/> */}

                <TouchableWithoutFeedback onPress={this._openProfile}>
                    <ProfileAvatar profile={this.state.comment.profile} size='medium'/>
                </TouchableWithoutFeedback>

                <ActionSheet
                            ref={o => this.OwnerActionSheet = o}
                            options={[i18n.t('common.delete'), i18n.t('common.cancel')]}
                            cancelButtonIndex={1}
                            destructiveButtonIndex={0}
                            onPress={(i) => {
                                switch(i) {
                                    case 0: this._delete()
                                }
                            }} />

                <ActionSheet
                            ref={o => this.OtherActionSheet = o}
                            options={[i18n.t('common.cancel')]}
                            cancelButtonIndex={0}
                            // destructiveButtonIndex={0}
                            onPress={(i) => {
                                switch(i) {
                                }
                            }} />
                <TouchableOpacity activeOpacity={0.7} onLongPress={this._openMore} delayLongPress={350}>
                    <View style={styles.textContainer}>
                        <TouchableWithoutFeedback onPress={this._openProfile}>
                            <Text category='label'>{this.state.comment.profile.name}</Text>
                        </TouchableWithoutFeedback>
                        <Text>{this.state.comment.text}</Text>
                    </View>
                    
                    <Text appearance='hint' style={styles.timestamp}>
                        {`${moment(this.state.comment.created_at).fromNow()}`}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: 20
    },
    textContainer: {
        backgroundColor: customTheme['color-basic-700'],
        marginLeft: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        maxWidth: '90%'
    },
    timestamp: {
        marginLeft: 25,
        marginTop: 2
    }
});

const mapStateToProps = (state) => {
    return { current_user_id: state.auth.id };
}
const PostComment = connect(mapStateToProps)(_PostComment);
export default PostComment;