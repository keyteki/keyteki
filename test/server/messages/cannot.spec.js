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

    describe('hidden-zone play with ability-level effect message blocked by player restriction (Wormhole Technician)', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['library-of-babble', 'batdrone'],
                    inPlay: ['wormhole-technician'],
                    discard: ['dextre']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });
        });

        it("should preserve the ability's reveal message even when the play is blocked", function () {
            this.player1.moveCard(this.dextre, 'deck');
            this.player1.play(this.libraryOfBabble);
            this.player1.play(this.batdrone);
            this.player1.reap(this.wormholeTechnician);
            expect(this.dextre.location).toBe('deck');
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Library of Babble',
                'player1 plays Batdrone',
                'player1 uses Wormhole Technician to reap with Wormhole Technician',
                'player1 uses Wormhole Technician to reveal Dextre, which is a Logos card, and play it',
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

    describe('hidden-zone play of upgrade with no legal target', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['wild-wormhole'],
                    discard: ['way-of-the-bear']
                }
            });
        });

        it('should reveal the upgrade and return it to the deck since the lack of attach target is card-specific', function () {
            this.player1.moveCard(this.wayOfTheBear, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.player1).isReadyToTakeAction();
            expect(this.wayOfTheBear.location).toBe('deck');
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Wild Wormhole',
                "player1 gains an amber due to Wild Wormhole's bonus icon",
                'player1 uses Wild Wormhole to play Way of the Bear',
                'player1 is unable to play Way of the Bear and returns it to deck'
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
                'player2 does not forge a key. They have 0 amber. The current cost is 6 amber',
                'player2 chooses logos as their active house this turn',
                'player2 plays Wild Wormhole',
                "player2 gains an amber due to Wild Wormhole's bonus icon",
                'player2 uses Wild Wormhole to play Dextre',
                'player2 is unable to play Dextre and returns it to deck'
            ]);
        });
    });

    describe('discard play blocked by card-specific player restriction (Elite Disruptzord vs Dr. Xyloxxzlphrex)', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['elite-disruptzord', 'dr-xyloxxzlphrex'],
                    discard: ['zorg']
                }
            });
            this.drXyloxxzlphrex.powerCounters = 5;
        });

        it('should reveal Zorg and return it to discard when selected via Dr. Xylo', function () {
            expect(this.eliteDisruptzord.power).toBe(6);
            this.player1.reap(this.drXyloxxzlphrex);
            this.player1.clickCard(this.zorg);
            expect(this.zorg.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Dr. Xyloxxzlphrex to reap with Dr. Xyloxxzlphrex',
                'player1 uses Dr. Xyloxxzlphrex to play Zorg',
                'player1 is unable to play Zorg and returns it to discard'
            ]);
        });
    });
});
