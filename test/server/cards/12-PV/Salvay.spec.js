describe('Salvay', function () {
    describe("Salvay's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'redemption',
                    hand: ['growland'],
                    inPlay: ['ruthless-avenger', 'salvay', 'ember-imp']
                },
                player2: {
                    inPlay: ['flaxia', 'troll']
                }
            });
        });

        it('should get +2 assault for 1 Redemption neighbor', function () {
            this.player1.fightWith(this.salvay, this.troll);
            expect(this.troll.tokens.damage).toBe(6);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should get +4 assault for 2 Redemption neighbors', function () {
            this.player1.moveCard(this.emberImp, 'discard');
            this.player1.playCreature(this.growland);
            this.player1.fightWith(this.salvay, this.flaxia);
            expect(this.flaxia.location).toBe('discard');
            expect(this.salvay.location).toBe('play area');
            expect(this.salvay.tokens.damage).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
