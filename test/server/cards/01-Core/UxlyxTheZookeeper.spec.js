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
            expect(this.player1).isReadyToTakeAction();
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

    describe('Uxlyx the Zookeeper with Murkens', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['uxlyx-the-zookeeper'],
                    hand: ['scowly-caper']
                },
                player2: {
                    inPlay: ['ember-imp'],
                    hand: ['murkens']
                }
            });
            this.player1.makeMaverick(this.scowlyCaper, 'mars');
        });

        it("should return unowned creature to owner's hand when Murkens tries to play it from archives", function () {
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.emberImp);
            expect(this.player1.archives).toContain(this.emberImp);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.playCreature(this.murkens);
            this.player2.clickPrompt('Random card from archives');
            expect(this.player2.hand).toContain(this.emberImp);
            expect(this.player2.discard).not.toContain(this.emberImp);
            expect(this.player1.archives).not.toContain(this.emberImp);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should return owned creature to hand when Murkens tries to play it from archives', function () {
            this.player1.playCreature(this.scowlyCaper);
            expect(this.scowlyCaper.controller).toBe(this.player2.player);
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.scowlyCaper);
            expect(this.player1.archives).toContain(this.scowlyCaper);
            expect(this.player1).isReadyToTakeAction();
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.playCreature(this.murkens);
            this.player2.clickPrompt('Random card from archives');
            expect(this.player1.archives).not.toContain(this.scowlyCaper);
            expect(this.player1.hand).toContain(this.scowlyCaper);
            expect(this.player2.battleline).not.toContain(this.scowlyCaper);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
