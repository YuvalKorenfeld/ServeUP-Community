import React, { ReactNode } from "react";
import { Modal, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import styles from "./Styles";

interface CustomModalProps {
  children: ReactNode;
  visible: boolean;
  dismiss: () => void;
  transparent: boolean;
  animationType: "slide" | "fade";
  innerViewStyles?: ViewStyle;
}
const CustomModal = ({
  children,
  visible,
  dismiss,
  transparent,
  animationType,
  innerViewStyles,
}: CustomModalProps) => {
  return (
    <Modal
      animationType={animationType}
      transparent={transparent}
      visible={visible}
      onRequestClose={dismiss}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(52, 52, 52, 0.4)",
          ...innerViewStyles,
        }}
      >
        <TouchableWithoutFeedback onPress={dismiss}>
          <View style={styles.overlayView} />
        </TouchableWithoutFeedback>
        {children}
      </View>
    </Modal>
  );
};
export default CustomModal;
