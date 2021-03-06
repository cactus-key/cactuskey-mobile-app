import React from 'react';
import { StyleSheet, View, Alert, Image, TouchableHighlight, Animated } from 'react-native';
import { Text } from '@ui-kitten/components'
import { withStyles } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import { TotpGenerator } from '../../models/TotpGenerator';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ProgressCircle from 'react-native-progress-circle'
import * as Animatable from 'react-native-animatable';
import { showMessage } from "react-native-flash-message";
import i18n from "../../../i18n";

const CONTAINER_MIN_HEIGHT = 80;
const CONTAINER_MAX_HEIGHT = 130;
const CONTAINER_ANIMATION_DELAY_IN_MS = 150;

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
            delay: null,
            animation_value: new Animated.Value(CONTAINER_MIN_HEIGHT)
        };

        this.preventEdition = false;
        this.clickCallback = this.props.onClick;
        this.editCallback = this.props.onEdit;
        this.deleteCallback = this.props.onDelete;
    }

    async componentWillReceiveProps(nextProps) {
        let newState = {};

        if (await this.state.service.hash() !== await nextProps.service.hash()) {
            newState['service'] = nextProps.service;
            newState['generator'] = new TotpGenerator(
                nextProps.service,
                (token, delay) => {
                    this.setState({token, delay});
                }
            );
        }

        if (nextProps.is_edit_mode !== this.state.is_edit_mode) {
            newState['is_edit_mode'] = nextProps.is_edit_mode;
        }

        this.setState(newState);

        if (nextProps.is_open !== this.state.is_open) {
            if (nextProps.is_open) {
                this.state.generator.start();
                Animated.timing(this.state.animation_value, {
                    toValue : CONTAINER_MAX_HEIGHT,
                    timing : CONTAINER_ANIMATION_DELAY_IN_MS
                }).start();
            } else {
                this.state.generator.stop();
                Animated.timing(this.state.animation_value, {
                    toValue : CONTAINER_MIN_HEIGHT,
                    timing : CONTAINER_ANIMATION_DELAY_IN_MS
                }).start();
            }

            setTimeout(() => {
                this.setState({is_open : nextProps.is_open})
            }, CONTAINER_ANIMATION_DELAY_IN_MS/2);
        }
    }

    onClick = () => {
        if (!this.state.is_edit_mode) {
            this.clickCallback(this.state.service);
        } else {
            setTimeout(() => {
                if (this.preventEdition) return;
                this.editCallback(this.state.service);
            }, 100);
        }
    }

    onTokenPress = () => {
        showMessage({
            message: i18n.t('services.copy_msg', {issuer: this.state.service.issuer}),
            type: "success",
        });
    }

    onDelete = () => {
        // Prevent edition system to avoid
        // triggering onClick() callback
        // when deletion icon is clicked
        this.preventEdition = true;
        setTimeout(() => {
            this.preventEdition = false;
        }, 200);

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
                    onPress: () => this.deleteCallback(this.state.service)
                }
            ],
            { cancelable: true }
        );
    }

    renderToken = () => {
        if (this.state.is_open) {
            return (
                <Animatable.View
                    animation="fadeIn"
                    duration={CONTAINER_ANIMATION_DELAY_IN_MS}
                    useNativeDriver>
                    <TouchableOpacity onPress={this.onTokenPress}>
                        <Text style={styles.tokenText} category='s1' numberOfLines={1}>
                            {(() => {
                                if (this.state.service.digits === 6) {
                                    return `${this.state.token}`.replace(/\B(?=(\d{3})+(?!\d))/g, "  ")
                                } else if (this.state.service.digits === 8) {
                                    return `${this.state.token}`.replace(/\B(?=(\d{4})+(?!\d))/g, "  ")
                                } else {
                                    return `${this.state.token}`;
                                }
                            })()}
                        </Text>
                    </TouchableOpacity>
                </Animatable.View>
            );
        }
    }

    renderCountdown = () => {
        if (this.state.is_open) {
            return (
                <Animatable.View
                    animation="fadeIn"
                    duration={CONTAINER_ANIMATION_DELAY_IN_MS}
                    useNativeDriver
                    style={styles.countdownWrapper}>
                    <ProgressCircle
                        percent={this.state.delay * 100.0 / this.state.service.periodInSec}
                        radius={16}
                        borderWidth={2}
                        color={this.props.theme['color-primary-500']}
                        shadowColor={this.props.theme['color-basic-700']}
                        bgColor={this.props.theme['color-basic-800']}
                        style={styles.countdown} >
                        <Text style={{ fontSize: 14 }}>{this.state.delay}</Text>
                    </ProgressCircle>
                </Animatable.View>
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
        const animatedContainerStyle = {height: this.state.animation_value};
        return (
            <TouchableHighlight
            underlayColor={this.props.theme['color-basic-600']}
            onPress={this.onClick}>
                <Animated.View style={[styles.container, animatedContainerStyle, {
                    backgroundColor: this.props.theme['color-basic-800'],
                    borderBottomColor: this.props.theme['color-basic-700'],
                }]}>
                    {this.renderDeleteButton()}
                    <Image
                        style={styles.issuerIcon}
                        source={this.state.service.issuerIcon}
                    />
                    <View style={styles.infoWrapper}>
                        <Text style={styles.issuerNameText} appearance='hint' category='s2' numberOfLines={1}>
                            {this.state.service.issuerName}
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
                </Animated.View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: CONTAINER_MIN_HEIGHT,
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
        borderRadius: 5,
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
        marginBottom: 5,
        textTransform: 'uppercase'
    },
    labelText: {
        lineHeight: 18,
        fontSize: 18
    },
    countdownWrapper: {
        paddingTop: 15
    },
    tokenText: {
        marginTop: 20,
        lineHeight: 33,
        fontSize: 33
    },
    rightWrapper: {
        paddingHorizontal: 20
    },
    rightIcon: {
        marginVertical: 10,
        marginLeft: 4
    },
});

export default withStyles(Service);