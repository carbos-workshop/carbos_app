/* eslint camelcase: 0 */

import axios from 'axios';

export function post_owner_name_and_city(owner_name, owner_city) {
    return axios.post('/api/owner-city', {
        owner_name,
        owner_city
    });
}
export function post_address_id(address_id) {
    return axios.post('/api/owner-address', {
        address_id,
    });
}
