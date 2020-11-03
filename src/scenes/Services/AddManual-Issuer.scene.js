import React from 'react';
import i18n from "../../../i18n";
import { connect } from 'react-redux';
import { StyleSheet, View, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { withStyles } from '@ui-kitten/components';
import { Layout, TopNavigation, TopNavigationAction, Text } from '@ui-kitten/components';
import IssuersList from '../../components/issuers/issuers-list';
import { AppRoute } from '../../navigations/app.routes';
import { BugsnagService } from '../../services/bugsnag.service';
import { AppConstants } from '../../constants/app.constants';

class _AddManual_IssuerScene extends React.Component {

    constructor(props) {
        super(props);
        this.logger = BugsnagService.sceneBreadcrumbLogger('Services/AddManual-Issuer');

        this.state = {}
    }

    onIssuerSelected = (issuer) => {
        this.logger(`Issuer selected: ${issuer.name}`);
        this.props.navigation.navigate(AppRoute.SERVICES_ADD_MANUAL_INFO, {
            reloadServicesList: this.props.route.params.reloadServicesList,
            issuer
        });
    }

    openSubmissionForm = () => {
        Linking.openURL(AppConstants.FORM_ISSUER_SUBMISSION_URL);
    }

    renderBack = () => (
        <TopNavigationAction
            icon={() => (<Feather name="arrow-left" color='#CCC' size={24}/>)}
            activeOpacity={0.5}
            onPress={() => this.props.navigation.goBack()}
        />
    );

    render() {
        return (
            <Layout style={[styles.container, {backgroundColor: this.props.theme['color-basic-800']}]} level='2'>
                <TopNavigation
                    alignment='center'
                    title={i18n.t('services.add.title')}
                    rightControls={[]}
                    leftControl={this.renderBack()} />
                <Text style={styles.text}>{i18n.t('services.add.manual.issuer.text')}</Text>
                <Text style={styles.hintText}
                        onPress={this.openSubmissionForm}>
                        {i18n.t('services.add.manual.issuer.submit_link')}
                </Text>
                <View style={styles.issuersListWrapper}>
                    <IssuersList onIssuerSelected={this.onIssuerSelected}/>
                </View>
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    issuersListWrapper: {
        flex: 1
    },
    text: {
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        // marginHorizontal: 40
    },
    hintText: {
        paddingBottom: 25,
        textAlign: 'center',
        color: '#BBEDAC'
    }
});

const mapStateToProps = (state) => {
    return {};
}
const AddManual_IssuerScene = withStyles(connect(mapStateToProps)(_AddManual_IssuerScene));
export { AddManual_IssuerScene };