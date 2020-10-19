import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';

class SearchResult extends React.Component {
    render() {
        const { profile, _displayProfile } = this.props;
        console.log(profile);
        return (
            <TouchableOpacity style={styles.View} onPress={() => _displayProfile(profile.id)}>
                <View style={styles.Avatar}>
                </View>
                <View style={styles.Content}>
                    <Text style={styles.title}>{profile.name}</Text>
                    <Text style={styles.subtitle}>{profile.username}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    View: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10
    },
    Avatar:  {
       flex: 1
    },
    Content:  {
        flex: 4
    },
    title: {
        fontWeight: 'bold',
        fontSize: 15
    },
    subtitle: {
        color: 'gray',
        fontSize: 15
    }
});

export default SearchResult;