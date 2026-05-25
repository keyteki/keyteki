describe('Custom Virus', function () {
    describe("Custom Virus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['custom-virus', 'zorg'],
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
            this.player1.useOmni(this.customVirus);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
        });

        it('should be able to purge a card from hand, but not destroy if no creatures with same trait', function () {
            this.player1.useOmni(this.customVirus);
            expect(this.player1).toBeAbleToSelect(this.etherSpider);
            expect(this.player1).toBeAbleToSelect(this.collectorWorm);
            expect(this.player1).toBeAbleToSelect(this.groggins);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.phloxemSpike);
            expect(this.player1).not.toBeAbleToSelect(this.combatPheromones);
            expect(this.player1).not.toBeAbleToSelect(this.containmentField);
            this.player1.clickCard(this.groggins);
            expect(this.groggins.location).toBe('purged');
            expect(this.zorg.location).toBe('play area');
            expect(this.mightyTiger.location).toBe('play area');
            expect(this.huntingWitch.location).toBe('play area');

            this.player1.endTurn();
        });

        it('should be able to purge a card from hand and destroy creatures with same trait', function () {
            this.player1.useOmni(this.customVirus);
            expect(this.player1).toBeAbleToSelect(this.etherSpider);
            expect(this.player1).toBeAbleToSelect(this.collectorWorm);
            expect(this.player1).toBeAbleToSelect(this.groggins);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.phloxemSpike);
            expect(this.player1).not.toBeAbleToSelect(this.combatPheromones);
            expect(this.player1).not.toBeAbleToSelect(this.containmentField);
            this.player1.clickCard(this.collectorWorm);
            expect(this.collectorWorm.location).toBe('purged');
            expect(this.zorg.location).toBe('discard');
            expect(this.mightyTiger.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('play area');

            this.player1.endTurn();
        });

        it('should not do anything if no creatures in hand', function () {
            this.player1.moveCard(this.etherSpider, 'discard');
            this.player1.moveCard(this.collectorWorm, 'discard');
            this.player1.moveCard(this.groggins, 'discard');
            this.player1.useOmni(this.customVirus);
            expect(this.zorg.location).toBe('play area');
            expect(this.mightyTiger.location).toBe('play area');
            expect(this.huntingWitch.location).toBe('play area');
            this.player1.endTurn();
        });
    });

    describe('when warded after becoming a creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['custom-virus', 'animator', 'doc-bookton'],
                    hand: ['dextre']
                },
                player2: {}
            });
        });

        it('still purges but does not destroy creatures sharing a trait when ward prevents Custom Virus from being destroyed', function () {
            this.player1.useAction(this.animator);
            this.player1.clickCard(this.customVirus);
            this.player1.clickPrompt('Left');
            expect(this.customVirus.type).toBe('creature');
            this.customVirus.ward();
            this.player1.useOmni(this.customVirus);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.location).toBe('purged');
            expect(this.customVirus.location).toBe('play area');
            expect(this.customVirus.warded).toBe(false);
            expect(this.docBookton.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
