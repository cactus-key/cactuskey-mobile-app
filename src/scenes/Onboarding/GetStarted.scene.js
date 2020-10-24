import React from 'react';
import i18n from "../../../i18n";
import { StyleSheet, Text } from 'react-native';
import { Layout, Button } from '@ui-kitten/components';
import { withStyles } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { AppRoute } from '../../navigations/app.routes';
import { OnboardingStep } from '../../models/OnboardingStep';

// import PaperOnboarding from 'react-native-paper-onboarding';
// import Screen1 from '../../components/onboarding-swiper/screen1';
// import Screen2 from '../../components/onboarding-swiper/screen2';
// import PaperOnboarding, {PaperOnboardingItemType} from "@gorhom/paper-onboarding";
// const data = [
//     {
//       title: 'Hotels',
//       description: 'All hotels and hostels are sorted by hospitality rating',
//       backgroundColor: '#698FB8',
//     //   image: /* IMAGE COMPONENT */,
//     //   icon: /* ICON COMPONENT */,
//       content: <Text>xx</Text>,
//     },
//     {
//       title: 'Banks',
//       description: 'We carefully verify all banks before add them into the app',
//       backgroundColor: '#6CB2B8',
//     //   image: /* IMAGE COMPONENT */,
//     //   icon: /* ICON COMPONENT */,
//       content: <Text>xx</Text>,
//     },
//     // {
//     //   title: 'Stores',
//     //   description: 'All local stores are categorized for your convenience',
//     //   backgroundColor: '#9D8FBF',
//     //   image: /* IMAGE COMPONENT */,
//     //   icon: /* ICON COMPONENT */,
//     //   content: /* CUSTOM COMPONENT */,
//     // },
//   ];

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

        this.props.navigation.navigate(AppRoute.SERVICES_LIST);
    }

    render() {
        return (
            <Layout style={styles.container}>
                {/* <Text style={[styles.title, {color: this.props.theme['color-basic-300']}]}>
                    {i18n.t('onboarding.get_started.title')}
                </Text> */}

                

{/* <PaperOnboarding
      data={data}
      onCloseButtonPress={handleOnClosePress}
    /> */}

                <Button
                    style={styles.button}
                    status='primary'
                    size='large'
                    onPress={this._next}>{i18n.t('onboarding.get_started.button')}
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

const GetStartedScene = withStyles(connect(mapStateToProps)(_GetStartedScene));
export { GetStartedScene };