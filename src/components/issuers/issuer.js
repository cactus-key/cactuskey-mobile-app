import React from 'react';
import { Text } from '@ui-kitten/components';
import { withStyles } from '@ui-kitten/components';
import { StyleSheet, View, Image, TouchableHighlight } from 'react-native';

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
            underlayColor={this.props.theme['color-basic-600']}
            onPress={this.clickCallback}>
                <View style={[styles.container, {
                    backgroundColor: this.props.theme['color-basic-800'],
                    borderBottomColor: this.props.theme['color-basic-700'],
                }]}>
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
        borderBottomWidth: 1,
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 5,
    },
    iconWrapper: {

    },
    icon: {
        height: 40,
        width: 40,
        borderRadius: 5,
        marginHorizontal: 15,
        marginVertical: 5
    },
    nameWrapper: {
        paddingLeft: 10,
        paddingTop: 14
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'normal'
    }
});

export default withStyles(Issuer);