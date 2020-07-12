import {notification} from 'antd';

const OpenNotificationWithIcon = (type, message, description) => {
    notification[type]({message, description});
};

export default OpenNotificationWithIcon;
