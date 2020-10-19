import React from 'react';
import { default as customTheme } from '../../styles/theme.json';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import { AppRoute } from '../../navigations/app.routes';
import { apiSavePost, apiUnsavePost } from '../../services/save.service';
import { PostReactionsAtom } from '../atoms/post-reactions.atom.js';
  
const MessageCircleIcon = () => (
    <Feather color={customTheme['color-basic-300']} name="message-circle" size={20} style={{marginRight: 0}}/>
);

const BookmarkIcon = (is_enabled) => (
    <Feather color={is_enabled ? customTheme['color-primary-400'] : customTheme['color-basic-300']} name="save" size={22}/>
);

class PostFooter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {post: this.props.post}
        
        if(this.props.shouldDisplayCommentsCounter === undefined) {
            this.shouldDisplayCommentsCounter = true;
        } else {
            this.shouldDisplayCommentsCounter = this.props.shouldDisplayCommentsCounter;
        }
    }

    openSinglePost = () => {
        this.props.navigation.navigate(AppRoute.SINGLEPOST, {postId: this.props.post.id});
    }

    toggleSave = () => {
        const method = (this.state.post.is_saved ? apiUnsavePost : apiSavePost);
        const is_saved_back = this.state.post.is_saved;
        this.setState({
            post: {...this.state.post, is_saved: !this.state.post.is_saved}
        });
        method(this.state.post.id).then((res) => {
            // OK
        })
        .catch((err) => {
            this.setState({
                post: {...this.state.post, is_saved: is_saved_back}
            });
            console.error(err);
        });
    }

    _renderCommentsCounter = () => {
        if(this.shouldDisplayCommentsCounter) {
            return (
                <View style={styles.subcontainer}>
                    <Button
                        style={[styles.iconBtn]}
                        appearance='ghost'
                        status='basic'
                        icon={MessageCircleIcon}
                        onPress={this.openSinglePost}>
                        {`${this.state.post.comments_count}`}
                    </Button>
                </View>
            );
        }
    }

    render() {
        return (
            <View style={[
                styles.container,
                {paddingLeft: this.shouldDisplayCommentsCounter ? '8%':'20%'}
            ]}>
                <PostReactionsAtom style={styles.subcontainer}
                                   post={this.state.post}
                                   scrollBlocker={this.props.scrollBlocker} />
                
                {this._renderCommentsCounter()}
                    {/* <Button
                        style={[styles.iconBtn]}
                        appearance='ghost'
                        status='basic'
                        icon={() => BookmarkIcon(this.state.post.is_saved)}
                        onPress={this.toggleSave}></Button> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: -10,
        marginHorizontal: -14,
        paddingHorizontal: '8%',
        paddingVertical: 14
    },
    subcontainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 15,
        minHeight: 48
    },
    iconBtn: {
        paddingHorizontal: 0
    }
});

export default PostFooter;