import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Layout, Input, Button, Spinner } from '@ui-kitten/components';
import { AppRoute } from '../../navigations/app.routes';
import { default as customTheme } from '../../styles/theme.json';
import { authSendCode } from '../../services/auth.service';
import { connect } from 'react-redux';
import {API_ORIGIN} from '../../../config';

class _PhoneCaptchaScene extends React.Component {

    constructor(props) {
        super(props);
        this.phone = '+17372302078';
        this.state = {
            error: null,
            display_captcha: false,
            processing: false
        }

        // Logout (clear token)
        this.props.dispatch({ type: "CLEAR_TOKEN" });
    }

    _onPhoneInput = (phone) => {
        this.phone = phone;
    }

    _setError = (error = null, processing = false) => {
        this.setState({processing, error});
    }

    _renderForm = () => {
        if(!this.state.processing) {
            return (
                <View>
                    <Input
                        label='Phone'
                        autoCompleteType='tel'
                        placeholder='06 00 00 00 00'
                        status='basic'
                        size='large'
                        autoCapitalize='none'
                        defaultValue={this.phone}
                        keyboardType='number-pad'
                        onChangeText={this._onPhoneInput}
                        onSubmitEditing={this._onSubmit} />
                    <Text style={{color:'red'}}>{this.state.error}</Text>
                    <Button
                        style={styles.submitBtn}
                        status='basic'
                        onPress={this._onSubmit}>Next</Button>
                </View>
            );
        }
    }

    _onSubmit = () => {
        this._setError(null);
        if(this.phone !== '') {
            this.setState({display_captcha: true});
        } else {
            this._setError('You should enter phone');
        }
    }

    onLoadEnd = (data) => {
        const url = data.nativeEvent.url;
        const splited = url.split("done?token=");
        if(splited.length > 1) {
            this.setState({display_captcha: false, processing: true});
            const token = (splited[1]);

            authSendCode(token, this.phone).then((res) => {
                if(res.status !=200) {
                    this._setError('An error occured. Please try again later.');
                    return console.error(res);
                }

                this.props.navigation.navigate(AppRoute.AUTH_PHONE_CONFIRM, {token: res.json.token});
                setTimeout(() => this._setError(null), 500);
            }).catch((error) => {
                this.setState({processing: false, error: 'An error occured. Please try again later.'});
                console.error(error);
            })
        }
    }

    render() {
        if(this.state.processing) {
            return (
                <Layout style={{flex:1}}>
                    <View style={{alignItems: 'center', marginTop: 15}}><Spinner size='giant'/></View>
                </Layout>
            );
        }
        else if(this.state.display_captcha) {
            return (
                <Layout style={{flex:1}}>
                    <WebView source={{ uri: API_ORIGIN + '/phone_auth/captcha?phone=+17372302078' }}
                             scrollEnabled={false}
                             onLoadEnd={this.onLoadEnd}></WebView>
                </Layout>
            );
        } else {
            return (
                <Layout style={styles.container}>
                    <View style={styles.offset}></View>
                    <View style={styles.box}>
                        <Text style={styles.title}>Welcome</Text>
                        {this._renderForm()}
                    </View>
                </Layout>
            );
        }
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
        flex: 5
    },
    title: {
        fontSize: 30,
        color: customTheme['color-basic-300'],
        marginBottom: 40
    },
    subtitle: {
        fontSize: 16
    },
    submitBtn: {
        marginTop: 25,
        width: '40%',
        marginLeft: '60%'
    }
});

const PhoneCaptchaScene = connect()(_PhoneCaptchaScene);
export { PhoneCaptchaScene };