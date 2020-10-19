import React from 'react';
import { StyleSheet, View, Alert, Image, TouchableHighlight } from 'react-native';
import { Text } from '@ui-kitten/components'
import { default as customTheme } from '../../styles/theme.json';
import { Feather } from '@expo/vector-icons';
import { TotpGenerator } from '../../models/TotpGenerator';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import i18n from "../../../i18n";

// We are using PureComponent to optimize lists
// Pure component is reloaded only when its content is updated
class Service extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            service: this.props.service,
            generator: new TotpGenerator(
                this.props.service,
                (token, delay) => {
                    this.setState({token, delay});
                }
            ),
            is_open: this.props.is_open,
            is_edit_mode: this.props.is_edit_mode,
            token: null,
            delay: null
        };

        this.clickCallback = this.props.onClick;
        this.deleteCallback = this.props.onDelete;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.is_open !== this.state.is_open) {
            if (nextProps.is_open)
                this.state.generator.start();
            else
                this.state.generator.stop();
            
            // Toggle State
            this.setState({
                is_open: nextProps.is_open
            });
        }

        if (nextProps.is_edit_mode !== this.state.is_edit_mode) {
            this.setState({is_edit_mode: nextProps.is_edit_mode});
        }
    }

    onClick = () => {
        if (!this.state.is_edit_mode) {
            this.clickCallback();
        } else {
            // TODO: edit
        }
    }

    onDelete = () => {
        Alert.alert(
            i18n.t('services.delete.title'),
            i18n.t('services.delete.text', {name: this.state.service.label}),
            [
                {
                    text: i18n.t('common.cancel'),
                    style: "cancel"
                },
                {
                    text: i18n.t('common.delete'),
                    onPress: this.deleteCallback
                }
            ],
            { cancelable: true }
        );
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

    renderDeleteButton = () => {
        if (this.state.is_edit_mode) {
            return (
                <TouchableWithoutFeedback
                    onPress={this.onDelete}>
                    <Image
                        style={styles.deleteIcon}
                        source={require('../../assets/images/remove.png')}
                    />
                </TouchableWithoutFeedback>
            );
        }
    }

    render() {
        return (
            <TouchableHighlight
            underlayColor={customTheme['color-basic-600']}
            onPress={this.onClick}>
                <View style={styles.container}>
                    {this.renderDeleteButton()}
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
                            name={this.state.is_edit_mode ? "chevron-right" : (this.state.is_open ? "chevron-up" : "chevron-down")}
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
    deleteIcon: {
        height: 20,
        width: 20,
        marginLeft: 20,
        marginRight: 8,
        marginTop: 15
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