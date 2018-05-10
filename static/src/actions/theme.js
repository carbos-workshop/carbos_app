import { CHANGE_THEME } from '../constants/index';
// import { parseJSON } from '../utils/misc';
// import { data_about_user } from '../utils/http_functions';
// import { logoutAndRedirect } from './auth';

export function changeTheme(theme) {
    return {
        type: CHANGE_THEME,
        payload: {
            theme,
        },
    };
}
