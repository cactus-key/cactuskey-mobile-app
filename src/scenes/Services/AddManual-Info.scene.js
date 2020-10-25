import React from 'react';
import i18n from "../../../i18n";
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Layout, TopNavigation, TopNavigationAction, Text, Input, Button, Spinner } from '@ui-kitten/components';
import { withStyles } from '@ui-kitten/components';
import { Service } from '../../models/Service';
import { ServiceStore } from '../../models/ServiceStore';
import { AppRoute } from '../../navigations/app.routes';
import { showMessage } from "react-native-flash-message";
import { AppConstants } from '../../constants/app.constants';
import { BugsnagService } from '../../services/bugsnag.service';

const AccountIcon = (color) => (
    <Feather color={color} name="mail" size={22} style={{marginRight: 2}}/>
);

const SecretIcon = (color) => (
    <Feather color={color} name="lock" size={22} style={{marginRight: 2}}/>
);

class _AddManual_InfoScene extends React.Component {

    constructor(props) {
        super(props);
        this.logger = BugsnagService.sceneBreadcrumbLogger('Services/AddManual-Info');

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
        this.logger('Form submit');

        // Missing account label
        if (!this.account)
            return alert(i18n.t('services.add.manual.info.errors.missing_account'));

        // Missing secret
        if (!this.secret)
            return alert(i18n.t('services.add.manual.info.errors.missing_secret'));

        this.is_processing = true;
        this.setState({should_display_spinner: true});

        // Create and store new service
        try {
            const service = Service.newFromInfo({
                label: this.account,
                issuer: this.state.issuer.key,
                secret: this.secret
            });
            
            ServiceStore.getInstance().store(service).then(() => {
                setTimeout(() => {
                    this.props.route.params.reloadServicesList();
                    this.props.navigation.navigate(AppRoute.SERVICES_LIST);
                    showMessage({
                        message: i18n.t('services.add.success_msg'),
                        type: "success",
                    });
                }, 400);
            })
        } catch (error) {
            this.setState({should_display_spinner: false});
            this.is_processing = false;
            alert(i18n.t('services.add.manual.info.errors.unknown'));
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
                        label={i18n.t('services.add.manual.info.account')}
                        labelStyle={[styles.accountInputLabel, {
                            color: this.props.theme['color-basic-300']
                        }]}
                        style={[styles.accountInput, {
                            backgroundColor: this.props.theme['color-basic-700']
                        }]}
                        placeholder={i18n.t('services.add.manual.info.account_placeholder')}
                        status='basic'
                        ref={(input) => { this.accountInput = input; }}
                        size='large'
                        autoCapitalize='none'
                        onChangeText={this._onAccountInput}
                        onSubmitEditing={() => { this.secretInput.focus(); }}
                        icon={() => AccountIcon(this.props.theme['color-basic-400'])}
                        maxLength={AppConstants.MAX_LABEL_LENGTH}
                        returnKeyType='next' />

                    <Input
                        label={i18n.t('services.add.manual.info.secret')}
                        labelStyle={[styles.secretInputLabel, {
                            color: this.props.theme['color-basic-300']
                        }]}
                        style={[styles.secretInput, {
                            backgroundColor: this.props.theme['color-basic-700']
                        }]}
                        placeholder={i18n.t('services.add.manual.info.secret_placeholder')}
                        status='basic'
                        ref={(input) => { this.secretInput = input; }}
                        size='large'
                        autoCapitalize='none'
                        onChangeText={this._onSecretInput}
                        onSubmitEditing={this.onSubmit}
                        maxLength={AppConstants.MAX_SECRET_LENGTH}
                        icon={() => SecretIcon(this.props.theme['color-basic-400'])}
                        returnKeyType='done' />

                    <Button
                        style={styles.submitButton}
                        appearance='outline'
                        onPress={this.onSubmit}>
                        {i18n.t('services.add.manual.info.button')}</Button>
                </View>
            );
        }
    }

    render() {
        return (
            <Layout style={[styles.container, {backgroundColor: this.props.theme['color-basic-800']}]} level='2'>
                <TopNavigation
                    alignment='center'
                    title={i18n.t('services.add.title')}
                    rightControls={[]}
                    leftControl={this.renderBack()} />
                <ScrollView style={styles.formWrapper}>
                    <Image
                        style={styles.icon}
                        source={this.state.issuer.icon}
                    />
                    <Text style={styles.text}>
                        {i18n.t('services.add.manual.info.text', {name: this.state.issuer.name})}
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
        borderRadius: 5,
        marginBottom: 10
    },
    text: {
        textAlign: 'left',
        marginBottom: 20
    },
    accountInputLabel: {
        fontSize: 14,
        marginBottom: 6
    },
    accountInput: {
        marginBottom: 20
    },
    secretInputLabel: {
        fontSize: 14,
        marginBottom: 6
    },
    secretInput: {
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

const AddManual_InfoScene = withStyles(_AddManual_InfoScene);
export { AddManual_InfoScene };