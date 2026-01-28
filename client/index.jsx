import '@babel/polyfill';
import './shims/jquery-global';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-validation-unobtrusive';
import 'react-redux-toastr/src/styles/index.scss';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './styles/index.scss';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function (element) {
        $(element).closest('.form-group').removeClass('has-error');
    }
});

if (import.meta.env.PROD) {
    import('./index.prod');
} else {
    import('./index.dev');
}
