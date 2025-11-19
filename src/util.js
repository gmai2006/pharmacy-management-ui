export const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const result = date.toISOString().substring(0, 10);
    return result;
};

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
    if (!arr || arr.length === 0) return 'No Date';
    const [year, month, day, hour = 0, minute = 0, second = 0] = arr;
    const date = new Date(year, month - 1, day, hour, minute, second);
    console.log(date);
    return date.toDateString();
};
