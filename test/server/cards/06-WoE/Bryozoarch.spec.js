describe('Bryozoarch', function () {
    describe("Bryozoarch's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['labwork', 'batdrone', 'tribute'],
                    inPlay: ['high-priest-torvus']
                },
                player2: {
                    token: 'grumpus',
                    inPlay: ['skullback-crab', 'bryozoarch'],
                    hand: ['initiation', 'bryozoarch']
                }
            });
            this.bryozoarch2 = this.player2.player.hand[1];
        });

        it('should blank opponent actions', function () {
            this.player1.play(this.labwork);
            expect(this.player2.player.creaturesInPlay.length).toBe(1);
            expect(this.skullbackCrab.location).toBe('discard');
            expect(this.bryozoarch.location).toBe('play area');
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not blank my actions', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.play(this.initiation);
            this.player2.clickPrompt('Right');
            expect(this.player2.player.creaturesInPlay.length).toBe(3);
            this.expectReadyToTakeAction(this.player2);
        });

        xit('should not return actions via Torvus', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');

            this.player1.reap(this.highPriestTorvus);
            this.player1.clickCard(this.highPriestTorvus);
            this.player1.play(this.tribute);
            expect(this.player2.player.creaturesInPlay.length).toBe(1);
            expect(this.skullbackCrab.location).toBe('discard');
            expect(this.bryozoarch.location).toBe('play area');
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player1.amber).toBe(3);

            expect(this.tribute.location).toBe('discard');
        });

        it('should only cause one destroy with 2 Bryozoarchs out', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.playCreature(this.bryozoarch2);
            this.player2.endTurn();
            this.player1.clickPrompt('logos');

            this.player1.play(this.labwork);
            this.player1.clickCard(this.bryozoarch); // which Bryo interrupts?
            expect(this.player2.player.creaturesInPlay.length).toBe(2);
            expect(this.skullbackCrab.location).toBe('discard');
            expect(this.bryozoarch.location).toBe('play area');
            expect(this.bryozoarch2.location).toBe('play area');
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should resolve bonus icons before replacing the event', function () {
            this.labwork.enhancements = ['damage'];
            this.bryozoarch.tokens.damage = 5;
            this.player1.play(this.labwork);
            this.player1.clickCard(this.bryozoarch);
            this.player1.clickCard(this.tribute);
            expect(this.player2.player.creaturesInPlay.length).toBe(1);
            expect(this.bryozoarch.location).toBe('discard');
            expect(this.skullbackCrab.location).toBe('play area');
            expect(this.tribute.location).toBe('archives');
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player1.amber).toBe(2);
            expect(this.labwork.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
