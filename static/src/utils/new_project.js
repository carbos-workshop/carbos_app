/* eslint camelcase: 0 */

import axios from 'axios';

export function post_owner_name_and_city(name, city) {
    return axios.post('/api/owner-city', {
        name,
        city
    });
}
export function post_address_id(address_id) {
    return axios.post('/api/owner-address', {
        address_id,
    });
}
