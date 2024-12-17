import axios from 'axios';

async function checkSession() {
    try {
        const response = await axios.get('/api/check-session/', {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.log('Session is not valid');
        throw error;
    }
}

export default checkSession;