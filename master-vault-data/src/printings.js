const fs = require('fs');
const path = require('path');

const { Expansions, compareByRelease, getExpansion } = require('./expansions');
const { cardIdFromMasterVault, isGiganticArtHalf } = require('./cardId');

const PackDir = path.join(__dirname, '../packs');

/**
 * @typedef {object} Printing
 * @property {string} id keyteki card id
 * @property {number} expansion
 * @property {string} number
 * @property {string} house
 * @property {string} image Master Vault image url
 * @property {boolean} anomaly Whether this is an anomaly printing, whose house is set per deck
 * @property {any} [card] The card from the pack file
 */

function latestOf(printings) {
    return printings.reduce(
        (latest, printing) =>
            !latest || compareByRelease(latest.expansion, printing.expansion) < 0
                ? printing
                : latest,
        undefined
    );
}

/**
 * Looks up cards by where they were printed. Every printing in a supported pack is indexed by
 * expansion and card number, which identifies the card without relying on its title.
 */
class PrintingIndex {
    /**
     * @param {Printing[]} printings
     */
    constructor(printings) {
        /** @type {Map<string, Printing[]>} */
        this.byNumber = new Map();
        /** @type {Map<string, Printing[]>} */
        this.byId = new Map();

        for (const printing of printings) {
            const key = `${printing.expansion}#${printing.number}`;
            if (!this.byNumber.has(key)) {
                this.byNumber.set(key, []);
            }

            this.byNumber.get(key).push(printing);

            if (!this.byId.has(printing.id)) {
                this.byId.set(printing.id, []);
            }

            this.byId.get(printing.id).push(printing);
        }
    }

    /**
     * Builds the index from the pack files of supported expansions.
     */
    static fromPacks() {
        const printings = [];
        const seen = new Set();

        for (const expansion of Expansions.filter((e) => e.pack && e.supported)) {
            const pack = JSON.parse(fs.readFileSync(path.join(PackDir, expansion.pack), 'utf8'));
            for (const card of pack.cards) {
                // Anomaly printings are repeated in each pack that includes them
                const key = `${card.expansion}#${card.number}/${card.house}/${card.id}`;
                if (seen.has(key)) {
                    continue;
                }

                seen.add(key);
                printings.push({
                    id: card.id,
                    expansion: card.expansion,
                    number: card.number,
                    house: card.house,
                    image: card.image,
                    anomaly: !!getExpansion(card.expansion)?.anomalies,
                    card
                });
            }
        }

        return new PrintingIndex(printings);
    }

    /**
     * Finds the keyteki card id for a card from the Master Vault API, or undefined if the card's
     * printing isn't known (e.g. reprint sets that have no pack file).
     * @param {{ expansion: number, card_number: string, card_title: string, card_title_en?: string, card_type: string, card_text: string, power: any, rarity: string }} card
     * @returns {string | undefined}
     */
    resolveCardId(card) {
        const printings = this.byNumber.get(`${card.expansion}#${card.card_number}`);
        if (!printings) {
            return undefined;
        }

        const ids = [...new Set(printings.map((printing) => printing.id))];
        if (ids.length === 1) {
            return ids[0];
        }

        // Gigantic halves, or more than one card with the same number, are told apart by title
        const titleId = cardIdFromMasterVault(card) + (isGiganticArtHalf(card) ? '2' : '');

        return ids.includes(titleId) ? titleId : undefined;
    }

    /**
     * Whether a card is known.
     * @param {string} id
     */
    hasCard(id) {
        return this.byId.has(id);
    }

    /**
     * The most recently released printing of a card, whose rules text is used.
     * @param {string} id
     * @returns {Printing | undefined}
     */
    getLatestPrinting(id) {
        return latestOf(this.byId.get(id) || []);
    }

    /**
     * Whether a card needs a separate image for each house: cards printed in more than one
     * house, and anomalies that have since been printed in a normal set (the plain image is
     * then the anomaly art).
     * @param {string} id
     */
    hasHouseImages(id) {
        const printings = this.byId.get(id) || [];
        const normalPrintings = printings.filter((printing) => !printing.anomaly);
        const houses = new Set(normalPrintings.map((printing) => printing.house));

        return (
            houses.size > 1 ||
            (normalPrintings.length > 0 && normalPrintings.length < printings.length)
        );
    }

    /**
     * The image name for a card in a deck. Mavericks and anomalies use the plain image, as they
     * are drawn with their deck's house over the top.
     * @param {string} id
     * @param {string} house the house the card belongs to in the deck
     * @param {{ maverick?: boolean, anomaly?: boolean }} [options]
     * @returns {string}
     */
    getImageName(id, house, { maverick = false, anomaly = false } = {}) {
        if (maverick || anomaly || !this.hasHouseImages(id)) {
            return id;
        }

        return `${id}-${house}`;
    }

    /**
     * Every image a card needs, with the printing each should be taken from: the most recent
     * printing for each house image, and for the plain image the most recent anomaly printing
     * if there is one, otherwise the most recent printing.
     * @param {string} id
     * @returns {{ name: string, printing: Printing }[]}
     */
    getImages(id) {
        const printings = this.byId.get(id) || [];
        const anomalyPrintings = printings.filter((printing) => printing.anomaly);
        const images = [
            { name: id, printing: latestOf(anomalyPrintings.length ? anomalyPrintings : printings) }
        ];

        if (this.hasHouseImages(id)) {
            const houses = new Set(printings.filter((p) => !p.anomaly).map((p) => p.house));
            for (const house of houses) {
                images.push({
                    name: `${id}-${house}`,
                    printing: latestOf(printings.filter((p) => !p.anomaly && p.house === house))
                });
            }
        }

        return images.filter((image) => image.printing);
    }
}

module.exports = { PrintingIndex };
