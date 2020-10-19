import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Layout, Input, Button, Spinner } from '@ui-kitten/components';
import { AppRoute } from '../../navigations/app.routes';
import { default as customTheme } from '../../styles/theme.json';
import { authCheckCode } from '../../services/auth.service';
import { connect } from 'react-redux';
import {API_ORIGIN} from '../../../config';

class _PhoneConfirmScene extends React.Component {

    constructor(props) {
        super(props);
        this.token = this.props.route.params.token;
        this.code = '';
        this.state = {
            error: null,
            processing: false
        }

        // Logout (clear token)
        this.props.dispatch({ type: "CLEAR_TOKEN" });
    }

    _onCodeInput = (code) => {
        this.code = code;
    }

    _setError = (error = null, processing = false) => {
        this.setState({processing, error});
    }

    _renderForm = () => {
        if(!this.state.processing) {
            return (
                <View>
                    <Input
                        label='Confirmation Code'
                        placeholder='XXXXXX'
                        status='basic'
                        size='large'
                        autoCapitalize='none'
                        defaultValue={this.code}
                        keyboardType='number-pad'
                        onChangeText={this._onCodeInput}
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
        if(this.code !== '') {
            this._setError(null, true);
            authCheckCode(this.token, this.code).then((res) => {
                if(res.status == 403) {
                    return this._setError('Invalid confirmation code');
                }

                if(res.status != 200) {
                    this._setError('An error occured');
                    return console.error(res);
                }

                this.props.dispatch({ type: "STORE_TOKEN", value: res.json.token });
                this.props.navigation.navigate(AppRoute.MAIN);
                setTimeout(() => this._setError(null), 500);
            }).catch((error) => {
                this.setState({processing: false, error: 'An error occured'});
                console.error(error);
            })
        } else {
            this._setError('You should enter code');
        }
    }

    render() {
        if(this.state.processing) {
            return (
                <Layout style={{flex:1}}>
                    <View style={{alignItems: 'center', marginTop: 15}}><Spinner size='giant'/></View>
                </Layout>
            );
        } else {
            return (
                <Layout style={styles.container}>
                    <View style={styles.offset}></View>
                    <View style={styles.box}>
                        <Text style={styles.title}>Confirm</Text>
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

const PhoneConfirmScene = connect()(_PhoneConfirmScene);
export { PhoneConfirmScene };