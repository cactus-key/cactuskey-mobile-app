import React from 'react';
import i18n from "../../../i18n";
import { StyleSheet, View, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Layout, TopNavigation, TopNavigationAction, Button, Input, Spinner } from '@ui-kitten/components';
import { withStyles } from '@ui-kitten/components';
import { ServiceStore } from '../../models/ServiceStore';
import { AppRoute } from '../../navigations/app.routes';
import { AppConstants } from '../../constants/app.constants';

const AccountIcon = (color) => (
    <Feather color={color} name="mail" size={22} style={{marginRight: 2}}/>
);

class _EditScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            service: this.props.route.params.service,
            should_display_spinner: false
        }

        this.is_processing = false;
        this.account = this.state.service.label;
    }

    _onAccountInput = (account) => {
        this.account = account;
    }

    onSubmit = async () => {
        if (this.is_processing) return;
        this.is_processing = true;
        this.setState({should_display_spinner: true});

        // Update and store service
        try {
            if (!this.account) throw new Error("missing_account");
            this.state.service.label = this.account;
            ServiceStore.getInstance().store(this.state.service).then(() => {
                setTimeout(() => {
                    this.props.route.params.reloadServicesList();
                    this.props.navigation.navigate(AppRoute.SERVICES_LIST);
                }, 400);
            })
        } catch (error) {
            this.setState({should_display_spinner: false});
            this.is_processing = false;

            if (error.message === 'missing_account')
                alert(i18n.t('services.edit.errors.missing_account'));
            else
                alert(i18n.t('services.edit.errors.unknown'));
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
                <ScrollView style={styles.formWrapper}>
                    <Input
                        label={i18n.t('services.edit.account')}
                        labelStyle={[styles.accountInputLabel, {
                            color: this.props.theme['color-basic-300'],
                        }]}
                        style={[styles.accountInput, {
                            backgroundColor: this.props.theme['color-basic-700'],
                        }]}
                        placeholder={this.state.service.label}
                        defaultValue={this.state.service.label}
                        status='basic'
                        ref={(input) => { this.accountInput = input; }}
                        size='large'
                        autoCapitalize='none'
                        maxLength={AppConstants.MAX_LABEL_LENGTH}
                        onChangeText={this._onAccountInput}
                        onSubmitEditing={this.onSubmit}
                        icon={() => AccountIcon(this.props.theme['color-basic-400'])}
                        returnKeyType='done' />

                    <Button
                        style={styles.submitButton}
                        appearance='outline'
                        onPress={this.onSubmit}>
                        {i18n.t('services.edit.button')}</Button>
                </ScrollView>
            );
        }
    }

    render() {
        return (
            <Layout style={[styles.container, {backgroundColor: this.props.theme['color-basic-800']}]} level='2'>
                <TopNavigation
                    alignment='center'
                    title={i18n.t('services.edit.title')}
                    rightControls={[]}
                    leftControl={this.renderBack()} />
                {this.renderSpinner()}
                {this.renderForm()}
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
    accountInputLabel: {
        fontSize: 14,
        marginBottom: 6
    },
    accountInput: {
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

const EditScene = withStyles(_EditScene);
export { EditScene };