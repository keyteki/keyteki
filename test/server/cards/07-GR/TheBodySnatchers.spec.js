describe('The Body Snatchers', function () {
    describe("The Body Snatchers's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['the-body-snatchers', 'kaboom', 'destroy-them-all'],
                    inPlay: ['tunk']
                },
                player2: {
                    inPlay: ['dust-pixie', 'thing-from-the-deep', 'ritual-of-balance']
                }
            });
        });

        it('gives all destroyed enemy creatures to player', function () {
            this.player1.play(this.theBodySnatchers);
            this.player1.fightWith(this.tunk, this.dustPixie);
            this.player1.clickPrompt('Right');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay).toContain(this.dustPixie);
            expect(this.dustPixie.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('heals the destroyed enemy creatures', function () {
            this.player1.play(this.theBodySnatchers);
            this.player1.fightWith(this.tunk, this.thingFromTheDeep);
            expect(this.tunk.location).toBe('discard');
            this.player1.play(this.kaboom);
            this.player1.clickCard(this.thingFromTheDeep);
            this.player1.clickPrompt('Right');
            expect(this.thingFromTheDeep.location).toBe('play area');
            expect(this.thingFromTheDeep.tokens.damage).toBeUndefined();
            expect(this.player1.player.creaturesInPlay).toContain(this.thingFromTheDeep);
            expect(this.thingFromTheDeep.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('only lasts for a turn', function () {
            this.player1.play(this.theBodySnatchers);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.dustPixie, this.tunk);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('only affects creatures', function () {
            this.player1.play(this.theBodySnatchers);
            this.player1.play(this.destroyThemAll);
            this.player1.clickCard(this.ritualOfBalance);
            this.player1.clickCard(this.thingFromTheDeep);
            this.player1.clickPrompt('Left');
            expect(this.thingFromTheDeep.location).toBe('play area');
            expect(this.thingFromTheDeep.tokens.damage).toBeUndefined();
            expect(this.player1.player.creaturesInPlay).toContain(this.thingFromTheDeep);
            expect(this.ritualOfBalance.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
