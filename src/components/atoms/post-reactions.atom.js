import React from 'react';
import { default as customTheme } from '../../styles/theme.json';
import { Text } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import { apiPostReact, apiPostUnreact } from '../../services/reaction.service';
import { Image, StyleSheet, View, PanResponder, Animated } from 'react-native';

const MARGIN_X = 5;
const DEFAULT_REACTION = 1;
const IMGS_FOLDER = '../../assets/images/reactions/';

const reactions = [
    {id: 1, static: require(IMGS_FOLDER + 'harold-square.png'), animated: require(IMGS_FOLDER + 'harold-large.png')},
    {id: 2, static: require(IMGS_FOLDER + 'sideeye-large.png'), animated: require(IMGS_FOLDER + 'sideeye-large.png')},
    {id: 3, static: require(IMGS_FOLDER + 'haha.gif'), animated: require(IMGS_FOLDER + 'haha.gif')}
];

const reactions_map = {"1": reactions[0], "2": reactions[1], "3": reactions[2]};

const HeartIcon = () => (
    <Feather color={customTheme['color-basic-300']} name="heart" size={20}/>
);

class PostReactionsAtom extends React.Component {
    constructor(props) {
        super(props);

        // Determine current reaction
        let current_reaction = null;
        if(this.props.post.current_reaction.length > 0) {
            current_reaction = this.props.post.current_reaction[0].type;
        }

        // Compute reactions state
        let reactions_stats = [];
        for(const id in this.props.post.reactions_stats) {
            reactions_stats.push({img: reactions_map[id], count: this.props.post.reactions_stats[id]});
        }

        this.state = {
            selected: '',
            current_reaction,
            reactions_stats,
            open: false
        }

        this.reac = null;
    }

