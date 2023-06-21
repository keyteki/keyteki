describe('Physaloha', function () {
    describe("Physaloha's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['vulka', 'physaloha']
                },
                player2: {
                    inPlay: ['quixo-the-adventurer', 'charette', 'batdrone', 'brain-eater']
                }
            });
        });

        it('should not ready damaged creatures', function () {
            this.player1.fightWith(this.vulka, this.charette);
            expect(this.quixoTheAdventurer.tokens.damage).toBe(1);
            expect(this.batdrone.tokens.damage).toBe(1);
            expect(this.vulka.tokens.damage).toBe(4);
            this.player1.endTurn();
            expect(this.vulka.exhausted).toBe(true);
            expect(this.physaloha.exhausted).toBe(false);
            this.player2.clickPrompt('logos');
            this.player2.reap(this.quixoTheAdventurer);
            this.player2.reap(this.batdrone);
            this.player2.reap(this.brainEater);
            this.player2.endTurn();
            expect(this.vulka.exhausted).toBe(true);
            expect(this.physaloha.exhausted).toBe(false);
            expect(this.quixoTheAdventurer.exhausted).toBe(true);
            expect(this.batdrone.exhausted).toBe(true);
            expect(this.brainEater.exhausted).toBe(false);
        });
    });
});
