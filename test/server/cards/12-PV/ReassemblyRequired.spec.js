describe('Reassembly Required', function () {
    describe("Reassembly Required's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['reassembly-required'],
                    inPlay: ['helper-bot', 'flaxia']
                },
                player2: {
                    inPlay: ['ember-imp'],
                    archives: ['poke', 'batdrone']
                }
            });
        });

        it('should archive a creature when played', function () {
            this.player1.play(this.reassemblyRequired);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.location).toBe('archives');
            expect(this.player1.archives).toContain(this.helperBot);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should discard archives when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.reassemblyRequired);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.clickPrompt('No');
            this.player2.reap(this.emberImp);
            expect(this.poke.location).toBe('discard');
            expect(this.batdrone.location).toBe('discard');
            expect(this.reassemblyRequired.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
