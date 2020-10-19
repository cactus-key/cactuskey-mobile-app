import React from 'react';
import { StyleSheet, Modal, View, BackHandler, Image } from 'react-native';
import { Text, Divider } from '@ui-kitten/components'
import { default as customTheme } from '../../styles/theme.json';
import { AppRoute } from '../../navigations/app.routes';
import PostHeader from '../../components/molecules/post-header.molecule';
import PostFooter from '../../components/molecules/post-footer.molecule';
import ImageViewer from 'react-native-image-zoom-viewer';
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

// We are using PureComponent to optimize lists
// Pure component is reloaded only when its content is updated
class Post extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_viewer_opened: false
        };
    }

    componentDidMount = () => {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    // Called when android user press 'back' hardware button
    handleBackPress = () => {
        if(this.state.is_viewer_opened) {
            this._closeViewer();
        }
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    openSinglePost = () => {
        this.props.navigation.navigate(AppRoute.SINGLEPOST, {postId: this.props.post.id});
    }

    openFullScreen = () => {
        this.setState({is_viewer_opened: true});
    }

    _renderText = () => {
        if(this.props.post.text) {
            return (
                <TouchableWithoutFeedback onPress={this.openSinglePost}>
                    <Text style={styles.text} appearance='hint' category='s1'>
                        {this.props.post.text}
                    </Text>
                </TouchableWithoutFeedback>
            );
        }
    }

    _closeViewer = () => {
        this.setState({ is_viewer_opened: false });
    }

    render() {
        return (
            <View style={styles.container}>
                {/* HEADER */}
                <PostHeader navigation={this.props.navigation} post={this.props.post} />
                <Divider/>

                {/* TEXT */}
                {this._renderText()}

                {/* Image Viewer */}
                <Modal visible={this.state.is_viewer_opened} transparent={true}>
                    <ImageViewer
                        saveToLocalByLongPress={false}
                        renderIndicator={() => {}}
                        enableSwipeDown={true}
                        onCancel={this._closeViewer}
                        swipeDownThreshold={50}
                        renderHeader={() => (
                            <View style={styles.imgViewerClose}>
                                <TouchableWithoutFeedback onPress={this._closeViewer}>
                                    <Feather name="x" color='#AAA' size={26}/>
                                </TouchableWithoutFeedback>
                            </View>
                            
                            
                        )}
                        imageUrls={[{ url: this.props.post.img_url }]}/>
                </Modal>

                {/* IMAGE */}
                <TouchableWithoutFeedback onPress={() => this.openFullScreen(this.props.post)}>
                    <Image style={styles.image}
                        source={{uri: this.props.post.img_url}}></Image>
                </TouchableWithoutFeedback>
                
                {/* FOOTER */}
                <Divider/>
                <PostFooter navigation={this.props.navigation}
                            post={this.props.post}
                            scrollBlocker={this.props.scrollBlocker}
                            shouldDisplayCommentsCounter={this.props.shouldDisplayCommentsCounter} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        backgroundColor: customTheme['color-basic-800']
    },
    text: {
        paddingHorizontal: 20,
        paddingVertical: 25,
        lineHeight: 18
    },
    image: {
        height: 300
    },
    imgViewerClose: {
        marginTop: 50,
        marginLeft: 20,
        marginBottom: -60,
        zIndex: 1000
    }
});

export default Post;