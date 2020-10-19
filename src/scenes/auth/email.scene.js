import React from 'react';
import I18n from "../../../i18n";
import { APP_NAME } from '../../../config';
import { StyleSheet, Text, View } from 'react-native';
import { Layout, Input, Button, Spinner } from '@ui-kitten/components';
import { AppRoute } from '../../navigations/app.routes';
import { default as customTheme } from '../../styles/theme.json';
import { authCheckEmail } from '../../services/auth.service';
import { Feather } from '@expo/vector-icons';
import { connect } from 'react-redux';

const EmailIcon = () => (
    <Feather color={customTheme['color-basic-400']} name="mail" size={22} style={{marginRight: 2}}/>
);

class _EmailScene extends React.Component {

    constructor(props) {
        super(props);
        this.email = 'devcrokis@gmail.com';
        this.state = {
            error: null,
            processing: false
        }

        // Logout (clear token)
        this.props.dispatch({ type: "CLEAR_USER_DATA" });
    }

    _onEmailInput = (email) => {
        this.email = email;
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
                        // label="Email"
                        // labelStyle={{fontSize: 14, color: customTheme['color-basic-300']}}
                        autoCompleteType='email'
                        placeholder={I18n.t('common.email')}
                        status='basic'
                        size='large'
                        autoCapitalize='none'
                        defaultValue={this.email}
                        keyboardType='email-address'
                        onChangeText={this._onEmailInput}
                        onSubmitEditing={this._onSubmit}
                        icon={EmailIcon}
                        returnKeyType='next' />
                    <Text style={{color:'red', marginBottom: 10}}>{this.state.error}</Text>
                    
                    <Text style={styles.globalHint}>
                        🔒 {I18n.t('auth.you_will_never_receive_emails')}
                    </Text>

                    <Button
                        style={styles.submitBtn}
                        status='basic'
                        onPress={this._onSubmit}>{I18n.t('common.next')}</Button>
                </View>
            );
        }
    }

    _onSubmit = () => {
        this._setError(null, true);
        if(this.email !== '') {
            const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/;
            if (email_regex.test(this.email)) {
                authCheckEmail(this.email).then((res) => {
                    if(res.status == 200 || res.status == 404) {
                        const route = (res.status == 200 ? AppRoute.AUTH_PASSWORD : AppRoute.AUTH_REGISTER);
                        this.props.navigation.navigate(route, {email: this.email});
                        setTimeout(() => this._setError(null), 500);
                    }
                    else this._setError(I18n.t('common.an_error_occured_please_try_again_later'));
                })
                .catch((err) => {
                    console.error(err);
                    this._setError(I18n.t('common.an_error_occured_please_try_again_later'));
                });
            } else {
                this._setError(I18n.t('auth.you_should_enter_a_valid_email'));
            }
        } else {
            this._setError(I18n.t('auth.you_should_enter_a_valid_email'));
        }
    }

    render() {
        return (
            <Layout style={styles.container}>
                <View style={styles.offset}></View>
                <View style={styles.box}>
                    <Text style={styles.title}>{I18n.t('auth.welcome_to')}</Text>
                    <Text style={[styles.title, {marginBottom: 50}]}>{APP_NAME}</Text>
                    {this._renderSpinner()}
                    {this._renderForm()}
                </View>
            </Layout>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20
    },
    offset: {
        flex: 1
    },
    box: {
        flex: 6
    },
    title: {
        fontSize: 30,
        color: customTheme['color-basic-300'],
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 16
    },
    globalHint: {
        fontWeight: 'normal',
        fontSize: 14,
        color: customTheme['color-basic-400'],
        marginTop: 0
    },
    submitBtn: {
        marginTop: 50,
        width: '40%',
        marginLeft: '60%'
    }
});

const EmailScene = connect()(_EmailScene);
export { EmailScene };