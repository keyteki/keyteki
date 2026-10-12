/*eslint no-console:0 */

const fs = require('fs');
const path = require('path');

const CardService = require('../../services/CardService');
const ConfigService = require('../../services/ConfigService');
const { PrintingIndex } = require('../../../master-vault-data/src/printings');

const LANGUAGE_MAP = {
    zhhans: 'zh-hans',
    zhhant: 'zh-hant'
};

// Records which Master Vault image each downloaded file came from, so files are replaced when
// a newer printing changes the image
const SourcesFile = 'sources.json';
// Downloads between saves of the sources file, so a run that is stopped part way doesn't repeat
// its downloads next time
const SourcesSaveInterval = 25;

/**
 * Identifies the artwork of a Master Vault image, regardless of language or which printing it was
 * uploaded for: "341_252_VXMWR7MR5CW9_en.png" and "479_166_VXMWR7MR5CW9_de.png" are the same art.
 */
function imageKey(url) {
    const fileName = path.basename(url);
    const match = fileName.match(/^[^_]+_[^_]+_(.+)_[a-z-]+\.png$/);

    return match ? match[1] : fileName;
}

class CardImport {
    constructor(dataSource, imageSource, imageDir, language, force, skipReplace) {
        this.dataSource = dataSource;
        this.imageSource = imageSource;
        this.imageDir = imageDir;
        this.language = language;
        this.force = force;
        this.skipReplace = skipReplace;
        this.buildHalfSize = imageSource.getHalfSizeBuilder();
        if (!skipReplace) {
            this.cardService = new CardService(new ConfigService());
        }
    }

    async import() {
        try {
            await this.importCards();
        } catch (e) {
            console.log('Unable to fetch data', e);
        }

        if (this.cardService) {
            this.cardService.shutdown();
        }
    }

    async importCards() {
        let cards = await this.dataSource.getCards();

        cards = cards.sort((a, b) => a.expansion - b.expansion);

        if (!this.skipReplace) {
            console.log('Replacing cards');
            await this.cardService.replaceCards(cards);
        }

        console.info(cards.length + ' cards fetched');

        if (this.imageSource.downloadsImages !== false) {
            await this.fetchImages(cards);
        }
    }

    /**
     * Downloads the images for the given cards. Each card has a plain image, and cards printed
     * in several houses also have one per house; each is taken from the latest printing.
     */
    async fetchImages(cards) {
        const printings = PrintingIndex.fromPacks();
        const sources = this.loadSources();
        const skipMkdir = {};
        const ids = [...new Set(cards.map((card) => card.id))].filter((id) =>
            printings.hasCard(id)
        );
        const isGigantic = (id) =>
            printings.hasCard(id + '2') || (id.endsWith('2') && printings.hasCard(id.slice(0, -1)));
        const updatedGigantics = new Set();
        let downloads = 0;

        for (const id of ids) {
            for (const { name, printing } of printings.getImages(id)) {
                for (const language of this.computeLanguages(printing.card)) {
                    const imageLangDir = this.computeImagesDir(skipMkdir, language);
                    const imagePath = path.join(imageLangDir, name.replace(/\*/g, '_') + '.png');
                    const imageUrl = printing.image
                        .replace('/en/', '/' + language + '/')
                        .replace('_en.', '_' + language + '.');
                    const sourceKey = path.relative(this.imageDir, imagePath).replace(/\\/g, '/');

                    let updated = false;
                    const legacyUrl = this.getLegacyImageUrl(id, name, printings);
                    if (this.needsDownload(imagePath, imageUrl, sources[sourceKey], legacyUrl)) {
                        if (await this.imageSource.fetchImage(printing.card, imageUrl, imagePath)) {
                            sources[sourceKey] = imageUrl;
                            updated = true;
                            if (++downloads % SourcesSaveInterval === 0) {
                                this.saveSources(sources);
                            }
                        }
                    } else if (!sources[sourceKey]) {
                        sources[sourceKey] = imageUrl;
                    }

                    if (isGigantic(id)) {
                        if (updated) {
                            updatedGigantics.add(id.replace(/2$/, ''));
                        }

                        continue;
                    }

                    const halfSizePath = this.getHalfSizePath(imagePath);
                    if (
                        this.buildHalfSize &&
                        (updated || this.force || !fs.existsSync(halfSizePath))
                    ) {
                        await this.buildHalfSize(
                            printing.card,
                            printing.card.image,
                            halfSizePath,
                            language.replace('-', '')
                        );
                    }
                }
            }
        }

        for (const id of ids.filter((id) => printings.hasCard(id + '2'))) {
            const card = printings.getLatestPrinting(id).card;
            for (const language of this.computeLanguages(card)) {
                const imageLangDir = this.computeImagesDir(skipMkdir, language);
                const imgPath = path.join(imageLangDir, id + '-complete.png');
                const halfSizePath = this.getHalfSizePath(imgPath);
                const rebuild = this.force || updatedGigantics.has(id);

                if (rebuild || !fs.existsSync(imgPath)) {
                    await this.imageSource.buildGigantics(id, language, imageLangDir, imgPath);
                }

                if (this.buildHalfSize && (rebuild || !fs.existsSync(halfSizePath))) {
                    await this.buildHalfSize(
                        { ...card, type: 'creature1' },
                        `file://${imgPath}`,
                        halfSizePath,
                        language.replace('-', '')
                    );
                }
            }
        }

        this.saveSources(sources);
    }

