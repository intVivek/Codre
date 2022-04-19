require('dotenv').config()
const baseUrl = process.env.REACT_APP_API_URL;
console.log(baseUrl)

export function login(body) {
    return callPost(baseUrl + '/login', body);
}

export function fetchHome() {
    return callPost(baseUrl + '/home', {});
}

export function createRoom(body) {
    console.log(body);
    return callPost(baseUrl + '/createRoom', body);
}

const callGet = (url) => {
    return fetch(url).then(handleres);
}

const callPost = (url, body) => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'include',
        headers: { "Content-Type": "application/json" }
    }).then(handleres);
}

const handleres = (res) => {
    console.log(res);
    if (res.ok) {
        return res.json();
    }
    else {
        if (res.status === 404) {
            return Promise.reject();
        } else {
            throw res.json();
        }
    }
}