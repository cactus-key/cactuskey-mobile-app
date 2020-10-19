import React from 'react';
import i18n from 'i18n-js';
import { Button, Image, View, TextInput } from 'react-native';
import { Layout, Text, TopNavigation, TopNavigationAction, Spinner } from '@ui-kitten/components';
import { default as customTheme } from '../../styles/theme.json';
import { apiCreatePost } from '../../services/post.service';
import { ScrollView } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

class NewPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.text = '';
        this.state = {
            processing: false,
            result: null
        }
    }

    renderCancel = () => {
        if(!this.state.processing && this.state.result === null) {
            return (
                <Button title={i18n.t('common.cancel')}
                        color='white'
                        onPress={this.props.closeModal}></Button>
            );
        }
    }

    renderSubmit = () => {
        if(!this.state.processing && this.state.result === null) {
            return [(
                <TopNavigationAction
                icon={() => (<Feather name="send" color='#CCC' size={26}/>)}
                onPress={this.submit}
                />
            )];
        }
    }

    renderLoader = () => {
        if(this.state.processing && this.state.result === null) {
            return (
                <View style={{alignItems: 'center', marginTop: 60}}>
                    <Spinner size='giant'/>
                    <Text style={{marginTop: 30}}>{i18n.t('post.new.submit_loading_msg')}</Text>
                </View>
            );
        }
    }

    onTextUpdated = (text) => {
        this.text = text;
    }

    renderForm = () => {
        if(!this.state.processing && this.state.result === null) {
            return (
                <ScrollView>
                    <View style={{padding: 16, flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 3}}>
                            <Image source={{uri: this.props.img.uri}} style={{height: 110, width: 110}}/>
                        </View>
                        <View style={{flex: 4}}>
                        <TextInput
                            multiline
                            numberOfLines={4}
                            onChangeText={this.onTextUpdated}
                            editable
                            placeholder={i18n.t('post.new.write_a_text')}
                            placeholderTextColor={customTheme['color-basic-300']}
                            style={{height: 110, color: customTheme['color-basic-100']}}
                            maxLength={255}
                            />
                        </View>
                    </View>
                </ScrollView>
            );
        }
    }

    renderResult = () => {
        if(this.state.result === 'success') {
            return (
                <View style={{alignItems: 'center', marginTop: 60}}>
                    <Feather name="check-circle" color='#11EA15' size={26}/>
                    <Text style={{marginTop: 30, marginBottom: 40}} category='h5'>{i18n.t('post.new.success_msg')}</Text>
                    <Button title={i18n.t('common.close')} onPress={this.props.closeModal}></Button>
                </View>
            );
        } else if(this.state.result === 'error') {
            return (
                <View style={{alignItems: 'center', marginTop: 60}}>
                    <Feather name="x-circle" color='red' size={26}/>
                    <Text style={{marginTop: 30, marginBottom: 40}} category='h5'>{i18n.t('post.new.error_msg')}</Text>
                    <Button title={i18n.t('common.close')} onPress={this.props.closeModal}></Button>
                </View>
            );
        }
    }

    submit = () => {
        console.log('Submitting post...');
        this.setState({processing: true});

        apiCreatePost(this.props.img, this.text).then((res) => {
            this.setState({result: 'success'});
        }).catch((error) => {
            console.error(error);
            return this.setState({result: 'error'});
        });
    }

    render() {
        return (
            <Layout style={{flex: 1}} level='2'>
                <TopNavigation
                    style={{marginBotton: 1, paddingTop: 20}}
                    alignment='center'
                    title={i18n.t('post.new.new_post')}
                    leftControl={this.renderCancel()}
                    rightControls={this.renderSubmit()}
                    />
                
                {this.renderForm()}
                {this.renderLoader()}
                {this.renderResult()}
            </Layout>
        );
    }
}

export { NewPostModal };