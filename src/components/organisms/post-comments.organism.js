import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spinner, Text, List } from '@ui-kitten/components';
import { apiGetComments, apiGetCommentsBefore } from '../../services/comment.service';
import PostComment from '../molecules/post-comment.molecule';

class PostComments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: this.props.post,
            comments: undefined,
            loading: true
        }

        this.is_all_comments_loaded = false;
        this.is_pending_loading = false;
    }

    componentDidMount = () => {
        apiGetComments(this.state.post.id).then((res) => {
            this.setState({
                comments: res.json,
                loading: false
            });
        }).catch((err) => console.error(err));
    }

    _deleteComment = (comment) => {
        // Remove comment of list
        if(comment) {
            this.setState({
                comments: this.state.comments.filter(c => c.id !== comment.id)
            });
        }
    }

    _loadMore = () => {
        // If no comments, do nothing
        if(this.state.comments.length === 0) return;

        // If all comments loaded, do nothing
        if(this.is_all_comments_loaded) return;

        // If already loading pending
        if(this.is_pending_loading) return;

        this.is_pending_loading = true;
        console.log("Loading more comments...");

        // Fetch last comment
        const last_comment = this.state.comments[this.state.comments.length - 1];

        // Load comments before last
        apiGetCommentsBefore(this.state.post.id, last_comment.id).then((res) => {
            this.is_pending_loading = false;
            
            if(res.json.length === 0) {
                this.is_all_comments_loaded = true;
                console.log("All comments loaded.");
            } else {
                // Add loaded comments at the end
                this.setState({
                    comments: [...this.state.comments, ...res.json]
                });

                console.log("More comments loaded.");
            }
        }).catch((err) => {
            this.is_pending_loading = false;
            console.error(err)
        });
    }

    _renderComments = () => {
        if(this.state.loading === false) {
            if(this.state.comments.length > 0) {
                return (
                    <List style={styles.commentsContainer}
                            data={this.state.comments}
                            onEndReached={this._loadMore}
                            onEndReachedThreshold={1}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false} // no scroll because already in scrollview
                            renderItem={(comment) => (
                                <PostComment navigation={this.props.navigation}
                                             comment={comment.item}
                                             post={this.state.post}
                                             onDelete={() => this._deleteComment(comment.item)}></PostComment>
                            )} />
                );
            } else {
                return (
                    <View style={styles.noCommentsContainer}>
                        <Text appearance='hint'>No comments</Text>
                    </View>
                );
            }
        } else {
            return (<View style={{alignItems: 'center', marginTop: 20}}><Spinner/></View>);
        }
    }

    render() {
        return (
            <View>{this._renderComments()}</View>
        );
    }
}

const styles = StyleSheet.create({
    commentsContainer: {
        marginTop: 10,
        marginBottom: 80
    },
    noCommentsContainer: {
        marginTop: 20,
        marginBottom: 80,
        paddingHorizontal: 30
    }
});

export default PostComments;