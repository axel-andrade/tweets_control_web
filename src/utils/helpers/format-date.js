const formatDate = date => {
    const day = date.getDate().toString();
    const dayFormatted = (day.length === 1) ? '0' + day : day;
    const month = (date.getMonth() + 1).toString();
    const monthFormatted = (month.length === 1) ? '0' + month : month;
    const yearFormatted = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${dayFormatted}/${monthFormatted}/${yearFormatted} ${hour}:${minute}`;
}

export { formatDate }
