/* eslint-env node */

import 'react-redux-toastr/src/styles/index.scss';

if(process.env.NODE_ENV === 'production') {
    module.exports = require('./index.prod.jsx');
} else {
    module.exports = require('./index.dev.jsx');
}
