import React from 'react';
import I18n from "../../../i18n";
import { StyleSheet, Text, View } from 'react-native';
import { Layout, Input, Button, Spinner } from '@ui-kitten/components';
import { fetchExpoDeviceData } from '../../services/device_session.service';
import { AppRoute } from '../../navigations/app.routes';
import { default as customTheme } from '../../styles/theme.json';
import { authRegister, authCheckUsername } from '../../services/auth.service';
import { connect } from 'react-redux';
import { Feather } from '@expo/vector-icons';

const sha256 = require('sha256');
import {HK1} from '../../../config';

const UsernameIcon = () => (
    <Feather color={customTheme['color-basic-400']} name="user" size={22} style={{marginRight: 2}}/>
);

const PasswordIcon = () => (
    <Feather color={customTheme['color-basic-400']} name="lock" size={22} style={{marginRight: 2}}/>
);

class _RegisterScene extends React.Component {

    constructor(props) {
        super(props);
        this.email = this.props.route.params.email;
        this.username = '';
        this.password = '';
        this.state = {
            username_error: null,
            password_error: null,
            processing: false
        }
        this.username_debounce_timeout = null;
    }

    _onPasswordInput = (password) => {
        this.password = password;
    }

    _onUsernameInput = (username) => {
        clearTimeout(this.username_debounce_timeout);
        this.username = username;

        // Validate username
        if(this._validateUsername()) {

            // Check if username is taken
            this.username_debounce_timeout = setTimeout(() => {
                authCheckUsername(this.username).then((res) => {
                    if(res.status == 200) { // if username found...
                        this._setUsernameError(I18n.t('auth.this_username_has_already_been_taken'));
                    }
                }).catch((err) => {});
            }, 400);
        }
    }

    _validateUsername = () => {
        const username_regex = /^[a-zA-Z0-9_-]{3,40}$/;
        if(!username_regex.test(this.username)) {
            this._setUsernameError(I18n.t('auth.username_should_contains'));
            return false;
        } else {
            this._setUsernameError(null);
            return true;
        }
    }

    _setUsernameError = (username_error = null, processing = false) => {
        this.setState({username_error, password_error: null, processing});
    }

    _setPasswordError = (password_error = null, processing = false) => {
        this.setState({username_error: null, password_error, processing});
    }

    _renderSpinner = () => {
        if(this.state.processing) {
            return (
                <View style={{alignItems: 'center', marginTop: 15}}><Spinner size='giant'/></View>
            );
        }
    }

    _renderForm = () => {
        if(!this.state.processing) {
            return (
                <View>
                    <Input
                        autoCompleteType='username'
                        placeholder={I18n.t('auth.choose_a_username')}
                        status='basic'
                        size='large'
                        autoCapitalize='none'
                        onSubmitEditing={() => { this.passwordInput.focus(); }}
                        blurOnSubmit={false}
                        onChangeText={this._onUsernameInput}
                        icon={UsernameIcon} />
                    <Text style={{color:'red'}}>{this.state.username_error}</Text>
                        
                    <Input
                        autoCompleteType='password'
                        placeholder={I18n.t('common.password')}
                        status='basic'
                        size='large'
                        autoCapitalize='none'
                        secureTextEntry={true}
                        ref={(input) => { this.passwordInput = input; }}
                        onChangeText={this._onPasswordInput}
                        onSubmitEditing={this._onSubmit}
                        icon={PasswordIcon}
                        style={{marginTop: 10}} />
                    <Text style={{color:'red'}}>{this.state.password_error}</Text>
                    

                    <View style={styles.actions}>
                        <View style={styles.action_right}>
                            <Button
                                style={{width: 100}}
                                status='primary'
                                onPress={this._onSubmit}>{I18n.t('auth.register_btn')}</Button>
                        </View>
                    </View>
                </View>
            );
        }
    }

    _onSubmit = async () => {
        this._setUsernameError(null, true);
        if(this._validateUsername()) {
            if(this.password !== '') {
                // Ask push notification permission
                let device_data = await fetchExpoDeviceData();
                
                // Hash password
                const password_h1 = sha256(`${HK1}${this.password}`);
                console.log("Registering...", password_h1);
                authRegister(this.email, this.username, password_h1, device_data).then((res) => {
                    if(res.status == 201) {
                        this.props.dispatch({ type: "STORE_USER_CREDS", value: {
                            token: res.json.token,
                            password_h1,
                            email: this.email,
                            id: 1,
                            salt: 'abc',
                            server_time: null
                        }});
                        this.props.navigation.navigate(AppRoute.MAIN);
                        setTimeout(() => this._setUsernameError(null), 500);
                    }
                    else if(res.status == 400) {
                        const errors = Object.values(res.json.errors).map(e => e[0]).join(" ");
                        this._setUsernameError(errors);
                    }
                    else this._setUsernameError(I18n.t('common.an_error_occured_please_try_again_later'));
                })
                .catch((err) => {
                    console.error(err);
                    this._setUsernameError(I18n.t('common.an_error_occured_please_try_again_later'));
                });
            } else {
                this._setPasswordError(I18n.t('auth.you_should_enter_a_password'));
            }
        }
    }

    render() {
        return (
            <Layout style={styles.container}>
                <View style={styles.offset}></View>
                <View style={styles.box}>
                    <Text style={styles.title}>
                        <Feather style={styles.back}
                                 name="arrow-left"
                                 size={24}
                                 onPress={() => this.props.navigation.goBack()}/>
                        &nbsp;&nbsp;{I18n.t('auth.register')}
                    </Text>
                    {this._renderSpinner()}
                    {this._renderForm()}
                </View>
            </Layout>
        )
    }
}

const styles = StyleSheet.create({
    back: {
        color: customTheme['color-basic-300'],
        marginRight: 40
    },
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20
    },
    offset: {
        flex: 1
    },
    box: {
        flex: 10
    },
    title: {
        fontSize: 30,
        color: customTheme['color-basic-300'],
        marginBottom: 40
    },
    subtitle: {
        fontSize: 16
    },
    actions: {
        marginTop: 25,
        flex: 1,
        flexDirection: 'row'
    },
    action_left: {
        flex: 1,
        alignItems: 'flex-start'
    },
    action_right: {
        flex: 1,
        alignItems: 'flex-end'
    }
});

const RegisterScene = connect()(_RegisterScene);
export { RegisterScene };