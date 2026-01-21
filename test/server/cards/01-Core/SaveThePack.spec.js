describe('Save the Pack', function () {
    describe("Save the Pack's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['save-the-pack'],
                    inPlay: ['urchin', 'dust-pixie']
                },
                player2: {
                    inPlay: ['bumpsy', 'troll']
                }
            });
        });

        it('should destroy all damaged creatures and gain a chain', function () {
            this.urchin.tokens.damage = 1;
            this.bumpsy.tokens.damage = 2;
            this.player1.play(this.saveThePack);
            expect(this.urchin.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.troll.location).toBe('play area');
            expect(this.player1.chains).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should still gain a chain even if no creatures are damaged', function () {
            this.player1.play(this.saveThePack);
            expect(this.player1.chains).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
