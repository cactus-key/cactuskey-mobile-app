import React from 'react';
import I18n from "../../../i18n";
import { StyleSheet, Text, View } from 'react-native';
import { Layout, Input, Button, Spinner } from '@ui-kitten/components';
import { AppRoute } from '../../navigations/app.routes';
import { default as customTheme } from '../../styles/theme.json';
import { authFullLogin } from '../../services/auth.service';
import { fetchExpoDeviceData } from '../../services/device_session.service';
import { connect } from 'react-redux';
import { Feather } from '@expo/vector-icons';

const sha256 = require('sha256');
import {HK1} from '../../../config';

const PasswordIcon = () => (
    <Feather color={customTheme['color-basic-400']} name="lock" size={22} style={{marginRight: 2}}/>
);

class _PasswordScene extends React.Component {

    constructor(props) {
        super(props);
        this.email = this.props.route.params.email;
        this.password = 'crokis';
        this.state = {
            error: null,
            processing: false
        }
    }

    _onPasswordInput = (password) => {
        this.password = password;
    }

    _setError = (error = null, processing = false) => {
        this.setState({error, processing});
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
                        // label='Password'
                        autoCompleteType='password'
                        placeholder={I18n.t('common.password')}
                        status='basic'
                        size='large'
                        autoCapitalize='none'
                        secureTextEntry={true}
                        onChangeText={this._onPasswordInput}
                        onSubmitEditing={this._onSubmit}
                        icon={PasswordIcon}
                        defaultValue='crokis'
                        returnKeyType='go'
                        />
                    <Text style={{color:'red'}}>{this.state.error}</Text>

                    <View style={styles.actions}>
                        <View style={styles.action_left}>
                            <Button
                                style={{width: '100%', paddingLeft: 0, paddingRight: 0, alignItems: 'flex-start'}}
                                status='basic'
                                appearance='ghost'
                                onPress={this._forgotPassword}>{I18n.t('auth.forgot_password_btn')}</Button>
                        </View>
                        <View style={styles.action_right}>
                            <Button
                                style={{width: 100}}
                                status='primary'
                                onPress={this._onSubmit}>{I18n.t('auth.login_btn')}</Button>
                        </View>
                    </View>
                </View>
            );
        }
    }

    _onSubmit = async () => {
        this._setError(null, true);
        if(this.password !== '') {
            // Ask push notification permission
            let device_data = await fetchExpoDeviceData();

            // Hash password
            const password_h1 = sha256(`${HK1}${this.password}`);

            authFullLogin(this.email, password_h1, device_data).then((res) => {
                if(res.status == 200) {
                    // Store salt and compute server delta
                    this.props.dispatch({
                        type: "STORE_USER_CREDS",
                        value: {
                            token: res.json.token,
                            id: res.json.id,
                            email: this.email,
                            password_h1: password_h1,
                            salt: res.json.salt,
                            server_delta: res.json.server_time - Math.round(new Date().getTime()/1000)
                        }
                    });
                    this.props.navigation.navigate(AppRoute.MAIN);
                    setTimeout(() => this._setError(null), 500);
                }
                else if(res.status == 403) this._setError(I18n.t('auth.invalid_password'));
                else this._setError(I18n.t('common.an_error_occured_please_try_again_later'));
            }).catch((err) => {
                console.error(err);
                this._setError(I18n.t('common.an_error_occured_please_try_again_later'));
            });
        } else {
            this._setError(I18n.t('auth.you_should_enter_a_password'));
        }
    }

    _forgotPassword = () => {
        this.props.navigation.navigate(AppRoute.AUTH_RESET_PASSWORD, {email: this.email});
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
                        &nbsp;&nbsp;{I18n.t('auth.login')}
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

const PasswordScene = connect()(_PasswordScene);
export { PasswordScene };