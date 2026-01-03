describe('Recreational Jettison', function () {
    describe("Recreational Jettison's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    hand: ['recreational-jettison', 'dust-pixie', 'control-the-weak', 'gub'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 2
                }
            });

            this.controlTheWeak.enhancements = ['capture'];
        });

        it('should allow a discard and resolve of bonus icons', function () {
            this.player1.play(this.recreationalJettison);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.controlTheWeak);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should repeat if your yellow key is forged', function () {
            this.player1.player.keys = { red: false, blue: false, yellow: true };
            this.player1.play(this.recreationalJettison);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.controlTheWeak);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.controlTheWeak);
            this.player1.clickCard(this.flaxia);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(1);
            expect(this.flaxia.amber).toBe(1);
            expect(this.controlTheWeak.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should repeat if opponent yellow key is forged', function () {
            this.player2.player.keys = { red: false, blue: false, yellow: true };
            this.player1.play(this.recreationalJettison);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.controlTheWeak);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.controlTheWeak);
            this.player1.clickCard(this.flaxia);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(1);
            expect(this.flaxia.amber).toBe(1);
            expect(this.controlTheWeak.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
