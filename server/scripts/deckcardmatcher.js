// Stored enhancements are JSON from deck import (["amber","draw"]) or a postgres array from
// choosing enhancements in game ({amber,draw}), so are read the same way deck loading reads them
function enhancementsKey(enhancements) {
    if (!enhancements) {
        return '';
    }

    const list = Array.isArray(enhancements)
        ? enhancements
        : enhancements
              .replace(/[[{}"\]]/g, '')
              .split(',')
              .filter((e) => e.length > 0);

    return [...list].sort().join(',');
}

function sameCard(row, card) {
    return (
        card.id === row.CardId &&
        card.count === row.Count &&
        enhancementsKey(card.enhancements) === enhancementsKey(row.Enhancements)
    );
}

function sameFlags(row, card) {
    return (
        (card.maverick || null) === (row.Maverick || null) &&
        (card.anomaly || null) === (row.Anomaly || null)
    );
}

// A card stored without a maverick/anomaly may still be one in Master Vault, as Master Vault
// may not have flagged it when the deck was first imported (e.g. anomalies printed without the
// anomaly border).
function missingFlags(row, card) {
    return !row.Maverick && !row.Anomaly && (!!card.maverick || !!card.anomaly);
}

/**
 * Pairs stored deck cards with the cards from Master Vault. Copies of a card that only differ by
 * house are interchangeable, so any pairing of them is right.
 * @returns {{ id: number, house: string, maverick?: string, anomaly?: string }[]} updates for the
 * stored rows, including any maverick/anomaly the stored row was missing
 */
function matchDeckCards(rows, cards) {
    const remaining = [...cards];
    const updates = [];

    // Pair exact matches first so a card missing its flag can't take another row's card
    const unmatched = [];
    for (const pass of [sameFlags, missingFlags]) {
        for (const row of pass === sameFlags ? rows : unmatched.splice(0)) {
            const index = remaining.findIndex((card) => sameCard(row, card) && pass(row, card));
            if (index < 0) {
                if (pass === sameFlags) {
                    unmatched.push(row);
                }

                continue;
            }

            const card = remaining[index];
            updates.push({
                id: row.Id,
                house: card.house,
                maverick: card.maverick || undefined,
                anomaly: card.anomaly || undefined
            });
            remaining.splice(index, 1);
        }
    }

    return updates;
}

module.exports = { enhancementsKey, matchDeckCards };
