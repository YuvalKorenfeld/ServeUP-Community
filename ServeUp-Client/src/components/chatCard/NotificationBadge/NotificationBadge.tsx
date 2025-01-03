import React from 'react';
import { Badge } from 'react-native-elements';
import styles from './Styles';
type NotificationBadgeProps = {
    notificationNumber: number;
};

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ notificationNumber }) => {
    return notificationNumber === 0 ? (
        <></>
        ): (
        <Badge
            value={notificationNumber}
            status="primary"
            badgeStyle={styles.badge}
            textStyle={styles.text}
        />
    );
};

export default NotificationBadge;
