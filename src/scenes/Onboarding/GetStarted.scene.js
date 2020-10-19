import React from 'react';
import I18n from "../../../i18n";
import { StyleSheet, Text } from 'react-native';
import { Layout, Button } from '@ui-kitten/components';
import { default as customTheme } from '../../styles/theme.json';
import { connect } from 'react-redux';
import { AppRoute } from '../../navigations/app.routes';
import { OnboardingStep } from '../../models/OnboardingStep';

class _GetStartedScene extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};

        if (this.props.onboarding_step !== OnboardingStep.NOT_STARTED)
            this._next();
    }

    _next = () => {
        this.props.dispatch({
            type: "ONBOARDING_GET_STARTED"
        });

        this.props.navigation.navigate(AppRoute.MAIN);
    }

    render() {
        return (
            <Layout style={styles.container}>
                <Text style={styles.title}>{I18n.t('onboarding.get_started.title')}</Text>

                <Button
                    style={styles.button}
                    status='primary'
                    size='large'
                    onPress={this._next}>{I18n.t('onboarding.get_started.button')}
                </Button>
            </Layout>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 12
    },
    title: {
        fontSize: 30,
        color: customTheme['color-basic-300'],
        textAlign: 'left',
        marginBottom: 20
    },
    button: {
        width: '100%',
        marginBottom: 25
    }
});

const mapStateToProps = (state) => {
    return {
        onboarding_step: state.settings.onboarding_step
    };
}

const GetStartedScene = connect(mapStateToProps)(_GetStartedScene);
export { GetStartedScene };