    /**
     * Whether an image should be (re)downloaded: it's missing, forced, or came from a different
     * printing. Files downloaded before sources were recorded came from the earliest printing.
     */
    needsDownload(imagePath, imageUrl, recordedUrl, legacyUrl) {
        if (this.force || !fs.existsSync(imagePath)) {
            return true;
        }

        const sourceUrl = recordedUrl || legacyUrl;

        return !!sourceUrl && imageKey(sourceUrl) !== imageKey(imageUrl);
    }

    /**
     * The image the previous version of fetchdata would have downloaded for a name: the plain
     * image or a house image from the card's earliest printing.
     */
    getLegacyImageUrl(id, name, printings) {
        const house = name === id ? undefined : name.substring(id.length + 1);
        const candidates = printings.byId
            .get(id)
            .filter((printing) => !house || printing.house === house)
            .sort((a, b) => a.expansion - b.expansion);

        return candidates[0] && candidates[0].image;
    }

    getHalfSizePath(imagePath) {
        return imagePath
            .replace(
                `${path.sep}cards${path.sep}`,
                `${path.sep}cards${path.sep}halfSize${path.sep}`
            )
            .replace('.png', '.jpg');
    }

    loadSources() {
        const sourcesPath = path.join(this.imageDir, SourcesFile);

        try {
            return JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
        } catch (err) {
            return {};
        }
    }

    saveSources(sources) {
        const sourcesPath = path.join(this.imageDir, SourcesFile);

        // Written to a temporary file first, so stopping part way through can't corrupt it
        fs.mkdirSync(this.imageDir, { recursive: true });
        fs.writeFileSync(
            sourcesPath + '.tmp',
            JSON.stringify(sources, Object.keys(sources).sort(), 4)
        );
        fs.renameSync(sourcesPath + '.tmp', sourcesPath);
    }

    computeLanguages(card) {
        let languages;
        if (this.language === 'all') {
            languages = card.locale ? Object.keys(card.locale) : ['en'];
        } else {
            languages = [this.language];
        }
        return languages.map((it) => LANGUAGE_MAP[it] ?? it);
    }

    computeImagesDir(skipMkdir, language) {
        let imageLangDir, halfSizeImageDir;
        if (!skipMkdir[language]) {
            if (language === 'en') {
                // Keep english images at the current folder
                imageLangDir = this.imageDir;
            } else {
                imageLangDir = path.join(this.imageDir, language.replace('-', ''));
            }
            halfSizeImageDir = imageLangDir.replace(
                `${path.sep}cards${path.sep}`,
                `${path.sep}cards${path.sep}halfSize${path.sep}`
            );

            fs.mkdirSync(imageLangDir, { recursive: true });
            fs.mkdirSync(halfSizeImageDir, { recursive: true });
            skipMkdir[language] = imageLangDir;
        } else {
            imageLangDir = skipMkdir[language];
        }

        return imageLangDir;
    }
}

module.exports = CardImport;