    componentWillMount = () => {
        this._pressTimeout = null;
        this._isLongPress = false;
        this._imgLayouts = {};
        this._imageAnimations = {};
        this._hoveredImg = '';
        this._scaleAnimation = new Animated.Value(0);

        // Create animated positions for each reaction
        reactions.forEach((img) => {
          this._imageAnimations[img.id] = {
            position: new Animated.Value(55),
            scale: new Animated.Value(1)
          };
        })

        // Catch user gestures
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            // 1: on finger hold
            onPanResponderGrant: this.onOpen,

            // 2: on finger move
            onPanResponderMove: (evt, gestureState) => {
                // fetch hovered image
                const hoveredImg = this.getHoveredImg(Math.ceil(evt.nativeEvent.locationX));

                // If new hovered image
                if (this._hoveredImg !== hoveredImg) {
                    // If previous hovered --> do it small
                    if(this._hoveredImg) this.animateSmall(this._imageAnimations[this._hoveredImg]);

                    // If new hovered --> do it big
                    if(hoveredImg) this.animateBig(this._imageAnimations[hoveredImg]);

                    // Update hovered img
                    this._hoveredImg = hoveredImg;
                }
            },

            // 3: on finger released
            onPanResponderRelease: (evt, gestureState) => {
                if(this._hoveredImg) {
                    this.animateSmall(this._imageAnimations[this._hoveredImg], this.onClose);
                } else {
                    this.onClose();
                }
            }
        });
    }

    /**
     * On finger hold (pressed)
     */
    onOpen = () => {
        this._isLongPress = false;

        // If long press...
        this._pressTimeout = setTimeout(() => {
            clearTimeout(this._pressTimeout);
            this._isLongPress = true;

            // Block list scroll
            if(this.props.scrollBlocker) this.props.scrollBlocker(true);

            Animated.parallel([
                Animated.timing(this._scaleAnimation, {
                    duration: 100,
                    toValue: 1
                }),
                Animated.stagger(50, this.getImageAnimationArray(0))
            ]).start(() => this.setState({open: true}));
        }, 200);
    }

    /**
     * On img hovered --> enlarge it
     */
    animateBig = (imgAnimations) => {
        Animated.parallel([
            Animated.timing(imgAnimations.position, {
                duration: 150,
                toValue: -15
            }),
            Animated.timing(imgAnimations.scale, {
                duration: 150,
                toValue: 1.8
            })
        ]).start();
    }

    /**
     * On img unhovered --> shrink it
     */
    animateSmall = (imgAnimations, cb) => {
        Animated.parallel([
            Animated.timing(imgAnimations.position, {
                duration: 50,
                toValue: 0
            }),
            Animated.timing(imgAnimations.scale, {
                duration: 50,
                toValue: 1
            })
        ]).start(cb);
    }

    /**
     * Fetch hovered img
     */
    getHoveredImg = (x) => {
        return Object.keys(this._imgLayouts).find((key) => {
            return x >= this._imgLayouts[key].left - MARGIN_X && x <= this._imgLayouts[key].right + MARGIN_X;
        })
    }

    getImageAnimationArray = (toValue) => {
        return reactions.map((img) => {
            return Animated.timing(this._imageAnimations[img.id].position, {
                duration: 200,
                toValue: toValue
            })
        });
    }

    onClose = () => {
        clearTimeout(this._pressTimeout);

        if(this._isLongPress) {
            this.setState({open: false}, () => {
                Animated.stagger(100, [
                  Animated.parallel(this.getImageAnimationArray(55, 0).reverse() ),
                  Animated.timing(this._scaleAnimation, {
                    duration: 100,
                    toValue: 0
                  })
                ]).start(this.afterClose);
            });

            // Unlock list scrolling
            if(this.props.scrollBlocker) this.props.scrollBlocker(false);
        } else {
            this.update_current_reaction(this.state.current_reaction === null ? DEFAULT_REACTION : null);
        }
    }

    afterClose = () => {
        // Save current hovered reaction
        if(this._hoveredImg) this.update_current_reaction(this._hoveredImg);
        this._hoveredImg = '';
    }

    update_current_reaction = (type) => {
        // Do nothing if no change
        if(this.state.current_reaction == type) return;

        // Update
        const current_reaction_bkp = this.state.current_reaction;
        const reactions_stats_bkp = this.state.reactions_stats;

        // Compute new reactions stats
        let new_reactions_stats = [];
        let is_new_reaction_added = false;
        for(let reaction of this.state.reactions_stats) {
            // Remove old reaction of stats
            if(current_reaction_bkp !== null && reaction.img.id == current_reaction_bkp) {
                reaction.count--;
            }

            // Add new reaction into stats
            if(type !== null && reaction.img.id == type) {
                is_new_reaction_added = true;
                reaction.count++;
            }

            // add to new reactions
            if(reaction.count > 0) new_reactions_stats.push(reaction);
        }

        // if reaction has count ==0 before (so not in array), add it
        if(type !== null && is_new_reaction_added === false) {
            new_reactions_stats.push({
                img: reactions_map[type],
                count: 1
            });
        }

        // Update/Render UI
        this.setState({current_reaction: type, reactions_stats: new_reactions_stats});

        let method;
        if(type === null) method = apiPostUnreact(this.props.post.id);
        else method = apiPostReact(this.props.post.id, type);
        
        // Execute request
        method.then((res) => {
            // OK
        }).catch((error) => {
            this.setState({
                current_reaction: current_reaction_bkp,
                reactions_stats: reactions_stats_bkp
            }); // rollback
            console.error(error);
        });
    }

    handleLayoutPosition = (img, position) => {
        this._imgLayouts[img] = {
          left: position.nativeEvent.layout.x,
          right: position.nativeEvent.layout.x + position.nativeEvent.layout.width
        }
    }

    getImages = () => {
        return reactions.map((img) => {
          return (
            <Animated.Image 
                onLayout={this.handleLayoutPosition.bind(this, img.id)}
                key={img.id} 
                source={img.animated} 
                style={[
                    styles.img,
                    {
                        transform: [
                            {scale: this._imageAnimations[img.id].scale},
                            {translateY: this._imageAnimations[img.id].position}
                        ]
                    }
                ]} 
            />
          );
        })
    }

    getLikeContainerStyle = () => {
        return {
            transform: [{scaleY: this._scaleAnimation}],
            overflow: this.state.open ? 'visible': 'hidden',
        };
    }

    renderCurrentReaction = () => {
        let img_source = require(IMGS_FOLDER + 'none.png');

        // Fetch reaction static img uri
        if(this.state.current_reaction) {
            for(const reac of reactions) {
                if(reac.id == this.state.current_reaction) {
                    img_source = reac.static;
                    break;
                }
            }
        }

        // use key to force img reload on reaction changed
        return (<Image source={img_source}
                       key={`reac-${this.state.current_reaction}`}
                       style={styles.currentReactionImg}/>);
    }

    renderReactionsStats = () => {
        if(this.state.reactions_stats.length === 0) return;

        // Sort highest count first
        let reactions_stats = this.state.reactions_stats.sort((a, b) => b.count - a.count);

        // Render reactions
        let render = [];
        let left = 0;
        let total_count = 0;
        for (const reaction of reactions_stats) {
            render.push(<Image source={reaction.img.static}
                key={`reac-${reaction.img.id}`}
                style={[styles.reactionStatImg, {left, zIndex: 1000 - left}]}/>);
            total_count += reaction.count;
            left += 15;
        }

        return (
            <View style={styles.reactionsStats}>
                {render}
                <Text style={[styles.reactionsCount, {left: left+25}]}>{total_count}</Text>
            </View>
        );
    }

    render = () => {
        return (
            <View style={styles.container}>
                <View style={styles.currentReactionContainer} {...this._panResponder.panHandlers}>
                    {/* Reactions Box */}
                    <Animated.View style={[styles.likeContainer, this.getLikeContainerStyle()]}>
                        <View style={styles.imgContainer}>
                            {this.getImages()}
                        </View>
                    </Animated.View>

                    {/* Button */}
                    {this.renderCurrentReaction()}
                </View>

                {this.renderReactionsStats()}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    currentReactionContainer: {
        flex: 1,
        paddingLeft: 10,
        marginTop: -8
    },
    likeContainer: {
      position: 'absolute',
      left: 10,
      top: -70,
      padding: 5,
      flex: 1,
      backgroundColor: '#FFF',
      borderColor: 'transparent',
      borderWidth: 0,
      borderRadius: 30,
    },
    reactionsStats: {
        flex: 1,
        flexDirection: 'row',
        marginTop: -30
    },
    imgContainer: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
    },
    img: {
      marginHorizontal: MARGIN_X,
      width: 36,
      height: 36,
      overflow: 'visible'
    },
    currentReactionImg: {
        width: 36,
        height: 36,
        marginTop: 8
    },
    reactionsCount: {
        zIndex: 1200,
        position: 'absolute',
        color: customTheme['color-basic-300']
    },
    reactionStatImg: {
        width: 32,
        height: 32,
        position: 'absolute'
    }
  });

export { PostReactionsAtom };