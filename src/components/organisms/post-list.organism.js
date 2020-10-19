import React from 'react';
import { StyleSheet, RefreshControl, View, Button } from 'react-native';
import { List, Spinner, Text } from '@ui-kitten/components'
import Post from '../../components/organisms/post.organism';
import PostLoader from '../../components/organisms/post-loader.organism';

class PostList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            loading: true,
            refreshing: false,
            loadingMore: false,
            scrollEnabled: true
        }

        this.next_refresh_at = null;
        this.next_old_posts_loading_at = null;
    }

    scrollBlocker = (is_blocked) => {
        this.setState({scrollEnabled: !is_blocked});
    }

    componentDidMount() {
       // Load data
        this.props.posts().then((posts) => {
            this.setState({
                posts: posts,
                loading: false
            });
        });
    }

    // called when user refresh list to load latest posts
    onRefresh = () => {
        // Nothing if no onRefresh provided
        if(this.props.onRefresh === undefined) return;

        // Enable spinner
        this.setState({refreshing: true});

        // Nothing if next refresh allowed in x seconds
        if(this.next_refresh_at > new Date().getTime()) {
            const _this = this;
            return setTimeout(() => {
                _this.setState({refreshing: false});
            }, 200);
        }
        this.next_refresh_at = new Date().getTime() + 5*1000; //next in 5 seconds

        // Determine first post of the list
        let first_post = null;
        if(this.state.posts.length > 0) first_post = this.state.posts[0];

        // Provide first post to method
        const _this = this;
        this.props.onRefresh(first_post).then((new_posts) => {
            // Append posts at the beginning of the list
            _this.setState({
                posts: new_posts.concat(_this.state.posts),
                refreshing: false
            });
        }).catch((error) => {
            _this.setState({refreshing: false});
        });
    }

    onEndReached = () => {
        // Nothing if no onEndReached provided
        if(this.props.onEndReached === undefined) return;

        // Nothing if next refresh allowed in x seconds
        if(this.next_old_posts_loading_at > new Date().getTime()) return;
        this.next_old_posts_loading_at = new Date().getTime() + 5*1000; //next in 5 seconds

        // Enable spinner
        this.setState({loadingMore: true});

        // Determine last post of the list
        let last_post = null;
        if(this.state.posts.length > 0) last_post = this.state.posts[this.state.posts.length - 1];

        // Provide last post to method
        const _this = this;
        this.props.onEndReached(last_post).then((new_posts) => {
            // Append posts at the end of the list
            _this.setState({
                posts: _this.state.posts.concat(new_posts),
                loadingMore: false
            });
        }).catch((error) => {
            _this.setState({loadingMore: false});
        });
    }

    refreshControl() {
        if(this.props.onRefresh !== undefined) {
            return (<RefreshControl tintColor={'white'} refreshing={this.state.refreshing} onRefresh={this.onRefresh} />);
        }
    }

    renderLoader = () => {
        if(this.state.loading) {
            return (<PostLoader/>);
        }
    }

    renderNoPosts = () => {
        if(!this.state.loading && this.state.posts.length == 0) {
            return (
                <View style={styles.container}>
                    <Text appearance='hint'>No posts to display</Text>
                    <Button title="Refresh" onPress={this.onRefresh}/>
                </View>
            );
        }
    }

    renderList = () => {
        if(!this.state.loading) {
            return (<List style={styles.list}
                        contentContainerStyle={styles.item}
                        data={this.state.posts}
                        refreshControl={this.refreshControl()}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={1}
                        scrollEnabled={this.state.scrollEnabled}
                        renderItem={(info) => (
                            <Post navigation={this.props.navigation}
                                  post={info.item}
                                  scrollBlocker={this.scrollBlocker} />
                        )} />);
        }
    }

    renderLoadingMoreSpinner() {
        if(this.state.loadingMore) {
            return (<Spinner/>);
        }
    }

    render() {
        return (
            <View>
                {this.renderLoader()}
                {this.renderNoPosts()}
                {this.renderList()}
                {this.renderLoadingMoreSpinner()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        marginTop: 1,
        marginBottom: 50
    },
    item: {
        marginBottom: 20,
        lineHeight: 18
    },
    container: {
        alignItems: 'center',
        marginTop: 40
    }
});

export default PostList;