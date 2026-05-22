describe('Bear Flute', function () {
    describe('with bears available to search', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['bear-flute'],
                    hand: ['cooperative-hunting', 'regrowth'],
                    discard: ['ancient-bear', 'ancient-bear', 'halacor', 'niffle-ape']
                },
                player2: {
                    inPlay: []
                }
            });

            this.ancientBear1 = this.player1.player.discard[0];
            this.ancientBear2 = this.player1.player.discard[1];
        });

        it('puts each Ancient Bear from discard into hand and shuffles discard into deck', function () {
            this.player1.useAction(this.bearFlute);
            this.player1.clickCard(this.ancientBear1);
            this.player1.clickCard(this.ancientBear2);
            this.player1.clickPrompt('Done');

            // Both bears go to hand
            expect(this.ancientBear1.location).toBe('hand');
            expect(this.ancientBear2.location).toBe('hand');
            expect(this.halacor.location).toBe('deck');
            expect(this.niffleApe.location).toBe('deck');
            expect(this.player1.discard.length).toBe(0);

            expect(this.player1).isReadyToTakeAction();
        });

        it('finds bears across deck and discard and shuffles remaining discard into deck', function () {
            // Spread the bears across deck and discard
            this.player1.moveCard(this.halacor, 'deck');
            this.player1.moveCard(this.ancientBear2, 'deck');

            this.player1.useAction(this.bearFlute);
            this.player1.clickCard(this.ancientBear1);
            this.player1.clickCard(this.ancientBear2);
            this.player1.clickPrompt('Done');

            // Both bears go to hand regardless of which pile they came from
            expect(this.ancientBear1.location).toBe('hand');
            expect(this.ancientBear2.location).toBe('hand');
            expect(this.halacor.location).toBe('deck');
            expect(this.niffleApe.location).toBe('deck');
            expect(this.player1.discard.length).toBe(0);

            expect(this.player1).isReadyToTakeAction();
        });

        it('stops searching once a bear is in play', function () {
            // Pull both bears into hand
            this.player1.useAction(this.bearFlute);
            this.player1.clickCard(this.ancientBear1);
            this.player1.clickCard(this.ancientBear2);
            this.player1.clickPrompt('Done');

            // Play one and discard the other, then try to activate Bear Flute again
            this.player1.play(this.ancientBear1);
            this.player1.moveCard(this.ancientBear2, 'discard');
            this.bearFlute.ready();
            this.player1.useAction(this.bearFlute);

            // Does not prompt for search
            this.player1.clickCard(this.ancientBear1);
            expect(this.ancientBear1.location).toBe('play area');
            expect(this.ancientBear2.location).toBe('discard');

            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with a bear already in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['bear-flute'],
                    hand: ['cooperative-hunting', 'regrowth'],
                    discard: ['ancient-bear', 'ancient-bear', 'halacor', 'niffle-ape']
                },
                player2: {
                    inPlay: []
                }
            });

            this.ancientBear1 = this.player1.player.discard[0];
            this.ancientBear2 = this.player1.player.discard[1];
        });

        it('fully heals the targeted Ancient Bear', function () {
            // Get a bear into play and put 1 damage on it
            this.player1.play(this.regrowth);
            this.player1.clickCard(this.ancientBear1);
            this.player1.play(this.ancientBear1);
            this.player1.play(this.cooperativeHunting);
            this.player1.clickCard(this.ancientBear1);
            expect(this.ancientBear1.damage).toBe(1);

            this.player1.useAction(this.bearFlute);
            expect(this.player1).toHavePrompt('Bear Flute');
            expect(this.player1).toBeAbleToSelect(this.ancientBear1);
            this.player1.clickCard(this.ancientBear1);

            // Discarded cards stay in discard
            expect(this.ancientBear1.damage).toBe(0);
            expect(this.ancientBear1.location).toBe('play area');
            expect(this.ancientBear2.location).toBe('discard');
            expect(this.halacor.location).toBe('discard');
            expect(this.niffleApe.location).toBe('discard');
            expect(this.player1.discard.length).toBe(5);

            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot target an undamaged bear', function () {
            this.player1.play(this.regrowth);
            this.player1.clickCard(this.ancientBear1);
            this.player1.play(this.ancientBear1);

            this.player1.useAction(this.bearFlute);
            expect(this.player1).toHavePrompt('Bear Flute');
            expect(this.player1).toBeAbleToSelect(this.ancientBear1);
            this.player1.clickCard(this.ancientBear1);

            // Discarded cards stay in discard
            expect(this.ancientBear1.location).toBe('play area');
            expect(this.ancientBear2.location).toBe('discard');
            expect(this.halacor.location).toBe('discard');
            expect(this.niffleApe.location).toBe('discard');
            expect(this.player1.discard.length).toBe(4);

            expect(this.player1).isReadyToTakeAction();
        });

        it('does not search or shuffle discard when a bear is already in play', function () {
            this.player1.play(this.regrowth);
            this.player1.clickCard(this.ancientBear1);
            this.player1.play(this.ancientBear1);

            this.player1.useAction(this.bearFlute);
            expect(this.player1).toHavePrompt('Bear Flute');
            expect(this.player1).toBeAbleToSelect(this.ancientBear1);
            this.player1.clickCard(this.ancientBear1);

            // Discarded cards stay in discard
            expect(this.ancientBear2.location).toBe('discard');
            expect(this.halacor.location).toBe('discard');
            expect(this.niffleApe.location).toBe('discard');
            expect(this.regrowth.location).toBe('discard');
            expect(this.player1.discard.length).toBe(4);

            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('"if you do" gating when no bears are found', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['bear-flute'],
                    hand: [],
                    discard: ['halacor', 'niffle-ape', 'dust-pixie']
                },
                player2: {}
            });
        });

        it('does not shuffle discard into deck when the search finds no Ancient Bears', function () {
            this.player1.useAction(this.bearFlute);
            this.player1.clickPrompt('Done');

            // Discarded cards stay in discard
            expect(this.halacor.location).toBe('discard');
            expect(this.niffleApe.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1.discard.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('interaction with prophecy that fires on deck shuffle', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['bear-flute'],
                    hand: [],
                    discard: ['ancient-bear', 'halacor', 'niffle-ape', 'dust-pixie']
                },
                player2: {
                    prophecies: ['expect-the-unexpected', 'bad-omen'],
                    hand: ['grave-bounty']
                }
            });

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.activateProphecy(this.expectTheUnexpected, this.graveBounty);
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
        });

        it('resolves prophecy fate during the search shuffle, then shuffles remaining discard into the deck', function () {
            const deckLength = this.player1.deck.length;

            this.player1.useAction(this.bearFlute);
            this.player1.clickCard(this.ancientBear);
            this.player1.clickPrompt('Done');

            // Search and the shuffle
            expect(this.ancientBear.location).toBe('hand');
            expect(this.halacor.location).toBe('purged');
            expect(this.niffleApe.location).toBe('purged');
            expect(this.player1.player.purged.length).toBe(2);

            // Second "if you do" shuffle after prophecy resolves
            expect(this.dustPixie.location).toBe('deck');
            expect(this.player1.discard.length).toBe(0);
            expect(this.player1.deck.length).toBe(deckLength + 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
