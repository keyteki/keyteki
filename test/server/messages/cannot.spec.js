describe('Cannot Play Messages', function () {
    describe('hidden-zone play blocked by player restriction (Ember Imp)', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['archimedes', 'wild-wormhole'],
                    discard: ['dextre']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });
        });

        it('should log a generic restriction message without revealing the deck card', function () {
            this.player1.moveCard(this.dextre, 'deck');
            this.player1.play(this.archimedes);
            this.player1.play(this.wildWormhole);
            expect(this.player1).isReadyToTakeAction();
            expect(this.dextre.location).toBe('deck');
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Archimedes',
                'player1 plays Wild Wormhole',
                "player1 gains an amber due to Wild Wormhole's bonus icon",
                'player1 is unable to play a card from deck due to a restriction'
            ]);
        });
    });

    describe('hidden-zone play blocked by card-specific player restriction (Quixxle Stone)', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['wild-wormhole'],
                    inPlay: ['dew-faerie'],
                    discard: ['snufflegator']
                },
                player2: {
                    inPlay: ['quixxle-stone']
                }
            });
        });

        it('should reveal the creature since the type-specific block could not be known until it was revealed', function () {
            this.player1.moveCard(this.snufflegator, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.player1).isReadyToTakeAction();
            expect(this.snufflegator.location).toBe('deck');
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Wild Wormhole',
                "player1 gains an amber due to Wild Wormhole's bonus icon",
                'player1 uses Wild Wormhole to play Snufflegator',
                'player1 is unable to play Snufflegator and returns it to deck'
            ]);
        });
    });

    describe('hidden-zone play blocked by card-self restriction (Kelifi Dragon)', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['wild-wormhole'],
                    discard: ['kelifi-dragon']
                }
            });
        });

        it('should reveal Kelifi Dragon and return it to the deck', function () {
            this.player1.moveCard(this.kelifiDragon, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.player1).isReadyToTakeAction();
            expect(this.kelifiDragon.location).toBe('deck');
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Wild Wormhole',
                "player1 gains an amber due to Wild Wormhole's bonus icon",
                'player1 uses Wild Wormhole to play Kelifi Dragon',
                'player1 is unable to play Kelifi Dragon and returns it to deck'
            ]);
        });
    });

    describe('hidden-zone play blocked by card-specific player restriction (Traumatic Echo)', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['traumatic-echo'],
                    discard: ['searine']
                },
                player2: {
                    hand: ['wild-wormhole'],
                    discard: ['dextre']
                }
            });
        });

        it('should reveal the card since the type-specific block could not be known until it was revealed', function () {
            this.player1.play(this.traumaticEcho);
            this.player1.clickCard(this.searine);
            expect(this.searine.location).toBe('purged');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.moveCard(this.dextre, 'deck');
            this.player2.play(this.wildWormhole);
            expect(this.player2).isReadyToTakeAction();
            expect(this.dextre.location).toBe('deck');
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Traumatic Echo',
                'player1 uses Traumatic Echo to purge Searine',
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player2 does not forge a key.  They have 0 amber.  The current cost is 6 amber ',
                'player2 chooses logos as their active house this turn',
                'player2 plays Wild Wormhole',
                "player2 gains an amber due to Wild Wormhole's bonus icon",
                'player2 uses Wild Wormhole to play Dextre',
                'player2 is unable to play Dextre and returns it to deck'
            ]);
        });
    });
});
