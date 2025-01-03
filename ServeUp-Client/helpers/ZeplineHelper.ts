import { Dimensions } from "react-native";

const dimension = Dimensions.get("window");

export const percentage = {
  getWidth(x: number) {
    x = x / 100;
    return Math.floor(x * dimension.width);
  },
  getHeight(y: number) {
    y = y / 100;
    return Math.floor(y * dimension.height);
  },
  getPrincipalWidth(y: number) {
    let m = Math.min(percentage.getHeight(56.6), this.getWidth(100));
    return Math.round((m * y) / 100);
  },
  getAndroidHeight() {},
};

export enum ZeplinConstraints {
  screenWidth = 375,
  screenHeight = 812,
}

const heightCache: any = {};
const widthCache: any = {};
function getKey(x: number, X?: number) {
  return x.toString() + X;
}
export const ZeplinHeight = (height: number, screenHeight?: number) => {
  const key = getKey(height, screenHeight);

  if (heightCache[key]) {
    return heightCache[key];
  } else {
    return (heightCache[key] = percentage.getHeight(
      (height / (screenHeight || ZeplinConstraints.screenHeight)) * 100
    ));
  }
};

export const ZeplinWidth = (width: number, screenWidth?: number) => {
  let key = getKey(width, screenWidth);
  if (widthCache[key]) {
    return widthCache[key];
  } else {
    return (widthCache[key] = percentage.getWidth(
      (width / (screenWidth || ZeplinConstraints.screenWidth)) * 100
    ));
  }
};

export function ZeplinUseConstraint(screenWidth: number, screenHeight: number) {
  return {
    ZeplinHeight: (height: number) => ZeplinHeight(height, screenHeight),
    ZeplinWidth: (width: number) => ZeplinWidth(width, screenWidth),
  };
}

export class SafeAreaInsets {
  static top: number = 0;
  static bottom: number = 0;
}
