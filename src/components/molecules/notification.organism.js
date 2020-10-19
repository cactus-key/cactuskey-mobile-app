import React from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import i18n from "../../../i18n";
import { StyleSheet, View } from 'react-native';
import { ListItem } from '@ui-kitten/components';
import { AppRoute } from '../../navigations/app.routes';
import ProfileAvatar from '../atoms/profile-avatar.atom.js';

class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.notif = this.props.notification;
        moment.locale(i18n.locale);

        // (0, System information)
        // 1, New follower
        // 2, New follow request
        // 3, Follow request accepted
        // 4, New comment
        // (5, New post reaction)
        // (6, New comment reaction)

        switch (this.notif.code) {
            case 1: // New follower
                // this.title = `${this.notif.profile1.name} (@${this.notif.profile1.username}) started following you.`;
                this.title = i18n.t('notifs.x_started_following_you', {
                    name: `${this.notif.profile1.name} (@${this.notif.profile1.username})`
                });
                this.route_endpoint = AppRoute.PROFILE;
                this.route_resource = {profileId: this.notif.profile1_id};
                this.avatar_profile_id = this.notif.profile1_id;
                break;

            case 2: // New follow request
                this.title = i18n.t('notifs.x_wants_to_follow_you', {
                    name: `${this.notif.profile1.name} (@${this.notif.profile1.username})`
                });
                this.route_endpoint = AppRoute.PROFILE;
                this.route_resource = {profileId: this.notif.profile1_id};
                this.avatar_profile_id = this.notif.profile1_id;
                break;

            case 3: // Follow request accepted
                this.title = i18n.t('notifs.x_accepted_your_follow_request', {
                    name: `${this.notif.profile1.name} (@${this.notif.profile1.username})`
                });
                this.route_endpoint = AppRoute.PROFILE;
                this.route_resource = {profileId: this.notif.profile1_id};
                this.avatar_profile_id = this.notif.profile1_id;
                break;

            case 4: // New comment
                this.title = i18n.t('notifs.x_commented_your_post', {
                    name: `${this.notif.profile1.name} (@${this.notif.profile1.username})`
                });
                this.route_endpoint = AppRoute.SINGLEPOST;
                this.route_resource = {postId: this.notif.post1_id};
                this.avatar_profile_id = this.notif.profile1_id;
                break;
            
            default:
                break;
        }
    }

    _onClick = () => {
        if(this.route_endpoint && this.route_resource)
            this.props.navigation.navigate(this.route_endpoint, this.route_resource);
    }

    _renderAvatar = () => {
        if(this.avatar_profile_id)
            return (<ProfileAvatar navigation={this.props.navigation} profile={this.avatar_profile_id}/>);
        else return (<View style={styles.noAvatar}></View>);
    }

    render() {
        return (
            <ListItem
                title={this.title}
                titleStyle={[styles.item, {fontWeight: this.notif.is_read ? 'normal' : 'bold'}]}
                description={`${moment(this.notif.created_at).fromNow()}`}
                icon={this._renderAvatar}
                onPress={this._onClick}
            />
        );
    }
}

const styles = StyleSheet.create({
    item: {
        fontSize: 14,
        lineHeight: 18,
        marginBottom: 4
    },
    noAvatar: {
        marginRight: -30
    }
});

export default Notification;