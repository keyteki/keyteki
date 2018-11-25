/* eslint-env node */

import $ from 'jquery';
import 'jquery-validation';
import 'jquery-validation-unobtrusive';
import 'react-redux-toastr/src/styles/index.scss';
import 'babel-polyfill';

$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function (element) {
        $(element).closest('.form-group').removeClass('has-error');
    }
});

if(process.env.NODE_ENV === 'production') {
    module.exports = require('./index.prod.jsx');
} else {
    module.exports = require('./index.dev.jsx');
}
