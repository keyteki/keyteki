/*eslint no-console:0 */

class NoImageSource {
    get downloadsImages() {
        return false;
    }

    fetchImage() {
        // noop
    }

    getHalfSizeBuilder() {
        return null;
    }

    buildGigantics() {
        // noop
    }
}

module.exports = NoImageSource;
