describe('Dæmo-Thief', function () {
    describe("Dæmo-Thief's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['dæmo-thief'],
                    hand: ['eyegor', 'titan-mechanic', 'archimedes'],
                    amber: 4
                },
                player2: {
                    amber: 1,
                    inPlay: ['lamindra', 'shooler', 'troll']
                }
            });

            this.player1.moveCard(this.eyegor, 'deck');
            this.player1.moveCard(this.titanMechanic, 'deck');
            this.player1.moveCard(this.archimedes, 'deck');
        });

        it('should steal 1A when destroyed', function () {
            this.player1.fightWith(this.dæmoThief, this.troll);
            expect(this.dæmoThief.location).toBe('discard');
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(0);
        });
    });
});
