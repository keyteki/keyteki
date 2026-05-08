describe('Incubation Chamber', function () {
    describe("Incubation Chamber's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['incubation-chamber', 'zorg'],
                    hand: [
                        'ether-spider',
                        'groggins',
                        'phloxem-spike',
                        'combat-pheromones',
                        'containment-field',
                        'collector-worm'
                    ]
                },
                player2: {
                    inPlay: ['mighty-tiger', 'hunting-witch'],
                    hand: ['foggify']
                }
            });
        });

        it('should be optional', function () {
            this.player1.useOmni(this.incubationChamber);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
        });

        it('should be able to archive a mars creature from hand', function () {
            this.player1.useOmni(this.incubationChamber);
            expect(this.player1).toBeAbleToSelect(this.etherSpider);
            expect(this.player1).toBeAbleToSelect(this.collectorWorm);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.groggins);
            expect(this.player1).not.toBeAbleToSelect(this.phloxemSpike);
            expect(this.player1).not.toBeAbleToSelect(this.combatPheromones);
            expect(this.player1).not.toBeAbleToSelect(this.containmentField);
            this.player1.clickCard(this.etherSpider);
            expect(this.etherSpider.location).toBe('archives');
            this.player1.endTurn();
        });

        it('should not do anything if no mars creatures in hand', function () {
            this.player1.moveCard(this.etherSpider, 'discard');
            this.player1.moveCard(this.collectorWorm, 'discard');
            this.player1.useOmni(this.incubationChamber);
            this.player1.endTurn();
        });
    });
});
