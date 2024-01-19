describe('The Body Snatchers', function () {
    describe("The Body Snatchers's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['the-body-snatchers', 'kaboom'],
                    inPlay: ['tunk']
                },
                player2: {
                    inPlay: ['dust-pixie', 'thing-from-the-deep']
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
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
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
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('only lasts for a turn', function () {
            this.player1.play(this.theBodySnatchers);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.fightWith(this.dustPixie, this.tunk);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
