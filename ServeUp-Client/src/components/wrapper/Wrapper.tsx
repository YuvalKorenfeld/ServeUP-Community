import React, { useState } from "react";
import { Dimensions, Platform, ScrollView, View } from "react-native";

const OS = Platform.OS;

const Wrapper = ({ children, style = {} }) => {
  const [childHeight, setChildHeight] = useState<any>(500);
  const [screenHeight, setScreenHight] = useState<any>(
    Dimensions.get("window").height - 200
  );

  const WrapperView = childHeight > screenHeight ? ScrollView : View;
  return (
    <WrapperView style={{ ...style }}>
      <View>{children}</View>
    </WrapperView>
  );
};
export default Wrapper;
