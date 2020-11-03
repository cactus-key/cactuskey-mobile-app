import React from 'react';
import i18n from "../../../i18n";
import { StyleSheet, View } from 'react-native';
import { Layout, Button, Text, withStyles } from '@ui-kitten/components';
import { BugsnagService } from '../../services/bugsnag.service';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Svgs } from '../../constants/svgs.constants';
import { Feather } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import { AppRoute } from '../../navigations/app.routes';
import * as StoreReview from 'expo-store-review';

class _LoveScene extends React.Component {

    constructor(props) {
        super(props);
        this.logger = BugsnagService.sceneBreadcrumbLogger('Feedback/Love');

        this.state = {};
    }

    clickLater = () => {
        this.logger('Later click');
        this.props.navigation.navigate(AppRoute.SERVICES_LIST);
    }

    clickNext = () => {
        this.logger('Next click');
        StoreReview.requestReview();
    }

    render() {
        return (
            <Layout style={styles.container}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => this.props.navigation.goBack()}>
                    <Feather name="arrow-left" color='#CCC' size={24}/>
                </TouchableOpacity>
                
                <View style={styles.headerWrapper}>
                    <SvgXml xml={Svgs.fetch('fireworks')} width="250" height="250"/>
                    <Text style={styles.headerTitle}>{i18n.t('feedback.love.title')}</Text>
                    <Text style={styles.headerText}>{i18n.t('feedback.love.text')}</Text>
                </View>

                <View style={styles.buttonsWrapper}>
                    <Button
                        style={styles.button}
                        status='basic'
                        size='large'
                        onPress={this.clickNext}>{i18n.t('feedback.love.next_button')}
                    </Button>

                    <Button style={styles.button} appearance='ghost' status='basic' onPress={this.clickLater}>
                        {i18n.t('feedback.love.later_button')}
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
    closeBtn: {
        paddingTop: 20
    },
    headerWrapper: {
        alignItems: 'center'
    },
    headerTitle: {
        marginTop: '0%',
        fontSize: 20,
        fontFamily: 'Roboto_Medium',
        textAlign: 'center'
    },
    headerText: {
        marginTop: '10%',
        fontSize: 17,
        fontFamily: 'Roboto_Regular',
        textAlign: 'center'
    },
    buttonsWrapper: {
        marginTop: '20%',
        width: '100%',
        flex: 1,
        alignItems: 'center'
    },
    button: {
        width: '100%',
        marginBottom: '5%'
    }
});

const LoveScene = withStyles(_LoveScene);
export { LoveScene };