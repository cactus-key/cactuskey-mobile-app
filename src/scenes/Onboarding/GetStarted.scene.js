import React from 'react';
import i18n from "../../../i18n";
import { StyleSheet, View, Linking } from 'react-native';
import { Layout, Button } from '@ui-kitten/components';
import { withStyles, ViewPager } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { AppRoute } from '../../navigations/app.routes';
import { OnboardingStep } from '../../models/OnboardingStep';
import Slide from '../../components/onboarding/slide';
import { AppConstants } from '../../constants/app.constants';
import { BugsnagService } from '../../services/bugsnag.service';

class _GetStartedScene extends React.Component {

    constructor(props) {
        super(props);
        this.logger = BugsnagService.sceneBreadcrumbLogger('Onboarding/GetStarted');

        this.state = {
            slide_index: 0
        };

        if (this.props.onboarding_step !== OnboardingStep.NOT_STARTED)
            this._next();
    }

    _next = () => {
        this.logger('Next click');

        this.props.dispatch({
            type: "ONBOARDING_GET_STARTED"
        });

        this.props.navigation.navigate(AppRoute.SERVICES_LIST);
    }

    openWebsite = () => {
        this.logger('Open website');
        Linking.openURL(AppConstants.WEBSITE_URL);
    }

    render() {
        return (
            <Layout style={styles.container}>
                {/* <Text style={[styles.title, {color: this.props.theme['color-basic-300']}]}>
                    {i18n.t('onboarding.get_started.title')}
                </Text> */}

                <ViewPager
                    style={styles.slider}
                    selectedIndex={this.state.slide_index}
                    onSelect={index => this.setState({slide_index: index})}>
                    <Slide text={i18n.t('onboarding.get_started.slide1')} svg="security2" />
                </ViewPager>

                <View style={styles.buttonWrapper}>
                    <Button
                        style={styles.button}
                        status='primary'
                        size='large'
                        onPress={this._next}>{i18n.t('onboarding.get_started.next_button')}
                    </Button>

                    <Button style={styles.button} appearance='ghost' status='basic' onPress={this.openWebsite}>
                        {i18n.t('onboarding.get_started.website_button')}
                    </Button>
                </View>
            </Layout>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        paddingHorizontal: '10%'
    },
    slider: {
        height: '60%',
        marginTop: '10%'
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
});

const mapStateToProps = (state) => {
    return {
        onboarding_step: state.settings.onboarding_step
    };
}

const GetStartedScene = withStyles(connect(mapStateToProps)(_GetStartedScene));
export { GetStartedScene };