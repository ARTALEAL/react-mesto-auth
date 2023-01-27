export const BASE_URL = 'https://auth.nomoreparties.co';

const checkResponse = (response) => {
  return response.ok
    ? response.json()
    : Promise.reject(
        new Error(`Ошибка ${response.status}: ${response.statusText}`)
      );
};

export const register = (data) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => checkResponse(res));
};

export const authorize = (data) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => checkResponse(res));
};

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => checkResponse(res));
};

// export const register = (data) => {
//   return fetch(`${BASE_URL}/signup`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => console.log(err));
// };

// export const authorize = (data) => {
//   return fetch(`${BASE_URL}/signin`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       if (data.user) {
//         localStorage.setItem('jwt', data.jwt);
//       }
//       return data;
//     })
//     .catch((err) => console.log(err));
// };

// export const checkToken = (token) => {
//   return fetch(`${BASE_URL}/users/me`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => console.log(err));
// };
