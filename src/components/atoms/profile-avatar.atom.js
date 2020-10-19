import React from 'react';
import { Avatar } from '@ui-kitten/components';

const ProfileAvatar = ({profile, size}) => {
    let img;
    if(profile.avatar_url == null) {
        img = require('../../assets/images/profile.png');
    } else {
        img = {uri: profile.avatar_url};
    }
    
    return (<Avatar source={img} size={size}/>);
};

export default ProfileAvatar;