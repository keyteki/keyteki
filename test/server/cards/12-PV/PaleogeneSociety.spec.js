describe('Paleogene Society', function () {
    describe("Paleogene Society's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['paleogene-society'],
                    inPlay: ['orator-hissaro', 'umbra'],
                    discard: ['urchin', 'hunting-witch', 'nerve-blast']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'dust-pixie', 'ember-imp'],
                    discard: ['anger']
                }
            });
        });

        it('should return a card from discard to hand and purge itself', function () {
            this.player1.play(this.paleogeneSociety);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.nerveBlast);
            expect(this.player1).not.toBeAbleToSelect(this.anger);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('hand');
            expect(this.paleogeneSociety.location).toBe('purged');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should ward each enemy creature on fate', function () {
            this.player1.activateProphecy(this.overreach, this.paleogeneSociety);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.oratorHissaro.warded).toBe(true);
            expect(this.umbra.warded).toBe(true);
            expect(this.krump.warded).toBe(false);
            expect(this.dustPixie.warded).toBe(false);
            expect(this.emberImp.warded).toBe(false);
            expect(this.paleogeneSociety.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
