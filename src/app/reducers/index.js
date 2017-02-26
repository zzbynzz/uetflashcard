export default (state, action) => {
    switch (action.type) {
        case 'FACEBOOK_AUTH':
            return state;
        case 'GOOGLE_AUTH':
            return state - 1
        default:
            return false;
    }
}