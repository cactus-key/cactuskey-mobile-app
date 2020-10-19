import React from 'react';
import i18n from '../../../i18n';
import moment from 'moment';
import 'moment/locale/fr';
import { connect } from 'react-redux';
import { default as customTheme } from '../../styles/theme.json';
import { apiProfileUnfollow } from '../../services/profile.service';
import { apiDeletePost, apiReportPost } from '../../services/post.service';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ProfileAvatar from '../atoms/profile-avatar.atom';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button } from '@ui-kitten/components';
import DialogInput from 'react-native-dialog-input';
import { AppRoute } from '../../navigations/app.routes';
import ActionSheet from 'react-native-actionsheet';
import { Feather } from '@expo/vector-icons';

const MoreIcon = () => (
    <Feather color={customTheme['color-basic-300']} name="more-horizontal" size={22}/>
);

class _PostHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_reporting: false
        }

        moment.locale(i18n.locale);
    }

    _openMore = () => {
        if(this.props.current_user_id == this.props.post.profile.id) {
            this.OwnerActionSheet.show();
        } else {
            this.GuestActionSheet.show();
        }
    }
    
    _openProfile = () => {
        this.props.navigation.navigate(AppRoute.PROFILE, {profileId: this.props.post.profile.id});
    }

    _report = (text) => {
        if(text.length < 3 || text.length > 255) {
            return Alert.alert(i18n.t('common.report'), 'Report description should contains 3 to 255 chars');
        }

        this.setState({is_reporting: false});
        apiReportPost(this.props.post.id, text).then((res) => {
            Alert.alert(i18n.t('common.report'), 'Post reported successfully. Thank you for your contribution!');
        }).catch((err) => {
            Alert.alert(i18n.t('common.report'), i18n.t('common.an_error_occured_please_try_again_later'));
            console.error(err);
        });
    }

    _unfollow_ask = () => {
        Alert.alert(
            i18n.t('profile.unfollow') + ' ' + this.props.post.profile.username,
            i18n.t('profile.you_will_no_longer_see_user_posts'),
            [
              {text: i18n.t('profile.yes_unfollow'), onPress: this._unfollow},
              {text: i18n.t('common.cancel'), style: 'cancel'},
            ]
        );
    }

    _unfollow = () => {
        apiProfileUnfollow(this.props.post.profile.id).then((res) => {
            Alert.alert(
                i18n.t('profile.unfollow') + ' ' + this.props.post.profile.username,
                i18n.t('profile.user_unfollowed_successfully')
            );
        });
    }

    _delete = () => {
        apiDeletePost(this.props.post.id).then((res) => {
            alert('Post deleted successfully!');
        }).catch((err) => {
            alert(i18n.t('common.an_error_occured_please_try_again_later'));
            console.error(err);
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={this._openProfile}>
                    <ProfileAvatar profile={this.props.post.profile} size='large'/>
                </TouchableWithoutFeedback>

                <View style={styles.infoBox}>
                    <TouchableWithoutFeedback onPress={this._openProfile}>
                        <View style={styles.infoContainer}>
                            <Text category='s2'>
                                {this.props.post.profile.name}
                            </Text>
                            <Text appearance='hint' category='c1'>
                                {`${moment(this.props.post.created_at).fromNow()}`}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={styles.moreContainer}>
                        <Button
                            style={styles.moreBtn}
                            appearance='ghost'
                            status='basic'
                            onPress={this._openMore}
                            icon={MoreIcon}></Button>
                        
                        {/* Owner ActionSheet */}
                        <ActionSheet
                            ref={o => this.OwnerActionSheet = o}
                            options={[i18n.t('common.delete'), i18n.t('common.cancel')]}
                            cancelButtonIndex={1}
                            destructiveButtonIndex={0}
                            onPress={(i) => {
                                switch(i) {
                                    case 0: return this._delete();
                                }
                            }}
                            />

                        {/* Guest ActionSheet */}
                        <ActionSheet
                            ref={o => this.GuestActionSheet = o}
                            options={[i18n.t('common.report'), i18n.t('profile.unfollow'), i18n.t('common.cancel')]}
                            cancelButtonIndex={2}
                            destructiveButtonIndex={0}
                            onPress={(i) => {
                                switch(i) {
                                    case 0: return this.setState({is_reporting: true});
                                    case 1: return this._unfollow_ask();
                                }
                            }}
                            />
                        <DialogInput isDialogVisible={this.state.is_reporting}
                          title={i18n.t('common.report')}
                          message='Explain in few words why this post should be reported:'
                          submitText={i18n.t('common.report')}
                          submitInput={ (text) => this._report(text) }
                          closeDialog={() => this.setState({is_reporting: false})}>
                        </DialogInput>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: '6%',
        paddingVertical: 10
    },
    infoContainer: {
        marginTop: 2
    },
    infoBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 16,
        marginRight: 0
    },
    moreContainer: {
        marginRight: -5
    },
    moreBtn: {
        paddingHorizontal: 0,
        paddingVertical: 0
    }
});

const mapStateToProps = (state) => {
    return { current_user_id: state.auth.id };
}
const PostHeader = connect(mapStateToProps)(_PostHeader);
export default PostHeader;