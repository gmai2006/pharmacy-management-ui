const getFormValues = (data) => {
    const jsonString = JSON.stringify(data, (key, value) => value === null ? undefined : value);
    return JSON.parse(jsonString);
}
export default getFormValues;