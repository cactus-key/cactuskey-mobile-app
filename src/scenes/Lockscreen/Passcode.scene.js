import React from 'react';
import i18n from "../../../i18n";
import { StyleSheet, Text, View } from 'react-native';
import { Layout, Button } from '@ui-kitten/components';
import { withStyles } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { BugsnagService } from '../../services/bugsnag.service';
import { LockscreenService } from '../../services/lockscreen.service';
import DigitsKeyboard from '../../components/digits-keyboard/keyboard';
import { showMessage } from "react-native-flash-message";

class _PasscodeScene extends React.Component {

    constructor(props) {
        super(props);
        this.logger = BugsnagService.sceneBreadcrumbLogger('Lockscreen/Passcode');

        this.state = {
            is_biometric_enabled: false
        }

        // Register isBiometricEnabled callback
        LockscreenService.getInstance().setBiometricEnabledCallback(
            is_biometric_enabled => this.setState({is_biometric_enabled})
        );
    }

    onForgotPressed = () => {
        alert('Forgot pressed');
    }

    onBiometricPressed = () => {
        LockscreenService.getInstance().unlockBiometric();
    }

    onSubmit = (passcode) => {
        this.logger('Submit');
        LockscreenService.getInstance().unlock(passcode).then((isSuccess) => {
            if (!isSuccess) {
                showMessage({
                    message: i18n.t('lockscreen.error.message'),
                    type: "danger",
                });
            }
        });
    }

    renderBiometric = () => {
        if (this.state.is_biometric_enabled) {
            return (<Text>B</Text>);
        }
    }

    render() {
        return (
            <Layout style={styles.container}>
                <View style={styles.textWrapper}>
                    <Text style={styles.title}>{i18n.t('lockscreen.title')}</Text>
                    <Text style={styles.hint}>{i18n.t('lockscreen.hint')}</Text>
                </View>
                <DigitsKeyboard
                    style={styles.keyboard}
                    digitsCount={4}
                    onSubmit={this.onSubmit}
                    onChildrenClick={this.onBiometricPressed} >
                        {this.renderBiometric()}
                </DigitsKeyboard>
            </Layout>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 10000,
        paddingTop: '10%'
    },
    textWrapper: {
        
    },
    title: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20
    },
    hint: {
        textAlign: 'center',
        color: 'white',
        paddingHorizontal: '15%',
        fontSize: 16,
        marginTop: '25%',
        marginBottom: '10%'
    },
    buttonWrapper: {
        width: '100%',
        flex: 1,
        alignItems: 'center'
    },
    button: {
        width: '100%',
        marginBottom: '10%'
    },
    passcode: {

    }
});

const mapStateToProps = (state) => {
    return {
        // onboarding_step: state.settings.onboarding_step
    };
}

const PasscodeScene = withStyles(connect(mapStateToProps)(_PasscodeScene));
export { PasscodeScene };