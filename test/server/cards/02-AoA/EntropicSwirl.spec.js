describe('Entropic Swirl', function () {
    describe("Entropic Swirl's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'logos',
                    hand: ['mimic-gel', 'cyber-clone', 'entropic-swirl'],
                    inPlay: ['shooler']
                },
                player2: {
                    amber: 0,
                    inPlay: ['brammo', 'cowfyne', 'sci-officer-qincan']
                }
            });

            this.sciOfficerQincan.powerCounters = 10;
        });

        it('should be able to target any creature', function () {
            this.player1.play(this.entropicSwirl);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.brammo);
            expect(this.player1).toBeAbleToSelect(this.cowfyne);
            expect(this.player1).toBeAbleToSelect(this.sciOfficerQincan);
        });

        it('should gain 1 amber and deal 2 damage if creature has 1 trait', function () {
            this.player1.play(this.entropicSwirl);
            this.player1.clickCard(this.cowfyne);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.cowfyne.damage).toBe(2);
        });

        it('should gain 2 amber and deal 4 damage if creature has 2 traits', function () {
            this.player1.play(this.entropicSwirl);
            this.player1.clickCard(this.brammo);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.brammo.damage).toBe(3);
        });

        it('should gain 3 amber and deal 6 damage if creature has 3 traits', function () {
            this.player1.play(this.entropicSwirl);
            this.player1.clickCard(this.sciOfficerQincan);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
            expect(this.sciOfficerQincan.damage).toBe(6);
        });

        it('should gain 4 amber and deal 8 damage if creature has 1 mutant + 3 traits cloned by Cyber Clone', function () {
            this.player1.play(this.cyberClone);
            this.player1.clickCard(this.sciOfficerQincan);
            expect(this.sciOfficerQincan.location).toBe('purged');
            this.player1.play(this.entropicSwirl);
            this.player1.clickCard(this.cyberClone);

            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
            expect(this.cyberClone.location).toBe('discard');
        });

        it('should gain 2 amber and deal 4 damage to a Mimic Gel', function () {
            this.player1.clickCard(this.mimicGel);
            this.player1.clickPrompt('Play this creature');
            this.player1.clickCard(this.brammo);
            this.player1.clickPrompt('Left');
            this.player1.play(this.entropicSwirl);
            this.player1.clickCard(this.mimicGel);

            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.mimicGel.damage).toBe(3);
        });
    });
});
