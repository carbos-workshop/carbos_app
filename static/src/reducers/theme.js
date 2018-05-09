import { CHANGE_THEME } from '../constants';
import { createReducer } from '../utils/misc';

const initialState = {
    currentTheme: 'dark'
};

export default createReducer(initialState, {
    [CHANGE_THEME]: (state, payload) =>
        Object.assign({}, state, {
            currentTheme: payload.theme,
        }),
});
