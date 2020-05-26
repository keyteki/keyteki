/* eslint-env node */

import $ from 'jquery';
import 'jquery-validation';
import 'jquery-validation-unobtrusive';
import 'react-redux-toastr/src/styles/index.scss';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './styles/index.scss';

$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function (element) {
        $(element).closest('.form-group').removeClass('has-error');
    }
});

let index;

if (process.env.NODE_ENV === 'production') {
    index = require('./index.prod');
} else {
    index = require('./index.dev');
}

export default index;
