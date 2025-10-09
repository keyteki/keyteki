/* eslint-env node */

import $ from 'jquery';
import 'jquery-validation';
import 'jquery-validation-unobtrusive';
import 'react-redux-toastr/src/styles/index.scss';
import './styles/tailwind.css';
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

// Vite-friendly dynamic import based on mode
if (import.meta && import.meta.env && import.meta.env.PROD) {
    import('./index.prod.jsx');
} else {
    import('./index.dev.jsx');
}

export {}; // prevent TS isolatedModules error
