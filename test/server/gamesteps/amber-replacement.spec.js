/*
 * Amber Replacement Effect Paths
 * ===============================
 * When a creature reaps, the "gain 1 amber" can be replaced by a chain of
 * effects. The active player chooses order when multiple replacements apply
 * at the same level (this only matters for Ether Spider and Staff Up).
 *
 * Conceptually, a reap starts as an operation with these properties:
 *   [Op Type] [Quantity] [Source] [Destination]
 *
 * Each replacement effect modifies one or more properties in sequence.
 * Once all replacements are applied, the final operation executes.
 * For example:
 *
 *   Unmodified Reap:     gain 1 amber from the common supply to player's pool
 *   + Fading Apparition: take 1 amber from a friendly creature to player's pool
 *   + Dimension Door:    steal 1 amber from opponent's pool to player's pool
 *   + Ether Spider:      capture 1 amber from opponent's pool onto Ether Spider
 *
 * Relevant FAQs:
 * - [Dimension Door and Sir Marrows](https://www.archonarcana.com/wiki/Dimension_Door)
 * - [Gargantodon and Discombobulator](https://www.archonarcana.com/wiki/Gargantodon)
 * - [Po's Pixies and Nerve Blast](https://www.archonarcana.com/wiki/Po%E2%80%99s_Pixies)
 *
 * The tests below cover each path in the diagram in order, where each
 * arrow (►) is a replacement. Book of Malefaction and Kretchee are included
 * in the tests as indicators for detecting whether steal or capture happened.
 *
 * TODO: multiple effects in place at the same time, eg ether spider & staff up, ether spider & gargantodon, staff up & gargantodon, ether spider & staff up & gargantodon
 *   Reap
 *   ├─► Dimension Door
 *   │   ├─► Ether Spider
 *   │   ├─► Gargantodon
 *   │   ├─► Po's Pixies
 *   │   │   ├─► Ether Spider
 *   │   │   ├─► Gargantodon
 *   │   │   └─► Staff Up
 *   │   ├─► Staff Up
 *   │   └─► The Vaultkeeper
 *   ├─► Ether Spider
 *   ├─► Fading Apparition
 *   │   ├─► Dimension Door
 *   │   │   ├─► Ether Spider
 *   │   │   ├─► Gargantodon
 *   │   │   ├─► Po's Pixies
 *   │   │   │   ├─► Ether Spider
 *   │   │   │   ├─► Gargantodon
 *   │   │   │   └─► Staff Up
 *   │   │   ├─► Staff Up
 *   │   │   └─► The Vaultkeeper
 *   │   ├─► Ether Spider
 *   │   ├─► Staff Up
 *   │   └─► Widespread Corruption
 *   │       └─► Po's Pixies
 *   ├─► Staff Up
 *   └─► Widespread Corruption
 *       └─► Po's Pixies
 */

