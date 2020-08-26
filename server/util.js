const request = require('request');
const { fabric } = require('fabric');

function httpRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        request(url, options, (err, res, body) => {
            if (err) {
                if (res) {
                    err.statusCode = res.statusCode;
                }

                return reject(err);
            }

            if (res.statusCode !== 200) {
                let err = new Error('Request failed');
                err.statusCode = res.statusCode;

                return reject(err);
            }

            resolve(body);
        });
    });
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

function isValidImage(base64Image) {
    let buffer = Buffer.from(base64Image, 'base64');

    return buffer.toString('hex', 0, 4) === '89504e47' || buffer.toString('hex', 0, 2) === 'ffd8';
}

function processImage(image, width, height, rotate = false) {
    return new Promise((resolve, reject) => {
        const canvas = new fabric.StaticCanvas();
        canvas.setDimensions({ width: width, height: height });
        fabric.Image.fromURL(
            'data:image/png;base64,' + image,
            (img) => {
                if (img.getElement() == null) {
                    reject('Error occured in fabric');
                } else {
                    img.scaleToWidth(width)
                        .scaleToHeight(height)
                        .set({
                            originX: 'center',
                            originY: 'center',
                            left: width / 2,
                            top: height / 2,
                            angle: rotate ? 90 : undefined
                        });

                    canvas.add(img);
                    canvas.renderAll();
                    let dataUrl = canvas.toDataURL();
                    let base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

                    setImmediate(() => resolve(base64Data));
                }
            },
            { crossOrigin: 'anonymous' }
        );
    });
}

module.exports = {
    detectBinary: detectBinary,
    httpRequest: httpRequest,
    wrapAsync: wrapAsync,
    isValidImage: isValidImage,
    processImage: processImage
};
