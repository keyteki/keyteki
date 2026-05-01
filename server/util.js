function isPrivateIpv4(hostname) {
    if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
        return false;
    }

    const parts = hostname.split('.').map((part) => Number(part));
    if (parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
        return true;
    }

    const [a, b] = parts;

    return (
        a === 10 ||
        a === 127 ||
        (a === 169 && b === 254) ||
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && b === 168) ||
        a === 0
    );
}

function isLocalOrPrivateHost(hostname) {
    const normalized = String(hostname || '').toLowerCase();

    if (
        normalized === 'localhost' ||
        normalized === '::1' ||
        normalized === '[::1]' ||
        normalized.endsWith('.localhost')
    ) {
        return true;
    }

    return isPrivateIpv4(normalized);
}

function getValidatedRequestUrl(rawUrl, allowedHosts) {
    let parsed;
    try {
        parsed = new URL(rawUrl);
    } catch (err) {
        throw new Error('Invalid request url');
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error('Unsupported protocol');
    }

    const hostname = parsed.hostname.toLowerCase();
    if (isLocalOrPrivateHost(hostname)) {
        throw new Error('Blocked request host');
    }

    if (allowedHosts && allowedHosts.length > 0) {
        const normalizedAllowedHosts = allowedHosts.map((host) => String(host).toLowerCase());
        if (!normalizedAllowedHosts.includes(hostname)) {
            throw new Error('Request host not allowed');
        }
    }

    return parsed.toString();
}

async function httpRequest(url, options = {}) {
    const {
        method = 'GET',
        headers: inputHeaders = {},
        body,
        form,
        json = false,
        encoding,
        allowedHosts = []
    } = options;

    const headers = { ...inputHeaders };
    const requestUrl = getValidatedRequestUrl(url, allowedHosts);
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

    let response = await fetch(requestUrl, {
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
