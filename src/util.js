const getFormValues = (data) => {
    const jsonString = JSON.stringify(data, (key, value) => value === null ? undefined : value);
    return JSON.parse(jsonString);
}

export const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const result = date.toISOString().substring(0, 10);
        return result;
    };

export default getFormValues;