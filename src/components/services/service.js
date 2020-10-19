import React from 'react';
import { StyleSheet, Modal, View, BackHandler, Image, TouchableHighlight } from 'react-native';
import { Text, Divider } from '@ui-kitten/components'
import { default as customTheme } from '../../styles/theme.json';
import { AppRoute } from '../../navigations/app.routes';
import PostHeader from '../../components/molecules/post-header.molecule';
import PostFooter from '../../components/molecules/post-footer.molecule';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Feather } from '@expo/vector-icons';
import { TotpGenerator } from '../../models/TotpGenerator';

// We are using PureComponent to optimize lists
// Pure component is reloaded only when its content is updated
class Service extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            service: this.props.service,
            generator: null,
            is_open: false,
            token: null,
            delay: null
        };
    }

    onPress = () => {
        this.startGenerator().then(() => {
            this.setState({
                is_open: !this.state.is_open
            })
        })
    }

    startGenerator = () => {
        return new Promise((resolve) => {
            if (this.state.generator)
                return resolve();

            this.setState({
                generator: new TotpGenerator(
                    this.state.service,
                    (token, delay) => {
                        this.setState({token, delay});
                    }
                )
            }, resolve);
        });
    }

    renderToken = () => {
        if (this.state.is_open) {
            return (
                <Text style={styles.tokenText} category='s1' numberOfLines={1}>
                    {`${this.state.token}`.replace(/\B(?=(\d{3})+(?!\d))/g, "  ")}
                </Text>
            );
        }
    }

    renderCountdown = () => {
        if (this.state.is_open) {
            return (
                <Text style={styles.tokenText} category='s1' numberOfLines={1}>
                    {this.state.delay}
                </Text>
            );
        }
    }

    render() {
        return (
            <TouchableHighlight
            underlayColor={customTheme['color-basic-900']}
            onPress={this.onPress}>
                <View style={styles.container}>
                    <Image
                        style={styles.issuerIcon}
                        source={{
                        uri: 'https://snack.expo.io/web-player/37/static/media/react-native-logo.2e38e3ef.png',
                        }}
                    />
                    <View style={styles.infoWrapper}>
                        <Text style={styles.issuerNameText} appearance='hint' category='s2' numberOfLines={1}>
                            {this.state.service.issuer.name}
                        </Text>
                        <Text style={styles.labelText} category='s1' numberOfLines={1}>
                            {this.state.service.label}
                        </Text>
                        {this.renderToken()}
                    </View>
                    <View style={styles.rightWrapper}>
                        <Feather
                            style={styles.rightIcon}
                            name={this.state.is_open ? "chevron-up" : "chevron-down"}
                            color='#CCC'
                            size={24}/>
                        {this.renderCountdown()}
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // marginVertical: 8,
        backgroundColor: customTheme['color-basic-800'],
        borderBottomColor: customTheme['color-basic-700'],
        borderBottomWidth: 1,
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 15,
    },
    issuerIcon: {
        height: 40,
        width: 40,
        marginHorizontal: 15,
        marginVertical: 5
    },
    infoWrapper: {
        flex: 1,
        flexDirection: 'column',
        paddingVertical: 4
    },
    issuerNameText: {
        lineHeight: 18,
        textTransform: 'uppercase',
        marginBottom: 5
    },
    labelText: {
        lineHeight: 18,
        fontSize: 18
    },
    tokenText: {
        marginTop: 20,
        lineHeight: 35,
        fontSize: 35
    },
    rightWrapper: {
        paddingHorizontal: 20
    },
    rightIcon: {
        // marginHorizontal: 20,
        marginVertical: 10
    },
});

export default Service;