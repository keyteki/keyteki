/**
 * Builds keyteki card ids from Master Vault card titles. This is the only place ids should be
 * derived from titles, so that the pack data and deck import always agree.
 */

/**
 * @param {string} title English card title
 * @returns {string}
 */
function cardIdFromTitle(title) {
    return title
        .normalize('NFC')
        .trim()
        .toLowerCase()
        .replace(/[,?.!"„“”]/g, '')
        .replace(/[ '’]/g, '-');
}

/**
 * Builds the id for a card returned by the Master Vault API. Evil twins share a title with the
 * card they're based on, so get a suffix. Gigantic halves are handled by the caller.
 * @param {{ card_title: string, card_title_en?: string, rarity: string }} card
 * @returns {string}
 */
function cardIdFromMasterVault(card) {
    const id = cardIdFromTitle(card.card_title_en || card.card_title);

    return card.rarity === 'Evil Twin' ? `${id}-evil-twin` : id;
}

/**
 * Whether a Master Vault card is the art half of a gigantic creature, whose id has a "2" suffix.
 * Master Vault has described these as "Creature2" (Mass Mutation), as a Rare creature with no
 * text or power (early More Mutation), and now as "Gigantic Creature Art".
 * @param {{ card_type: string, card_text: string, power: any, rarity: string }} card
 */
function isGiganticArtHalf(card) {
    return (
        card.card_type === 'Creature2' ||
        card.card_type === 'Gigantic Creature Art' ||
        (card.card_type === 'Creature' &&
            card.card_text === '' &&
            card.power === null &&
            card.rarity === 'Rare')
    );
}

module.exports = { cardIdFromTitle, cardIdFromMasterVault, isGiganticArtHalf };
