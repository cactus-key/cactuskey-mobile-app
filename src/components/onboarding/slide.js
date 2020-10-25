import React from 'react';
import { Text } from '@ui-kitten/components';
import { withStyles } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Svgs } from '../../constants/svgs.constants';

class OnboardingSlide extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            text: this.props.text,
            svg: this.props.svg
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <SvgXml style={styles.svg} xml={Svgs.fetch(this.state.svg)} width="280" height="280"/>
                <Text style={styles.text}>{this.state.text}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    svg: {
        marginBottom: '10%'
    },
    text: {
        color: 'white',
        fontSize: 20,
        lineHeight: 20,
        textAlign: 'center'
    }
});

export default withStyles(OnboardingSlide);