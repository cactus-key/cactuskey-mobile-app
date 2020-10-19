import React from 'react';
import { View, StyleSheet, Platform, Animated } from 'react-native';

class Fall extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            topPos: new Animated.Value(50)
        };
    }

    componentDidMount() {
        // Animated.timing(
        //     this.state.topPos,
        //     {
        //         toValue: 100,
        //         duration: 300
        //     }
        // ).start();

        // Dimensions.get('window').width

        // elasticite
        Animated.spring(
            this.state.topPos,
            {
                toValue: 100,
                speed: 3,
                bounciness: 30
            }
        ).start();
    }
    
    render() {
        return (
            <Animated.View style={[styles.subview, {top: this.state.topPos}]}>
                {this.props.children}
            </Animated.View>
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

export default Fall;