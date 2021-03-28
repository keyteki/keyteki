describe('Doctor Driscoll', function () {
    describe("Doctor Driscoll's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['doctor-driscoll', 'crash-muldoon']
                },
                player2: {
                    inPlay: ['dust-pixie', 'flaxia']
                }
            });
        });

        it('should gain no amber if a creature without damage is chosen', function () {
            this.player1.fightWith(this.crashMuldoon, this.dustPixie);
            this.player1.useAction(this.doctorDriscoll);
            this.player1.clickCard(this.doctorDriscoll);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should gain 1 amber when only 1 damage can be healed', function () {
            this.player1.fightWith(this.crashMuldoon, this.dustPixie);
            this.player1.useAction(this.doctorDriscoll);
            this.player1.clickCard(this.crashMuldoon);
            expect(this.crashMuldoon.hasToken('damage')).toBe(false);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should gain 2 amber when 2 damage is healed', function () {
            this.player1.fightWith(this.crashMuldoon, this.flaxia);
            this.player1.useAction(this.doctorDriscoll);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.tokens.damage).toBe(1);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
