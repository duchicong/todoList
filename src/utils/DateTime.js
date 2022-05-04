const currentDate = () => {
    const date = new Date();
    const mm = ('0' + (date.getMonth() + 1)).slice(-2);
    const dd = ('0' + date.getDate()).slice(-2);
    const yyyy = date.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
}

const convertDate = (str) => {
    if (!str) return;
    const date = new Date(str);
    const mm = ('0' + (date.getMonth() + 1)).slice(-2);
    const dd = ('0' + date.getDate()).slice(-2);
    const yyyy = date.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
}

export {
    currentDate,
    convertDate
}
