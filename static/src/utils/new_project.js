/* eslint camelcase: 0 */

import axios from 'axios';

export function post_owner_name_and_zip(owner_name, owner_zip) {
    return axios.post('/api/owner-info', {
        owner_name,
        owner_zip
    });
}
export function post_address_id(address_id) {
    return axios.post('/api/owner-address', {
        address_id,
    });
}
