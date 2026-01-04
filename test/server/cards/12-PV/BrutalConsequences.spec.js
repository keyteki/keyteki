describe('Brutal Consequences', function () {
    describe("Brutal Consequences's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['brutal-consequences'],
                    inPlay: ['urchin', 'hunting-witch'],
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ]
                },
                player2: {
                    inPlay: ['krump', 'dust-pixie']
                }
            });
        });

        it('should deal 3 damage and purge if destroyed', function () {
            this.player1.play(this.brutalConsequences);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not purge if not destroyed', function () {
            this.player1.play(this.brutalConsequences);
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('play area');
            expect(this.krump.tokens.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should purge an exhausted friendly creature when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.brutalConsequences);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.player2).not.toBeAbleToSelect(this.urchin);
            expect(this.player2).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player2).toBeAbleToSelect(this.krump);
            expect(this.player2).not.toBeAbleToSelect(this.dustPixie);
            this.player2.clickCard(this.krump);
            expect(this.krump.location).toBe('purged');
            expect(this.brutalConsequences.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
