/*eslint no-console:0 */

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const CardService = require('../../services/CardService');
const ConfigService = require('../../services/ConfigService');

const LANGUAGE_MAP = {
    zhhans: 'zh-hans',
    zhhant: 'zh-hant'
};

class CardImport {
    constructor(dataSource, imageSource, imageDir, language, force, skipReplace) {
        this.dataSource = dataSource;
        this.imageSource = imageSource;
        this.imageDir = imageDir;
        this.language = language;
        this.force = force;
        this.skipReplace = skipReplace;
        this.buildHalfSize = imageSource.getHalfSizeBuilder();
        this.cardService = new CardService(new ConfigService());
    }

    async import() {
        try {
            await this.importCards();
        } catch (e) {
            console.log('Unable to fetch data', e);
        }

        this.cardService.shutdown();
    }

    async importCards() {
        let cards = await this.dataSource.getCards();

        cards = cards.sort((a, b) => a.expansion - b.expansion);

        if (!this.skipReplace) {
            console.log('Replacing cards');
            await this.cardService.replaceCards(cards);
        }

        console.info(cards.length + ' cards fetched');

        await this.fetchImages(cards);
    }

    async fetchImages(cards) {
        // Add cards that were once anomaly and now are printed in a set (or sets)
        let specialCards = {
            479: { 'dark-æmber-vault': true, 'it-s-coming': true, 'orb-of-wonder': true },
            496: { 'orb-of-wonder': true, valoocanth: true }
        };

        const gigantic = ['deusillus', 'ultra-gravitron', 'niffle-kong'];
        const skipMkdir = {};

        for (let card of cards) {
            for (let language of this.computeLanguages(card)) {
                let imageLangDir = this.computeImagesDir(skipMkdir, language);
                let imagePath = path.join(imageLangDir, card.id + '.png').replace('*', '_');
                let halfSizePath;

                let imageUrl = card.image
                    .replace('/en/', '/' + language + '/')
                    .replace('_en.', '_' + language + '.');

                if (specialCards[card.expansion] && specialCards[card.expansion][card.id]) {
                    imagePath = path.join(imageLangDir, `${card.id}-${card.house}.png`);
                }

                if (this.force || !fs.existsSync(imagePath)) {
                    await this.imageSource.fetchImage(card, imageUrl, imagePath);
                }

                halfSizePath = imagePath
                    .replace(`${path.sep}cards`, `${path.sep}halfSize`)
                    .replace('.png', '.jpg');
                if (!gigantic.some((x) => card.id.includes(x))) {
                    if (this.force || !fs.existsSync(halfSizePath)) {
                        if (this.buildHalfSize) {
                            await this.buildHalfSize(
                                card,
                                card.image,
                                halfSizePath,
                                language.replace('-', '')
                            );
                        }
                    }
                }
            }
        }

        for (const card of cards.filter((c) => gigantic.includes(c.id))) {
            for (let language of this.computeLanguages(card)) {
                let imageLangDir = this.computeImagesDir(skipMkdir, language);
                let imgPath = path.join(imageLangDir, card.id + '-complete.png');
                let halfSizePath = imgPath
                    .replace(`${path.sep}cards`, `${path.sep}halfSize`)
                    .replace('.png', '.jpg');
                if (this.force || !fs.existsSync(imgPath)) {
                    await this.imageSource.buildGigantics(card.id, language, imageLangDir, imgPath);
                }
                if (this.force || !fs.existsSync(halfSizePath)) {
                    let data = cards.find((x) => x.id === card.id);
                    if (this.buildHalfSize) {
                        await this.buildHalfSize(
                            { ...data, type: 'creature1' },
                            `file://${imgPath}`,
                            halfSizePath,
                            language.replace('-', '')
                        );
                    }
                }
            }
        }
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
            halfSizeImageDir = imageLangDir.replace(`${path.sep}cards`, `${path.sep}halfSize`);

            mkdirp(imageLangDir);
            mkdirp(halfSizeImageDir);
            skipMkdir[language] = imageLangDir;
        } else {
            imageLangDir = skipMkdir[language];
        }

        return imageLangDir;
    }
}

module.exports = CardImport;
