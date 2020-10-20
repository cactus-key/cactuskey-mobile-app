import React from 'react';
import I18n from "../../../i18n";
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Layout, TopNavigation, TopNavigationAction, Text, Input, Button, Spinner } from '@ui-kitten/components';
import { default as customTheme } from '../../styles/theme.json';
import { Service } from '../../models/Service';
import { ServiceStore } from '../../models/ServiceStore';
import { AppRoute } from '../../navigations/app.routes';
import { showMessage } from "react-native-flash-message";

const AccountIcon = () => (
    <Feather color={customTheme['color-basic-400']} name="mail" size={22} style={{marginRight: 2}}/>
);

const SecretIcon = () => (
    <Feather color={customTheme['color-basic-400']} name="lock" size={22} style={{marginRight: 2}}/>
);

class AddManual_InfoScene extends React.Component {

    constructor(props) {
        super(props);
        this.account = '';
        this.secret = '';
        this.is_processing = false;
        this.state = {
            issuer: this.props.route.params.issuer,
            should_display_spinner: false
        }
    }

    _onAccountInput = (account) => {
        this.account = account;
    }

    _onSecretInput = (secret) => {
        this.secret = secret;
    }

    onSubmit = async () => {
        if (this.is_processing) return;
        this.is_processing = true;
        this.setState({should_display_spinner: true});

        // Create and store new service
        try {
            if (!this.account) throw new Error("missing_account");
            if (!this.secret) throw new Error("missing_secret");
            const service = Service.newFromInfo({
                label: this.account,
                issuer: this.state.issuer.name,
                secret: this.secret
            });
            ServiceStore.getInstance().store(service).then(() => {
                setTimeout(() => {
                    this.props.route.params.reloadServicesList();
                    this.props.navigation.navigate(AppRoute.SERVICES_LIST);
                    showMessage({
                        message: I18n.t('services.add.success_msg'),
                        type: "success",
                    });
                }, 400);
            })
        } catch (error) {
            this.setState({should_display_spinner: false});
            this.is_processing = false;

            if (error.message === 'missing_account')
                alert(I18n.t('services.add.manual.info.errors.missing_account'));
            else if(error.message === 'missing_secret')
                alert(I18n.t('services.add.manual.info.errors.missing_secret'));
            else
                alert(I18n.t('services.add.manual.info.errors.unknown'));
        }
    }

    renderBack = () => (
        <TopNavigationAction
            icon={() => (<Feather name="arrow-left" color='#CCC' size={24}/>)}
            activeOpacity={0.5}
            onPress={() => this.props.navigation.goBack()}
        />
    );

    renderSpinner() {
        if(this.state.should_display_spinner) {
            return (<View style={styles.spinner}><Spinner size='giant'/></View>);
        }
    }

    renderForm() {
        if (!this.state.should_display_spinner) {
            return (
                <View>
                    <Input
                        label={I18n.t('services.add.manual.info.account')}
                        labelStyle={styles.accountInputLabel}
                        style={styles.accountInput}
                        placeholder={I18n.t('services.add.manual.info.account_placeholder')}
                        status='basic'
                        ref={(input) => { this.accountInput = input; }}
                        size='large'
                        autoCapitalize='none'
                        onChangeText={this._onAccountInput}
                        onSubmitEditing={() => { this.secretInput.focus(); }}
                        icon={AccountIcon}
                        returnKeyType='next' />

                    <Input
                        label={I18n.t('services.add.manual.info.secret')}
                        labelStyle={styles.secretInputLabel}
                        style={styles.secretInput}
                        placeholder={I18n.t('services.add.manual.info.secret_placeholder')}
                        status='basic'
                        ref={(input) => { this.secretInput = input; }}
                        size='large'
                        autoCapitalize='none'
                        onChangeText={this._onSecretInput}
                        onSubmitEditing={this.onSubmit}
                        icon={SecretIcon}
                        returnKeyType='done' />

                    <Button
                        style={styles.submitButton}
                        appearance='outline'
                        onPress={this.onSubmit}>
                        {I18n.t('services.add.manual.info.button')}</Button>
                </View>
            );
        }
    }

    render() {
        return (
            <Layout style={styles.container} level='2'>
                <TopNavigation
                    alignment='center'
                    title={I18n.t('services.add.title')}
                    rightControls={[]}
                    leftControl={this.renderBack()} />
                <ScrollView style={styles.formWrapper}>
                    <Image
                        style={styles.icon}
                        source={this.state.issuer.icon}
                    />
                    <Text style={styles.text}>
                        {I18n.t('services.add.manual.info.text', {name: this.state.issuer.name})}
                    </Text>

                    {this.renderSpinner()}
                    {this.renderForm()}
                </ScrollView>
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    formWrapper: {
        paddingTop: 20,
        paddingHorizontal: 20
    },
    icon: {
        height: 40,
        width: 40,
        marginBottom: 10
    },
    text: {
        textAlign: 'left',
        marginBottom: 20
    },
    accountInputLabel: {
        fontSize: 14,
        color: customTheme['color-basic-300'],
        marginBottom: 6
    },
    accountInput: {
        backgroundColor: customTheme['color-basic-700'],
        marginBottom: 20
    },
    secretInputLabel: {
        fontSize: 14,
        color: customTheme['color-basic-300'],
        marginBottom: 6
    },
    secretInput: {
        backgroundColor: customTheme['color-basic-700'],
        marginBottom: 20
    },
    submitButton: {
        marginBottom: 240
    },
    spinner: {
        alignItems: 'center',
        marginTop: 30
    }
});

export { AddManual_InfoScene };