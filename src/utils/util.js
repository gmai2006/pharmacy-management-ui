import axios from "axios";

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

export async function getMyIPSafe() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json', {
            timeout: 5000  // 5 second timeout
        });
        
        return response.data.ip;
        
    } catch (error) {
        if (error.response) {
            console.error('Server error:', error.response.status);
        } else if (error.request) {
            console.error('No response received');
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
        } else {
            console.error('Error:', error.message);
        }
        
        return 'error';
    }
}

// getMyIP().then(ip => console.log('Your IP:', ip));

export async function getIPDetails() {
    const response = await axios.get('http://ip-api.com/json', {
        timeout: 5000
    });
    
    return {
        ip: response.data.query,
        country: response.data.country,
        city: response.data.city,
        region: response.data.region,
        timezone: response.data.timezone,
        latitude: response.data.lat,
        longitude: response.data.lon,
        isp: response.data.isp
    };
}

// getIPDetails().then(info => {
//     console.log(`IP: ${info.ip}`);
//     console.log(`Location: ${info.city}, ${info.region}, ${info.country}`);
//     console.log(`Timezone: ${info.timezone}`);
// });
