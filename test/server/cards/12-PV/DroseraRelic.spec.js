describe('Drosera Relic', function () {
    describe("Drosera Relic's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    inPlay: ['drosera-relic', 'ember-imp', 'krump', 'troll', 'dew-faerie'],
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['brammo', 'umbra']
                }
            });
        });

        it('should destroy the least powerful friendly creature and steal 2 amber', function () {
            this.player1.useAction(this.droseraRelic);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.umbra);
            expect(this.player1).not.toBeAbleToSelect(this.brammo);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not steal amber if no creature is destroyed', function () {
            this.emberImp.ward();
            this.player1.useAction(this.droseraRelic);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.location).toBe('play area');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should destroy the least powerful friendly creature and pay opponent 2 amber when fate is triggered', function () {
            this.player1.moveCard(this.droseraRelic, 'hand');
            this.player1.activateProphecy(this.overreach, this.droseraRelic);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.brammo);
            expect(this.player2).toBeAbleToSelect(this.umbra);
            expect(this.player2).not.toBeAbleToSelect(this.emberImp);
            expect(this.player2).not.toBeAbleToSelect(this.krump);
            expect(this.player2).not.toBeAbleToSelect(this.troll);
            expect(this.player2).not.toBeAbleToSelect(this.dewFaerie);
            expect(this.player2).not.toBeAbleToSelect(this.brammo);
            this.player2.clickCard(this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
