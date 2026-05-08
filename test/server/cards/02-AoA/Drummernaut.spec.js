describe('Drummernaut', function () {
    describe("Drummernaut's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['drummernaut', 'ganger-chieftain'],
                    inPlay: ['troll', 'tunk']
                },
                player2: {
                    inPlay: ['smaaash']
                }
            });
        });

        it('should return another friendly Giant creature to hand on play', function () {
            this.player1.playCreature(this.drummernaut);
            expect(this.player1).not.toBeAbleToSelect(this.drummernaut);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.tunk);
            expect(this.player1).not.toBeAbleToSelect(this.smaaash);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should return another friendly Giant creature to hand on reap', function () {
            this.player1.moveCard(this.drummernaut, 'play area');
            this.drummernaut.ready();
            this.player1.reap(this.drummernaut);
            expect(this.player1).not.toBeAbleToSelect(this.drummernaut);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.tunk);
            expect(this.player1).not.toBeAbleToSelect(this.smaaash);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should return another friendly Giant creature to hand on fight', function () {
            this.player1.moveCard(this.drummernaut, 'play area');
            this.drummernaut.ready();
            this.player1.fightWith(this.drummernaut, this.smaaash);
            expect(this.player1).not.toBeAbleToSelect(this.drummernaut);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.tunk);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow bouncing ganger-chieftain and drummernaut up to 6 times each', function () {
            this.player2.moveCard(this.smaaash, 'discard');
            this.player1.playCreature(this.drummernaut);
            this.player1.clickCard(this.troll);

            for (let i = 1; i < 6; i++) {
                this.player1.playCreature(this.gangerChieftain);
                expect(this.player1).toHavePrompt(
                    'Any reactions to Ganger Chieftain being played?'
                );
                this.player1.clickCard(this.gangerChieftain);
                this.player1.clickCard(this.drummernaut);
                expect(this.player1).isReadyToTakeAction();
                this.player1.reap(this.drummernaut);
                expect(this.player1).toHavePrompt('Drummernaut');
                this.player1.clickCard(this.gangerChieftain);
                expect(this.gangerChieftain.location).toBe('hand');
            }

            this.player1.playCreature(this.gangerChieftain);
            expect(this.player1).toHavePrompt('Any reactions to Ganger Chieftain being played?');
            this.player1.clickCard(this.gangerChieftain);
            this.player1.clickCard(this.drummernaut);
            expect(this.drummernaut.exhausted).toBe(false);
            this.player1.clickCard(this.drummernaut);
            this.player1.clickCard(this.gangerChieftain);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
