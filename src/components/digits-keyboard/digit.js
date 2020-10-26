import React from 'react';
import { Text } from '@ui-kitten/components';
import { withStyles } from '@ui-kitten/components';
import { StyleSheet, TouchableOpacity } from 'react-native';

class Digit extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            digit: this.props.digit
        };

        this.clickCallback = this.props.onClick;
    }

    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                activeOpacity={0.5}
                onPress={() => this.clickCallback(this.state.digit)}>

                <Text style={styles.text}>
                    {this.state.digit}
                </Text>

            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 60,
        height: 60,
        borderBottomColor: '#4A4A4A',
        borderBottomWidth: 1
    },
    text: {
        fontSize: 30,
        lineHeight: 60,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white'
    }
});

export default withStyles(Digit);