describe('Poke', function () {
    describe("Poke's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['poke']
                },
                player2: {
                    inPlay: ['shooler', 'lamindra', 'groggins', 'shadow-self', 'urchin'],
                    hand: ['poltergeist']
                }
            });
        });

        it('should draw a card if it destroys the creature', function () {
            this.player1.play(this.poke);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1.player.hand.length).toBe(1);
        });

        it('should not draw a card if it does destroy the creature', function () {
            this.player1.play(this.poke);
            this.player1.clickCard(this.shooler);
            expect(this.shooler.location).toBe('play area');
            expect(this.shooler.damage).toBe(1);
            expect(this.player1.player.hand.length).toBe(0);
        });

        it('should not draw a card if it destroyes Shadow Self', function () {
            this.shadowSelf.tokens.damage = 8;
            this.player1.play(this.poke);
            this.player1.clickCard(this.urchin);
            expect(this.shadowSelf.location).toBe('discard');
            expect(this.urchin.location).toBe('play area');
            expect(this.urchin.damage).toBe(0);
            expect(this.player1.player.hand.length).toBe(0);
        });
    });
});
