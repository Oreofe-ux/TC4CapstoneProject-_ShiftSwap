var httpClient = (function() {

    const apiBaseUrl = 'https://shiftswap-backend-4w40.onrender.com/api';
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('token')
    };

    async function get(url, headers = {}) {
        const response = await fetch(`${apiBaseUrl}${url}`, {
            method: 'GET',
            headers: { ...defaultHeaders, ...headers }
        });
        return handleResponse(response);
    }
    async function post(url, body = {}, headers = {}) {
        const response = await fetch(`${apiBaseUrl}${url}`, {
            method: 'POST',
            headers: { ...defaultHeaders, ...headers },
            body: JSON.stringify(body)
        });
        return handleResponse(response);
    }
    async function handleResponse(response) {
        const contentType = response.headers.get('content-type');
        let data;   
        if (contentType && contentType.indexOf('application/json') !== -1) {
            data = await response.json();
        } else {
            data = await response.text();
        }   
        if (!response.ok) {
            throw new Error(data.message || 'HTTP error ' + response.status);
        }
        return data;
    }
    return {
        get,
        post
    };

})();