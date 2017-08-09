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

            request.on('error', err => reject(err));
        });
    });
}

module.exports = {
    escapeRegex: escapeRegex,
    httpRequest: httpRequest
};
