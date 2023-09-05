require('dotenv').config()
const baseUrl = process.env.REACT_APP_API_URL;

export function login(body) {
    return callPost(baseUrl + '/login', body);
}

export function fetchHome() {
    return callPost(baseUrl + '/home', {});
}

export function createRoom(body) {
    return callPost(baseUrl + '/createRoom', body);
}

export function checkRoom(body) {
    return callPost(baseUrl + '/checkRoom', body);
}

export function logout() {
    return callPost(baseUrl + '/logout', {});
}

export  const isAuthenticated = async () => {
    return await callGet(baseUrl + '/auth', {});
}

const callPost = (url, body) => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'include',
        headers: { "Content-Type": "application/json" }
    }).then(handleres);
}

const callGet = async(url, ...params) => {
    return await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        ...params
    }).then(handleres);
}

const handleres = (res) => {
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