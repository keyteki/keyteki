async function httpRequest(url, options = {}) {
    const {
        method = 'GET',
        headers: inputHeaders = {},
        body,
        form,
        json = false,
        encoding
    } = options;

    const headers = { ...inputHeaders };
    let requestBody;

    if (form) {
        requestBody = new URLSearchParams(form).toString();
        if (!headers['Content-Type'] && !headers['content-type']) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
    } else if (body !== undefined) {
        if (json && typeof body === 'object' && !Buffer.isBuffer(body)) {
            requestBody = JSON.stringify(body);
            if (!headers['Content-Type'] && !headers['content-type']) {
                headers['Content-Type'] = 'application/json';
            }
        } else {
            requestBody = body;
        }
    }

    let response = await fetch(url, {
        method,
        headers,
        body: requestBody
    });

    if (response.status !== 200) {
        let error = new Error('Request failed');
        error.statusCode = response.status;
        throw error;
    }

    if (encoding === null) {
        return Buffer.from(await response.arrayBuffer());
    }

    if (json) {
        return response.json();
    }

    return response.text();
}

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((error) => {
            return next(error);
        });
    };
}

function detectBinary(state, path = '', results = []) {
    const allowedTypes = ['Array', 'Boolean', 'Date', 'Number', 'Object', 'String'];

    if (!state) {
        return results;
    }

    let type = state.constructor.name;

    if (!allowedTypes.includes(type)) {
        results.push({ path: path, type: type });
    }

    if (type === 'Object') {
        for (let key in state) {
            detectBinary(state[key], `${path}.${key}`, results);
        }
    } else if (type === 'Array') {
        for (let i = 0; i < state.length; ++i) {
            detectBinary(state[i], `${path}[${i}]`, results);
        }
    }

    return results;
}

module.exports = {
    detectBinary: detectBinary,
    httpRequest: httpRequest,
    wrapAsync: wrapAsync
};
