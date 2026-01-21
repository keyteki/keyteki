describe('Qyxxlyx Plague Master', function () {
    describe("Qyxxlyx Plague Master's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['qyxxlyx-plague-master', 'ember-imp']
                },
                player2: {
                    inPlay: ['valdr', 'champion-anaphiel', 'sequis']
                }
            });
        });

        it('should deal 3 damage to each Human creature on fight', function () {
            this.player1.fightWith(this.qyxxlyxPlagueMaster, this.sequis);
            expect(this.valdr.tokens.damage).toBe(3);
            expect(this.championAnaphiel.tokens.damage).toBeUndefined();
            expect(this.sequis.tokens.damage).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should deal 3 damage to each Human creature on reap', function () {
            this.player1.reap(this.qyxxlyxPlagueMaster);
            expect(this.valdr.tokens.damage).toBe(3);
            expect(this.championAnaphiel.tokens.damage).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should ignore armor when dealing damage', function () {
            this.valdr.tokens.armor = 2;
            this.player1.reap(this.qyxxlyxPlagueMaster);
            expect(this.valdr.tokens.damage).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
