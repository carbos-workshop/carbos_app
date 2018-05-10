import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth';
import data from './data';
import theme from './theme';

const rootReducer = combineReducers({
    routing: routerReducer,
    /* your reducers */
    theme,
    auth,
    data,
});

export default rootReducer;
