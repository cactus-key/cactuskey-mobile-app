import React from 'react';
import I18n from "../../../i18n";
import { connect } from 'react-redux';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Layout, TopNavigation, TopNavigationAction, Button, Input, Spinner } from '@ui-kitten/components';
import { default as customTheme } from '../../styles/theme.json';
import { ServiceStore } from '../../models/ServiceStore';
import { AppRoute } from '../../navigations/app.routes';

const AccountIcon = () => (
    <Feather color={customTheme['color-basic-400']} name="mail" size={22} style={{marginRight: 2}}/>
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
                alert(I18n.t('services.edit.errors.missing_account'));
            else
                alert(I18n.t('services.edit.errors.unknown'));
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
                        label={I18n.t('services.edit.account')}
                        labelStyle={styles.accountInputLabel}
                        style={styles.accountInput}
                        placeholder={this.state.service.label}
                        defaultValue={this.state.service.label}
                        status='basic'
                        ref={(input) => { this.accountInput = input; }}
                        size='large'
                        autoCapitalize='none'
                        onChangeText={this._onAccountInput}
                        onSubmitEditing={this.onSubmit}
                        icon={AccountIcon}
                        returnKeyType='done' />

                    <Button
                        style={styles.submitButton}
                        appearance='outline'
                        onPress={this.onSubmit}>
                        {I18n.t('services.edit.button')}</Button>
                </ScrollView>
            );
        }
    }

    render() {
        return (
            <Layout style={styles.container} level='2'>
                <TopNavigation
                    alignment='center'
                    title={I18n.t('services.edit.title')}
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
        flex: 1,
    },
    formWrapper: {
        paddingTop: 20,
        paddingHorizontal: 20
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
    submitButton: {
        marginBottom: 240
    },
    spinner: {
        alignItems: 'center',
        marginTop: 30
    }
});

const mapStateToProps = (state) => {
    return {};
}
const EditScene = connect(mapStateToProps)(_EditScene);
export { EditScene };