function escapeRegex(regex) {
    return regex.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

function httpRequest(url) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? require('https') : require('http');
        const request = lib.get(url, response => {
            if(response.statusCode < 200 || response.statusCode > 299) {
                return reject(new Error('Failed to request, status code: ' + response.statusCode));
            }

            const body = [];

            response.on('data', chunk => {
                body.push(chunk);
            });

            response.on('end', () => {
                resolve(body.join(''));
            });
        });

        request.on('error', err => reject(err));
    });
}

function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(next);
    };
}

function detectBinary(state, path = '', results = []) {
    const allowedTypes = ['Array', 'Boolean', 'Date', 'Number', 'Object', 'String'];

    if(!state) {
        return results;
    }

    let type = state.constructor.name;

    if(!allowedTypes.includes(type)) {
        results.push({ path: path, type: type });
    }

    if(type === 'Object') {
        for(let key in state) {
            detectBinary(state[key], `${path}.${key}`, results);
        }
    } else if(type === 'Array') {
        for(let i = 0; i < state.length; ++i) {
            detectBinary(state[i], `${path}[${i}]`, results);
        }
    }

    return results;
}

module.exports = {
    detectBinary: detectBinary,
    escapeRegex: escapeRegex,
    httpRequest: httpRequest,
    wrapAsync: wrapAsync
};
