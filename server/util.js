function escapeRegex(regex) {
    return regex.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

function httpRequest(url, callback) {
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, response => {
        if(response.statusCode < 200 || response.statusCode > 299) {
            if(callback) { 
                callback(new Error('Failed to request, status code: ' + response.statusCode));

                return;
            }
        }

        const body = [];
        
        response.on('data', chunk => {
            body.push(chunk);
        });

        response.on('end', () => {
            if(callback) {
                callback(null, body.join(''));
            }
        });

        request.on('error', err => {
            if(callback) {
                callback(err);

                return;
            }
        });
    });
}

module.exports = {
    escapeRegex: escapeRegex,
    httpRequest: httpRequest
};
