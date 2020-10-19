import React from 'react';
import { View, StyleSheet, Platform, Animated } from 'react-native';
import Fall from '../animations/fall';

class Test extends React.Component {
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Fall></Fall>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    subview: {
        // Platform.OS
        ...Platform.select({
            ios: {
                backgroundColor: 'red'
            },
            android: {
                backgroundColor: 'blue'
            }
        }),
        width: 100,
        height: 100
    }
});

export default Test;