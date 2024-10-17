describe('Uxlyx the Zookeeper', function () {
    describe("Uxlyx the Zookeeper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['uxlyx-the-zookeeper', 'urchin'],
                    hand: ['mothership-support']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
        });

        it('should trigger when Uxlyx reaps', function () {
            this.player1.reap(this.uxlyxTheZookeeper);
            expect(this.player1).toHavePrompt('Uxlyx the Zookeeper');
            expect(this.player1).not.toBeAbleToSelect(this.uxlyxTheZookeeper);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('archives');
            expect(this.player1.archives).toContain(this.batdrone);
        });

        it('should not trigger when there are no enemy creatures', function () {
            this.player1.play(this.mothershipSupport);
            expect(this.player1).toHavePrompt('Mothership Support');
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            this.player1.reap(this.uxlyxTheZookeeper);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should return creatures to their owner's hand", function () {
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.batdrone);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            expect(this.player1).toHavePrompt('Access Archives');
            this.player1.clickPrompt('Yes');
            expect(this.batdrone.location).toBe('hand');
            expect(this.player2.hand).toContain(this.batdrone);
        });
    });
});
