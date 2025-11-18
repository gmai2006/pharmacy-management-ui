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

export const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const convertJavaLocalDateTimeToDate = (arr) => {
    return new Date(
        javaLocalDateTime[0],
        javaLocalDateTime[1] - 1, // JavaScript months are 0-indexed
        javaLocalDateTime[2],
        javaLocalDateTime[3],
        javaLocalDateTime[4],
        javaLocalDateTime[5],
        javaLocalDateTime[6] / 1000000 // Convert nanoseconds to milliseconds
    );
};
