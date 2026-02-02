import '@babel/polyfill';
import 'core-js/stable';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-validation-unobtrusive';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import 'regenerator-runtime/runtime';
import './shims/jquery-global';
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
