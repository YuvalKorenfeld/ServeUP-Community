// SendIcon.tsx
import React from 'react';
import { Svg, Path, Circle } from 'react-native-svg';

interface SendIconProps {
    enabled?: boolean;
}

const SendIcon: React.FC<SendIconProps> = ({ enabled }) => {
  return (
<Svg width="56" height="56" viewBox="0 0 56 56" fill="none">
<Circle cx="28" cy="28" r="28" fill={enabled?"#EBFFA4":"#D5FF45"}/>
<Path d="M38 18L27 29" stroke="black" stroke-width="1.99832" stroke-linecap="round" stroke-linejoin="round"/>
<Path d="M38 18L31 38L27 29L18 25L38 18Z" stroke="black" stroke-width="1.99832" stroke-linecap="round" stroke-linejoin="round"/>
</Svg>

  );
};

export default SendIcon;