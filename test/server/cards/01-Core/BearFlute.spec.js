describe('Bear Flute', function () {
    describe("Bear Flute's ability", function () {
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

        it("should search discard for a bear when there isn't one in play, and shuffle discard", function () {
            this.player1.useAction(this.bearFlute);
            this.player1.clickCard(this.ancientBear1);
            this.player1.clickCard(this.ancientBear2);
            this.player1.clickPrompt('Done');
            expect(this.halacor.location).toBe('deck');
            expect(this.niffleApe.location).toBe('deck');
            expect(this.ancientBear1.location).toBe('hand');
            expect(this.ancientBear2.location).toBe('hand');
            expect(this.player1.discard.length).toBe(0);
            this.player1.endTurn();
        });

        it("should search for a bear when there isn't one in play, but stop when there is one", function () {
            this.player1.useAction(this.bearFlute);
            this.player1.clickCard(this.ancientBear1);
            this.player1.clickCard(this.ancientBear2);
            this.player1.clickPrompt('Done');
            this.player1.play(this.ancientBear1);
            this.player1.moveCard(this.ancientBear2, 'discard');
            this.bearFlute.ready();
            this.player1.useAction(this.bearFlute);
            this.player1.clickCard(this.ancientBear1);
            expect(this.ancientBear2.location).toBe('discard');
            this.player1.endTurn();
        });

        it("should search deck for a bear when there isn't one in play and shuffle discard", function () {
            this.player1.moveCard(this.halacor, 'deck');
            this.player1.moveCard(this.ancientBear2, 'deck');
            this.player1.useAction(this.bearFlute);
            this.player1.clickCard(this.ancientBear1);
            this.player1.clickCard(this.ancientBear2);
            this.player1.clickPrompt('Done');
            expect(this.ancientBear1.location).toBe('hand');
            expect(this.ancientBear2.location).toBe('hand');
            expect(this.halacor.location).toBe('deck');
            expect(this.niffleApe.location).toBe('deck');
            expect(this.player1.discard.length).toBe(0);
            this.player1.endTurn();
        });

        it('should heal a bear when there is one in play', function () {
            this.player1.play(this.regrowth);
            this.player1.clickCard(this.ancientBear1);
            expect(this.ancientBear1.location).toBe('hand');
            this.player1.play(this.ancientBear1);
            expect(this.ancientBear1.location).toBe('play area');
            this.player1.play(this.cooperativeHunting);
            this.player1.clickCard(this.ancientBear1);
            expect(this.ancientBear1.damage).toBe(1);
            this.player1.useAction(this.bearFlute);
            expect(this.player1).toHavePrompt('Bear Flute');
            expect(this.player1).toBeAbleToSelect(this.ancientBear1);
            this.player1.clickCard(this.ancientBear1);
            expect(this.ancientBear1.damage).toBe(0);
            expect(this.player1.discard.length).toBe(5);
            this.player1.endTurn();
        });

        it('should not be usable when there is an undamaged bear on the field', function () {
            this.player1.play(this.regrowth);
            this.player1.clickCard(this.ancientBear1);
            expect(this.ancientBear1.location).toBe('hand');
            this.player1.play(this.ancientBear1);
            expect(this.ancientBear1.location).toBe('play area');
            this.player1.useAction(this.bearFlute);
            expect(this.player1).toHavePrompt('Bear Flute');
            expect(this.player1).toBeAbleToSelect(this.ancientBear1);
            this.player1.clickCard(this.ancientBear1);
            expect(this.player1.discard.length).toBe(4);
            this.player1.endTurn();
        });

        it('should not reshuffle when there is one in play', function () {
            this.player1.play(this.regrowth);
            this.player1.clickCard(this.ancientBear1);
            expect(this.ancientBear1.location).toBe('hand');
            expect(this.regrowth.location).toBe('discard');
            this.player1.play(this.ancientBear1);
            this.player1.useAction(this.bearFlute);
            expect(this.player1).toHavePrompt('Bear Flute');
            expect(this.player1).toBeAbleToSelect(this.ancientBear1);
            this.player1.clickCard(this.ancientBear1);
            expect(this.regrowth.location).toBe('discard');
            expect(this.player1.discard.length).toBe(4);
            this.player1.endTurn();
        });
    });

    describe('double shuffle with prophecy', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['bear-flute'],
                    hand: [],
                    discard: ['halacor', 'niffle-ape', 'dust-pixie']
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

        it('shuffles after deck search, triggering prophecy/fate before shuffling discard into deck', function () {
            this.player1.useAction(this.bearFlute);
            this.player1.clickPrompt('Done');
            // First shuffle from search triggers prophecy → Grave Bounty fate purges top 2 of discard
            expect(this.player1.player.purged.length).toBe(2);
            // Remaining 1 discard card is shuffled into deck by Bear Flute's then
            expect(this.player1.discard.length).toBe(0);
            expect(this.halacor.location).toBe('purged');
            expect(this.niffleApe.location).toBe('purged');
            expect(this.dustPixie.location).toBe('deck');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
