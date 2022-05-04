const saveLocalStorage = (key, data) => {
    if (!data || !key) return;

    const dataStringify = JSON.stringify(data);
    localStorage.setItem(key, dataStringify);
}

const fetchLocalStorageByKey = (key) => {
    if (!key) return;
    const dataStringify =  localStorage.getItem(key);
    return JSON.parse(dataStringify);
}

export {
    saveLocalStorage,
    fetchLocalStorageByKey
}
