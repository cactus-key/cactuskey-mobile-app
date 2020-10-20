import React from 'react';
import { StyleSheet, View, Image, TouchableHighlight } from 'react-native';
import { Text } from '@ui-kitten/components'
import { default as customTheme } from '../../styles/theme.json';

// We are using PureComponent to optimize lists
// Pure component is reloaded only when its content is updated
class Issuer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            issuer: this.props.issuer
        };

        this.clickCallback = this.props.onClick;
    }

    render() {
        return (
            <TouchableHighlight
            underlayColor={customTheme['color-basic-600']}
            onPress={this.clickCallback}>
                <View style={styles.container}>
                    <Image
                        style={styles.icon}
                        source={this.state.issuer.icon}
                    />
                    <View style={styles.nameWrapper}>
                        <Text style={styles.nameText} category='s1' numberOfLines={1}>
                            {this.state.issuer.name}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: customTheme['color-basic-800'],
        borderBottomColor: customTheme['color-basic-700'],
        borderBottomWidth: 1,
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 5,
    },
    icon: {
        height: 40,
        width: 40,
        marginHorizontal: 15,
        marginVertical: 5
    },
    nameWrapper: {
        paddingLeft: 10,
        paddingTop: 14
    },
    nameText: {
        textTransform: 'capitalize',
        fontSize: 18,
        fontWeight: 'normal'
    }
});

export default Issuer;