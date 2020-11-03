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

class _FeedbackScene extends React.Component {

    constructor(props) {
        super(props);
        this.logger = BugsnagService.sceneBreadcrumbLogger('Feedback/Feedback');

        this.state = {};
    }

    loveClick = () => {
        this.logger('Love click');
        this.props.navigation.navigate(AppRoute.FEEDBACK_LOVE);
    }

    disappointedClick = () => {
        this.logger('Disappointed click');
        this.props.navigation.navigate(AppRoute.FEEDBACK_DISAPPOINTED);
    }

    render() {
        return (
            <Layout style={styles.container}>
                <TouchableOpacity style={styles.closeBtn} onPress={() => this.props.navigation.goBack()}>
                    <Feather name="x" color='#CCC' size={24}/>
                </TouchableOpacity>
                
                <View style={styles.headerWrapper}>
                    <SvgXml xml={Svgs.fetch('feedback')} width="200" height="200"/>
                    <Text style={styles.headerText}>{i18n.t('feedback.title')}</Text>
                </View>

                <View style={styles.buttonsWrapper}>
                    <Button
                        style={styles.button}
                        status='basic'
                        size='large'
                        onPress={this.loveClick}>
                            <Feather name="heart" color="red" size={18}/>
                            &nbsp;&nbsp;&nbsp;{i18n.t('feedback.love_button')}
                    </Button>

                    <Button
                        style={styles.button}
                        status='basic'
                        size='large'
                        onPress={this.disappointedClick}>
                            <Feather name="frown" color="#D19300" size={18}/>
                            &nbsp;&nbsp;&nbsp;{i18n.t('feedback.disappointed_button')}
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
    headerText: {
        marginTop: '15%',
        fontSize: 20,
        fontFamily: 'Roboto_Medium'
    },
    buttonsWrapper: {
        marginTop: '30%',
        width: '100%',
        flex: 1,
        alignItems: 'center'
    },
    button: {
        width: '100%',
        marginBottom: '10%'
    }
});

const FeedbackScene = withStyles(_FeedbackScene);
export { FeedbackScene };