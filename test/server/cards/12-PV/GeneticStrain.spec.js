describe('Genetic Strain', function () {
    describe("Genetic Strain's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'redemption',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['genetic-strain'],
                    inPlay: ['citizen-shrix', 'dark-centurion', 'ruthless-avenger']
                },
                player2: {
                    amber: 4,
                    inPlay: ['fandangle', 'searine']
                }
            });
        });

        it('should make each Mutant capture 1 amber', function () {
            this.player1.play(this.geneticStrain);
            expect(this.citizenShrix.amber).toBe(1);
            expect(this.darkCenturion.amber).toBe(1);
            expect(this.ruthlessAvenger.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.fandangle.amber).toBe(1);
            expect(this.searine.amber).toBe(0);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should make opponent gain 2 amber when fate is triggered if they have Mutants', function () {
            this.player1.activateProphecy(this.overreach, this.geneticStrain);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.fandangle);
            expect(this.player1.amber).toBe(4);
            expect(this.geneticStrain.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not make opponent gain amber when fate is triggered if they have no Mutants', function () {
            this.player1.moveCard(this.citizenShrix, 'discard');
            this.player1.activateProphecy(this.overreach, this.geneticStrain);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.fandangle);
            expect(this.player1.amber).toBe(4);
            expect(this.geneticStrain.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
