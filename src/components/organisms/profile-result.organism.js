import React from 'react';
import { ListItem } from '@ui-kitten/components'
import { AppRoute } from '../../navigations/app.routes';
import ProfileAvatar from '../atoms/profile-avatar.atom';

class ProfileResult extends React.PureComponent {
    _openProfile = () => {
        this.props.navigation.navigate(AppRoute.PROFILE, {profileId: this.props.profile.id});
    }

    render() {
        return (
            <ListItem title={this.props.profile.name}
                      description={this.props.profile.username}
                      icon={() => (<ProfileAvatar profile={this.props.profile} />)}
                      onPress={this._openProfile} />
        );
    }
}

export default ProfileResult;