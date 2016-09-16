/*global user*/
module.exports = {
    loggedInState: false,

    register: function() {
        this.loggedInState = true;
        this.onChange(true);
    },

    login: function() {
        this.loggedInState = true;
        this.onChange(true);
    },
    
    logout: function () {
        this.loggedInState = false;
        this.onChange(false);
    },

    loggedIn: function () {
        return user || this.loggedInState;
    },

    onChange: function () {}
};
