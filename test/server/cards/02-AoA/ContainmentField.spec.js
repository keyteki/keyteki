describe('Containment Field', function () {
    describe("Containment Field's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'mars',
                    hand: ['containment-field'],
                    inPlay: ['collector-worm', 'xanthyx-harvester']
                },
                player2: {
                    amber: 2,
                    inPlay: ['mother']
                }
            });
        });

        describe('when used to reap', function () {
            beforeEach(function () {
                this.player1.playUpgrade(this.containmentField, this.xanthyxHarvester);
                this.player1.reap(this.xanthyxHarvester);
            });

            it('should prompt for effect to trigger first', function () {
                expect(this.player1).toBeAbleToSelect(this.containmentField);
                expect(this.player1).toBeAbleToSelect(this.xanthyxHarvester);
            });

            it('should gain extra amber if Xanthyx Harvester ability is used first.', function () {
                this.player1.clickCard(this.xanthyxHarvester);

                expect(this.player1.amber).toBe(4);
                expect(this.xanthyxHarvester.location).toBe('discard');
            });

            it('should discard if Containment Field ability is used first.', function () {
                this.player1.clickCard(this.containmentField);

                expect(this.player1.amber).toBe(3);
                expect(this.xanthyxHarvester.location).toBe('discard');
            });
        });

        describe('when used to fight', function () {
            beforeEach(function () {
                this.player1.playUpgrade(this.containmentField, this.collectorWorm);
                this.player1.fightWith(this.collectorWorm, this.mother);
            });

            it('should prompt for effect to trigger first', function () {
                expect(this.player1).toBeAbleToSelect(this.containmentField);
                expect(this.player1).toBeAbleToSelect(this.collectorWorm);
            });

            it('should archive if Collector Worm ability is used first.', function () {
                expect(this.player1.archives.length).toBe(0);
                expect(this.player2.archives.length).toBe(0);

                this.player1.clickCard(this.collectorWorm);

                expect(this.player1.archives.length).toBe(1);
                expect(this.player2.archives.length).toBe(0);

                expect(this.collectorWorm.location).toBe('discard');
                expect(this.player2.player.cardsInPlay).not.toContain(this.mother);
                expect(this.mother.location).toBe('archives');
            });

            it('should discard if Containment Field ability is used first.', function () {
                expect(this.player1.archives.length).toBe(0);
                expect(this.player2.archives.length).toBe(0);

                this.player1.clickCard(this.containmentField);

                expect(this.player1.archives.length).toBe(0);
                expect(this.player2.archives.length).toBe(0);

                expect(this.collectorWorm.location).toBe('discard');
                expect(this.mother.location).toBe('play area');
            });
        });
    });
});