describe('Amber Replacement Effects', function () {
    /**
     * Helpers that injects and sets up cards needed for the above tests
     */
    const cardDefs = {
        bookOfMalefaction: {
            name: 'Book of Malefaction',
            player: 'player2',
            location: 'play area'
        },
        dimensionDoor: { name: 'Dimension Door', player: 'player1', location: 'play action' },
        etherSpider: { name: 'Ether Spider', player: 'player2', location: 'play area' },
        fadingApparition: {
            name: 'Fading Apparition',
            player: 'player1',
            location: 'play area',
            exhausted: true,
            amber: 2
        },
        gargantodon: { name: 'Gargantodon', player: 'player2', location: 'play area' },
        kretchee: { name: 'Kretchee', player: 'player2', location: 'play area' },
        posPixiesFriendly: { name: 'Po’s Pixies', player: 'player1', location: 'play area' },
        posPixiesEnemy: { name: 'Po’s Pixies', player: 'player2', location: 'play area' },
        staffUp: { name: 'Staff Up', player: 'player1', location: 'play action' },
        theVaultkeeper: {
            name: 'The Vaultkeeper',
            player: 'player2',
            location: 'play area'
        },
        widespreadCorruption: {
            name: 'Widespread Corruption',
            player: 'player2',
            location: 'play area'
        }
    };

    function addCard(ctx, player, ref, location) {
        const def = cardDefs[ref];
        const name = def.name;
        const cmdLocation =
            location === 'play area' || location === 'play action' ? 'hand' : location;
        player.executeCommand(`/add-card ${cmdLocation} ${name}`);
        const card = player[cmdLocation].find((c) => c.name === name);
        ctx[ref] = card;
        player.makeMaverick(card, 'logos');
        if (location === 'play area') {
            player.putIntoPlay(card);
            card.exhausted = def.exhausted || false;
            card.amber = def.amber || 0;
        } else if (location === 'play action') {
            player.play(card);
        }
    }

    function setupCards(ctx, refs) {
        for (const ref of refs) {
            const def = cardDefs[ref];
            addCard(ctx, ctx[def.player], ref, def.location);
        }
    }

    beforeEach(function () {
        this.setupTest({
            player1: {
                amber: 0,
                house: 'logos',
                token: 'prospector',
                inPlay: ['infomorph']
            },
            player2: {
                amber: 3,
                inPlay: ['graphton']
            }
        });
    });

    it("Reap: gain 1 amber from the common supply to player's pool", function () {
        this.player1.reap(this.infomorph);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(1);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
    });

    it("Reap > Dimension Door: steal 1 amber from opponent's pool to player's pool", function () {
        setupCards(this, ['dimensionDoor', 'bookOfMalefaction']);
        this.player1.reap(this.infomorph);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(1);
        expect(this.player2.amber).toBe(2);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it("Reap > Dimension Door > Ether Spider: capture 1 amber from opponent's pool onto ether spider", function () {
        setupCards(this, ['dimensionDoor', 'etherSpider', 'bookOfMalefaction', 'kretchee']);
        this.player1.reap(this.infomorph);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(2);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.etherSpider.amber).toBe(2);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it("Reap > Dimension Door > Gargantodon: capture 1 amber from opponent's pool onto a creature controlled by the active player", function () {
        setupCards(this, ['dimensionDoor', 'gargantodon', 'bookOfMalefaction', 'kretchee']);
        this.player1.reap(this.infomorph);
        this.player1.clickCard(this.infomorph);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(2);
        expect(this.infomorph.amber).toBe(2);
        expect(this.graphton.amber).toBe(0);
        expect(this.gargantodon.amber).toBe(0);
        expect(this.kretchee.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(undefined);
    });

    it("Reap > Dimension Door > Po's Pixies: steal 1 amber from the common supply to player's pool", function () {
        setupCards(this, ['dimensionDoor', 'posPixiesEnemy', 'bookOfMalefaction']);
        this.player1.reap(this.infomorph);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(1);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.posPixiesEnemy.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it("Reap > Dimension Door > Po's Pixies > Ether Spider: capture 1 amber from the common supply onto ether spider", function () {
        setupCards(this, [
            'dimensionDoor',
            'posPixiesEnemy',
            'etherSpider',
            'bookOfMalefaction',
            'kretchee'
        ]);
        this.player1.reap(this.infomorph);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.posPixiesEnemy.amber).toBe(0);
        expect(this.etherSpider.amber).toBe(2);
        expect(this.kretchee.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it("Reap > Dimension Door > Po's Pixies > Gargantodon: capture 1 amber from the common supply onto a creature controlled by the active player", function () {
        setupCards(this, [
            'dimensionDoor',
            'posPixiesEnemy',
            'gargantodon',
            'bookOfMalefaction',
            'kretchee'
        ]);
        this.player1.reap(this.infomorph);
        this.player1.clickCard(this.infomorph);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(2);
        expect(this.graphton.amber).toBe(0);
        expect(this.posPixiesEnemy.amber).toBe(0);
        expect(this.gargantodon.amber).toBe(0);
        expect(this.kretchee.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(undefined);
    });

    it("Reap > Dimension Door > Po's Pixies > Staff Up: steal 1 amber from the common supply to the common supply (no change) and make a token creature", function () {
        setupCards(this, ['dimensionDoor', 'posPixiesEnemy', 'staffUp', 'bookOfMalefaction']);
        this.player1.reap(this.infomorph);
        this.player1.clickPrompt('Left');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.posPixiesEnemy.amber).toBe(0);
        expect(this.player1.player.creaturesInPlay[0].name).toBe('Prospector');
        expect(this.player1.player.creaturesInPlay[0].amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it("Reap > Dimension Door > Staff Up: steal 1 amber from opponent's pool to the common supply and make a token creature", function () {
        setupCards(this, ['dimensionDoor', 'staffUp', 'bookOfMalefaction']);
        this.player1.reap(this.infomorph);
        this.player1.clickPrompt('Left');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(2);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.player1.player.creaturesInPlay[0].name).toBe('Prospector');
        expect(this.player1.player.creaturesInPlay[0].amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it('Reap > Dimension Door > The Vaultkeeper: cannot steal', function () {
        setupCards(this, ['dimensionDoor', 'theVaultkeeper', 'bookOfMalefaction']);
        this.player1.reap(this.infomorph);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.theVaultkeeper.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(undefined);
    });

    it('Reap > Ether Spider: capture 1 amber from the common supply onto ether spider', function () {
        setupCards(this, ['etherSpider', 'kretchee']);
        this.player1.reap(this.infomorph);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.etherSpider.amber).toBe(2);
        expect(this.kretchee.amber).toBe(0);
    });

    it("Reap > Fading Apparition (from common supply): gain 1 amber from the common supply to player's pool", function () {
        setupCards(this, ['fadingApparition']);
        this.player1.reap(this.infomorph);
        this.player1.clickPrompt('Done');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(1);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
    });

    it("Reap > Fading Apparition (from friendly creature): take 1 amber from a friendly creature to player's pool", function () {
        setupCards(this, ['fadingApparition']);
        this.player1.reap(this.infomorph);
        expect(this.player1).toBeAbleToSelect(this.fadingApparition);
        this.player1.clickCard(this.fadingApparition);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(1);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(1);
    });

    it("Reap > Fading Apparition (from common supply) > Dimension Door: steal 1 amber from opponent's pool to player's pool", function () {
        setupCards(this, ['fadingApparition', 'dimensionDoor', 'bookOfMalefaction']);
        this.player1.reap(this.infomorph);
        // this.player1.clickPrompt('Done');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(1);
        expect(this.player2.amber).toBe(2);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it("Reap > Fading Apparition (from friendly creature) > Dimension Door: steal 1 amber from opponent's pool to player's pool", function () {
        setupCards(this, ['fadingApparition', 'dimensionDoor', 'bookOfMalefaction']);
        this.player1.reap(this.infomorph);
        // expect(this.player1).toBeAbleToSelect(this.fadingApparition);
        // this.player1.clickCard(this.fadingApparition);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(1);
        expect(this.player2.amber).toBe(2);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it("Reap > Fading Apparition (from common supply) > Dimension Door > Ether Spider: steal 1 amber from opponent's pool onto ether spider", function () {
        setupCards(this, [
            'fadingApparition',
            'dimensionDoor',
            'etherSpider',
            'bookOfMalefaction',
            'kretchee'
        ]);
        this.player1.reap(this.infomorph);
        // this.player1.clickPrompt('Done');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(2);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.etherSpider.amber).toBe(2);
        expect(this.kretchee.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it("Reap > Fading Apparition (from friendly creature) > Dimension Door > Ether Spider: steal 1 amber from opponent's pool onto ether spider", function () {
        setupCards(this, [
            'fadingApparition',
            'dimensionDoor',
            'etherSpider',
            'bookOfMalefaction',
            'kretchee'
        ]);
        this.player1.reap(this.infomorph);
        // expect(this.player1).toBeAbleToSelect(this.fadingApparition);
        // this.player1.clickCard(this.fadingApparition);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(2);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.etherSpider.amber).toBe(2);
        expect(this.kretchee.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it("Reap > Fading Apparition (from common supply) > Dimension Door > Gargantodon: capture 1 amber from opponent's pool onto player's creature", function () {
        setupCards(this, [
            'fadingApparition',
            'dimensionDoor',
            'gargantodon',
            'bookOfMalefaction',
            'kretchee'
        ]);
        this.player1.reap(this.infomorph);
        // this.player1.clickPrompt('Done');
        this.player1.clickCard(this.infomorph);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(2);
        expect(this.infomorph.amber).toBe(2);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.gargantodon.amber).toBe(0);
        expect(this.kretchee.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(undefined);
    });

    it("Reap > Fading Apparition (from friendly creature) > Dimension Door > Gargantodon: capture 1 amber from opponent's pool onto player's creature", function () {
        setupCards(this, [
            'fadingApparition',
            'dimensionDoor',
            'gargantodon',
            'bookOfMalefaction',
            'kretchee'
        ]);
        this.player1.reap(this.infomorph);
        // expect(this.player1).toBeAbleToSelect(this.fadingApparition);
        // this.player1.clickCard(this.fadingApparition);
        this.player1.clickCard(this.infomorph);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(2);
        expect.soft(this.infomorph.amber).toBe(2);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.gargantodon.amber).toBe(0);
        expect(this.kretchee.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(undefined);
    });

    it("Reap > Fading Apparition (from common supply) > Dimension Door > Po's Pixies: steal 1 amber from the common supply to player's pool", function () {
        setupCards(this, [
            'fadingApparition',
            'dimensionDoor',
            'posPixiesEnemy',
            'bookOfMalefaction'
        ]);
        this.player1.reap(this.infomorph);
        // this.player1.clickPrompt('Done');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(1);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.posPixiesEnemy.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it("Reap > Fading Apparition (from friendly creature) > Dimension Door > Po's Pixies: steal 1 amber from the common supply to player's pool", function () {
        setupCards(this, [
            'fadingApparition',
            'dimensionDoor',
            'posPixiesEnemy',
            'bookOfMalefaction'
        ]);
        this.player1.reap(this.infomorph);
        // expect(this.player1).toBeAbleToSelect(this.fadingApparition);
        // this.player1.clickCard(this.fadingApparition);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(1);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.posPixiesEnemy.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it("Reap > Fading Apparition (from common supply) > Dimension Door > Po's Pixies > Ether Spider: capture 1 amber from the common supply onto ether spider", function () {
        setupCards(this, [
            'fadingApparition',
            'dimensionDoor',
            'posPixiesEnemy',
            'etherSpider',
            'bookOfMalefaction',
            'kretchee'
        ]);
        this.player1.reap(this.infomorph);
        // this.player1.clickPrompt('Done');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.posPixiesEnemy.amber).toBe(0);
        expect(this.etherSpider.amber).toBe(2);
        expect(this.kretchee.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it("Reap > Fading Apparition (from friendly creature) > Dimension Door > Po's Pixies > Ether Spider: capture 1 amber from the common supply onto ether spider", function () {
        setupCards(this, [
            'fadingApparition',
            'dimensionDoor',
            'posPixiesEnemy',
            'etherSpider',
            'bookOfMalefaction',
            'kretchee'
        ]);
        this.player1.reap(this.infomorph);
        // expect(this.player1).toBeAbleToSelect(this.fadingApparition);
        // this.player1.clickCard(this.fadingApparition);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.posPixiesEnemy.amber).toBe(0);
        expect(this.etherSpider.amber).toBe(2);
        expect(this.kretchee.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it("Reap > Fading Apparition (from common supply) > Dimension Door > Po's Pixies > Gargantodon: capture 1 amber from the common supply onto player's creature", function () {
        setupCards(this, [
            'fadingApparition',
            'dimensionDoor',
            'posPixiesEnemy',
            'gargantodon',
            'bookOfMalefaction',
            'kretchee'
        ]);
        this.player1.reap(this.infomorph);
        // this.player1.clickPrompt('Done');
        this.player1.clickCard(this.infomorph);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(2);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.posPixiesEnemy.amber).toBe(0);
        expect(this.gargantodon.amber).toBe(0);
        expect(this.kretchee.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(undefined);
    });

    it("Reap > Fading Apparition (from friendly creature) > Dimension Door > Po's Pixies > Gargantodon: capture 1 amber from the common supply onto player's creature", function () {
        setupCards(this, [
            'fadingApparition',
            'dimensionDoor',
            'posPixiesEnemy',
            'gargantodon',
            'bookOfMalefaction',
            'kretchee'
        ]);
        this.player1.reap(this.infomorph);
        // expect(this.player1).toBeAbleToSelect(this.fadingApparition);
        // this.player1.clickCard(this.fadingApparition);
        this.player1.clickCard(this.infomorph);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(2);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.posPixiesEnemy.amber).toBe(0);
        expect(this.gargantodon.amber).toBe(0);
        expect(this.kretchee.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(undefined);
    });

    it("Reap > Fading Apparition (from common supply) > Dimension Door > Po's Pixies > Staff Up: steal 1 amber from the common supply to the common supply (no change) and make a token creature", function () {
        setupCards(this, [
            'fadingApparition',
            'dimensionDoor',
            'posPixiesEnemy',
            'staffUp',
            'bookOfMalefaction'
        ]);
        this.player1.reap(this.infomorph);
        // this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Left');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.posPixiesEnemy.amber).toBe(0);
        expect(this.player1.player.creaturesInPlay[0].name).toBe('Prospector');
        expect(this.player1.player.creaturesInPlay[0].amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it("Reap > Fading Apparition (from friendly creature) > Dimension Door > Po's Pixies > Staff Up: steal 1 amber from the common supply to the common supply (no change) and make a token creature", function () {
        setupCards(this, [
            'fadingApparition',
            'dimensionDoor',
            'posPixiesEnemy',
            'staffUp',
            'bookOfMalefaction'
        ]);
        this.player1.reap(this.infomorph);
        // expect(this.player1).toBeAbleToSelect(this.fadingApparition);
        // this.player1.clickCard(this.fadingApparition);
        this.player1.clickPrompt('Left');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.posPixiesEnemy.amber).toBe(0);
        expect(this.player1.player.creaturesInPlay[0].name).toBe('Prospector');
        expect(this.player1.player.creaturesInPlay[0].amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it("Reap > Fading Apparition (from common supply) > Dimension Door > Staff Up: steal 1 amber from opponent's pool to the common supply and make a token creature", function () {
        setupCards(this, ['fadingApparition', 'dimensionDoor', 'staffUp', 'bookOfMalefaction']);
        this.player1.reap(this.infomorph);
        // this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Left');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(2);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.player1.player.creaturesInPlay[0].name).toBe('Prospector');
        expect(this.player1.player.creaturesInPlay[0].amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it("Reap > Fading Apparition (from friendly creature) > Dimension Door > Staff Up: steal 1 amber from opponent's pool to the common supply and make a token creature", function () {
        setupCards(this, ['fadingApparition', 'dimensionDoor', 'staffUp', 'bookOfMalefaction']);
        this.player1.reap(this.infomorph);
        // expect(this.player1).toBeAbleToSelect(this.fadingApparition);
        // this.player1.clickCard(this.fadingApparition);
        this.player1.clickPrompt('Left');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(2);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.player1.player.creaturesInPlay[0].name).toBe('Prospector');
        expect(this.player1.player.creaturesInPlay[0].amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(1);
    });

    it('Reap > Fading Apparition (from common supply) > Dimension Door > The Vaultkeeper: cannot steal', function () {
        setupCards(this, [
            'fadingApparition',
            'dimensionDoor',
            'theVaultkeeper',
            'bookOfMalefaction'
        ]);
        this.player1.reap(this.infomorph);
        // this.player1.clickPrompt('Done');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.theVaultkeeper.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(undefined);
    });

    it('Reap > Fading Apparition (from friendly creature) > Dimension Door > The Vaultkeeper: cannot steal', function () {
        setupCards(this, [
            'fadingApparition',
            'dimensionDoor',
            'theVaultkeeper',
            'bookOfMalefaction'
        ]);
        this.player1.reap(this.infomorph);
        // expect(this.player1).toBeAbleToSelect(this.fadingApparition);
        // this.player1.clickCard(this.fadingApparition);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.theVaultkeeper.amber).toBe(0);
        expect(this.bookOfMalefaction.tokens.warrant).toBe(undefined);
    });

    it('Reap > Fading Apparition (from common supply) > Ether Spider: capture 1 amber from the common supply onto ether spider', function () {
        setupCards(this, ['fadingApparition', 'etherSpider', 'kretchee']);
        this.player1.reap(this.infomorph);
        this.player1.clickPrompt('Done');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.etherSpider.amber).toBe(2);
        expect(this.kretchee.amber).toBe(0);
    });

    it('Reap > Fading Apparition (from friendly creature) > Ether Spider: capture 1 amber from a friendly creature onto ether spider', function () {
        setupCards(this, ['fadingApparition', 'etherSpider', 'kretchee']);
        this.player1.reap(this.infomorph);
        expect(this.player1).toBeAbleToSelect(this.fadingApparition);
        this.player1.clickCard(this.fadingApparition);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(1);
        expect(this.etherSpider.amber).toBe(2);
        expect(this.kretchee.amber).toBe(0);
    });

    it('Reap > Fading Apparition (from common supply) > Staff Up: gain 1 amber from the common supply to the common supply (no change) and make a token creature', function () {
        setupCards(this, ['fadingApparition', 'staffUp']);
        this.player1.reap(this.infomorph);
        expect(this.player1).toHavePromptButton(this.staffUp.name);
        expect(this.player1).toBeAbleToSelect(this.fadingApparition);
        this.player1.clickCard(this.fadingApparition);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Left');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.player1.player.creaturesInPlay[0].name).toBe('Prospector');
        expect(this.player1.player.creaturesInPlay[0].amber).toBe(0);
    });

    it('Reap > Fading Apparition (from friendly creature) > Staff Up: take 1 amber from a friendly creature to the common supply and make a token creature', function () {
        setupCards(this, ['fadingApparition', 'staffUp']);
        this.player1.reap(this.infomorph);
        expect(this.player1).toHavePromptButton(this.staffUp.name);
        expect(this.player1).toBeAbleToSelect(this.fadingApparition);
        this.player1.clickCard(this.fadingApparition);
        expect(this.player1).toBeAbleToSelect(this.fadingApparition);
        this.player1.clickCard(this.fadingApparition);
        this.player1.clickPrompt('Left');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.fadingApparition.amber).toBe(1);
        expect(this.player1.player.creaturesInPlay[0].name).toBe('Prospector');
        expect(this.player1.player.creaturesInPlay[0].amber).toBe(0);
    });

    it("Reap > Fading Apparition (from common supply) > Widespread Corruption: gain 1 amber from the common supply to player's pool and capture 1 amber from player's pool onto enemy creature", function () {
        setupCards(this, ['fadingApparition', 'widespreadCorruption', 'kretchee']);
        this.player1.reap(this.infomorph);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.graphton);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(2);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.kretchee.amber).toBe(0);
    });

    it("Reap > Fading Apparition (from friendly creature) > Widespread Corruption: take 1 amber from a friendly creature to player's pool and capture 1 amber from player's pool onto enemy creature", function () {
        setupCards(this, ['fadingApparition', 'widespreadCorruption', 'kretchee']);
        this.player1.reap(this.infomorph);
        expect(this.player1).toBeAbleToSelect(this.fadingApparition);
        this.player1.clickCard(this.fadingApparition);
        this.player1.clickCard(this.graphton);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(2);
        expect(this.fadingApparition.amber).toBe(1);
        expect(this.kretchee.amber).toBe(0);
    });

    it("Reap > Fading Apparition (from common supply) > Widespread Corruption > Po's Pixies: gain 1 amber from the common supply to player's pool and capture 1 amber from the common supply onto enemy creature", function () {
        setupCards(this, [
            'fadingApparition',
            'widespreadCorruption',
            'posPixiesFriendly',
            'kretchee'
        ]);
        this.player1.reap(this.infomorph);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.graphton);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(1);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(2);
        expect(this.fadingApparition.amber).toBe(2);
        expect(this.posPixiesFriendly.amber).toBe(0);
        expect(this.kretchee.amber).toBe(0);
    });

    it("Reap > Fading Apparition (from friendly creature) > Widespread Corruption > Po's Pixies: take 1 amber from a friendly creature to player's pool and capture 1 amber from the common supply onto enemy creature", function () {
        setupCards(this, [
            'fadingApparition',
            'widespreadCorruption',
            'posPixiesFriendly',
            'kretchee'
        ]);
        this.player1.reap(this.infomorph);
        expect(this.player1).toBeAbleToSelect(this.fadingApparition);
        this.player1.clickCard(this.fadingApparition);
        this.player1.clickCard(this.graphton);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(1);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(2);
        expect(this.fadingApparition.amber).toBe(1);
        expect(this.posPixiesFriendly.amber).toBe(0);
        expect(this.kretchee.amber).toBe(0);
    });

    it('Reap > Staff Up: gain 1 amber from the common supply to the common supply (no change) and make a token creature', function () {
        setupCards(this, ['staffUp']);
        this.player1.reap(this.infomorph);
        this.player1.clickPrompt('Left');
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(0);
        expect(this.player1.player.creaturesInPlay[0].name).toBe('Prospector');
        expect(this.player1.player.creaturesInPlay[0].amber).toBe(0);
    });

    it("Reap > Widespread Corruption: gain 1 amber from the common supply to player's pool and capture 1 amber from player's pool onto enemy creature", function () {
        setupCards(this, ['widespreadCorruption', 'kretchee']);
        this.player1.reap(this.infomorph);
        this.player1.clickCard(this.graphton);
        expect(this.player1).isReadyToTakeAction();
        expect(this.player1.amber).toBe(0);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(2);
        expect(this.kretchee.amber).toBe(0);
    });

    it("Reap > Widespread Corruption > Po's Pixies: gain 1 amber from the common supply to player's pool and capture 1 amber from the common supply onto enemy creature", function () {
        setupCards(this, ['widespreadCorruption', 'posPixiesFriendly', 'kretchee']);
        this.player1.reap(this.infomorph);
        this.player1.clickCard(this.graphton);
        expect(this.player1).isReadyToTakeAction();
        expect.soft(this.player1.amber).toBe(1);
        expect(this.player2.amber).toBe(3);
        expect(this.infomorph.amber).toBe(0);
        expect(this.graphton.amber).toBe(2);
        expect(this.posPixiesFriendly.amber).toBe(0);
        expect(this.kretchee.amber).toBe(0);
    });
});
