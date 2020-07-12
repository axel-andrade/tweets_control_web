import {notification} from 'antd';

notification.config({
    duration: 1.5
});

const OpenNotificationWithIcon = (type, message, description) => {
    notification[type]({message, description});
};

export default OpenNotificationWithIcon;
