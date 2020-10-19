import React from 'react';
import I18n from "../../../i18n";
import { Button as ReactButton, StyleSheet, View, Alert } from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';
import { default as customTheme } from '../../styles/theme.json';
import { authResetPassword } from '../../services/auth.service';
import { AppRoute } from '../../navigations/app.routes';
import { Feather } from '@expo/vector-icons';

class ResetPasswordScene extends React.Component {

    constructor(props) {
        super(props);
        this.email = this.props.route.params.email;
        this.state = {
            processing: false
        }
    }

    _onSubmit = () => {
        authResetPassword(this.email).then((res) => {
            Alert.alert(I18n.t('auth.reset_link_sent'), I18n.t('auth.click_on_it_to_reset_your_password'));
            this.props.navigation.goBack();
        }).catch((err) => {
            console.error(err);
            Alert.alert(I18n.t('common.an_error_occured'), I18n.t('common.please_try_again_later'));
        });
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
                        &nbsp;&nbsp;{I18n.t('auth.forgot_password')}
                    </Text>
                    <Text>{I18n.t('auth.we_ll_send_secure_link_to_reset_password')}:</Text>
                    <Text style={{textAlign: 'center', fontWeight: 'bold', marginTop: 30}}>
                        {this.email}
                    </Text>
                    <ReactButton title={I18n.t('auth.not_your_email')}
                                 onPress={() => this.props.navigation.navigate(AppRoute.AUTH_EMAIL)}/>
                    
                    <View style={styles.actions}>
                        <View style={styles.action_left}>
                            <Button
                                style={{width: '100%', paddingLeft: 0, paddingRight: 0, alignItems: 'flex-start'}}
                                status='basic'
                                appearance='ghost'
                                onPress={() => this.props.navigation.goBack()}>
                                    {I18n.t('common.cancel')}
                                </Button>
                        </View>
                        <View style={styles.action_right}>
                            <Button
                                status='primary'
                                onPress={this._onSubmit}>{I18n.t('auth.reset_password_btn')}</Button>
                        </View>
                    </View>
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
        flex: 10,
    },
    title: {
        fontSize: 26,
        color: customTheme['color-basic-300'],
        paddingTop: 5,
        marginBottom: 40
    },
    subtitle: {
        fontSize: 16
    },
    actions: {
        marginTop: 40,
        flex: 1,
        flexDirection: 'row'
    },
    action_left: {
        flex: 1,
        alignItems: 'flex-start'
    },
    action_right: {
        flex: 2,
        alignItems: 'flex-end'
    }
});

export { ResetPasswordScene };