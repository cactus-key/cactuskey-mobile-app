import React from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';

const animationDuration = Platform.select({
  android: 160,
  default: 250,
});

const showEvent = Platform.select({
  android: 'keyboardDidShow',
  default: 'keyboardWillShow',
});

const hideEvent = Platform.select({
  android: 'keyboardDidHide',
  default: 'keyboardWillHide',
});

const defaultProps = {
  offset: height => height - 50,
};

const translateY = new Animated.Value(0);

export const KeyboardAvoidingView = (props) => {

  const { style, offset, autoDismiss, ...viewProps } = { ...defaultProps, ...props };

  React.useEffect(() => {
    const showEventSubscription = Keyboard.addListener(
      showEvent,
      onKeyboardShow,
    );
    const hideEventSubscription = Keyboard.addListener(
      hideEvent,
      onKeyboardHide,
    );
    return () => {
      showEventSubscription.remove();
      hideEventSubscription.remove();
    };
  });

  const onKeyboardShow = (event) => {
    const offsetValue = -offset(event.endCoordinates.height);
    createTranslateAnimation({ offsetValue }).start();
  };

  const onKeyboardHide = (event) => {
    const offsetValue = 0;
    createTranslateAnimation({ offsetValue }).start();
  };

  const createTranslateAnimation = (params) => {
    return Animated.timing(translateY, {
      toValue: params.offsetValue,
      duration: animationDuration,
      easing: Easing.linear,
    });
  };

  const transformsStyle = {
    transform: [{ translateY }],
  };

  return (
    <TouchableWithoutFeedback
      disabled={!autoDismiss}
      onPress={Keyboard.dismiss}>
      <Animated.View
        style={[transformsStyle, style]}
        {...viewProps}
      />
    </TouchableWithoutFeedback>
  );
};