describe('Pile of Skulls', function () {
    describe("Pile of Skulls's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 0,
                    hand: ['coward-s-end'],
                    inPlay: [
                        'pile-of-skulls',
                        'flamethrower',
                        'krump',
                        'bumpsy',
                        'overlord-greking'
                    ]
                },
                player2: {
                    amber: 3,
                    inPlay: ['mighty-tiger', 'hunting-witch', 'bloodshard-imp']
                }
            });
        });

        it('should capture 1 amber for every enemy creature destroyed [3]', function () {
            this.player1.clickCard(this.flamethrower);
            this.player1.clickPrompt("Use this card's action ability");
            this.player1.clickCard(this.bumpsy);
            this.player1.play(this.cowardSEnd);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.pileOfSkulls);
            this.player1.clickCard(this.pileOfSkulls);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.bloodshardImp);
            this.player1.clickCard(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.overlordGreking);
            this.player1.clickCard(this.krump);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.pileOfSkulls);
            this.player1.clickCard(this.pileOfSkulls);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.bloodshardImp);
            this.player1.clickCard(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.overlordGreking);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.overlordGreking);
            this.player1.clickCard(this.overlordGreking);
            expect(this.player2.amber).toBe(0);
            expect(this.krump.tokens.amber).toBe(1);
            expect(this.bumpsy.tokens.amber).toBe(1);
            expect(this.overlordGreking.tokens.amber).toBe(1);
        });

        it('should allow the same creature to capture mutliple amber', function () {
            this.player1.clickCard(this.flamethrower);
            this.player1.clickPrompt("Use this card's action ability");
            this.player1.clickCard(this.krump);
            this.player1.play(this.cowardSEnd);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.pileOfSkulls);
            this.player1.clickCard(this.pileOfSkulls);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.bloodshardImp);
            this.player1.clickCard(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.krump);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.pileOfSkulls);
            this.player1.clickCard(this.pileOfSkulls);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.bloodshardImp);
            this.player1.clickCard(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.bumpsy);
            expect(this.player2.amber).toBe(0);
            expect(this.krump.tokens.amber).toBe(1);
            expect(this.bumpsy.tokens.amber).toBe(2);
        });
    });
});
