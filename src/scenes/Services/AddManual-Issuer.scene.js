import React from 'react';
import I18n from "../../../i18n";
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Layout, TopNavigation, TopNavigationAction, Text } from '@ui-kitten/components';
import IssuersList from '../../components/issuers/issuers-list';
import { AppRoute } from '../../navigations/app.routes';

class _AddManual_IssuerScene extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    onIssuerSelected = (issuer) => {
        this.props.navigation.navigate(AppRoute.SERVICES_ADD_MANUAL_INFO, {
            reloadServicesList: this.props.route.params.reloadServicesList,
            issuer
        });
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
            <Layout style={styles.container} level='2'>
                <TopNavigation
                    alignment='center'
                    title={I18n.t('services.add.title')}
                    rightControls={[]}
                    leftControl={this.renderBack()} />
                <Text style={styles.text}>{I18n.t('services.add.manual.issuer.text')}</Text>
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
        marginVertical: 20,
        marginHorizontal: 40
    },
});

const mapStateToProps = (state) => {
    return {};
}
const AddManual_IssuerScene = connect(mapStateToProps)(_AddManual_IssuerScene);
export { AddManual_IssuerScene };