import '@babel/polyfill';
import 'core-js/stable';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-validation-unobtrusive';
import 'react-toastify/dist/ReactToastify.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './styles/index.scss';

window.jQuery = $;
window.$ = $;

$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function (element) {
        $(element).closest('.form-group').removeClass('has-error');
    }
});

if (process.env.NODE_ENV === 'production') {
    require('./index.prod');
} else {
    require('./index.dev');
}
