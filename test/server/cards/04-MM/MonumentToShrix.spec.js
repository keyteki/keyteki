describe('Monument to Shrix', function () {
    describe("Monument to Shrix's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['monument-to-shrix', 'bad-penny', 'citizen-shrix', 'galeatops'],
                    hand: ['chant-of-hubris']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll'],
                    hand: ['poltergeist']
                }
            });
        });

        it('should not transfer amber since owner has no amber', function () {
            this.player1.useAction(this.monumentToShrix);
            expect(this.player1.amber).toBe(0);
            expect(this.monumentToShrix.amber).toBe(0);
        });

        it('should transfer 1A when Citizen Shrix is not on discard', function () {
            this.player1.reap(this.galeatops);
            expect(this.player1.amber).toBe(1);
            this.player1.useAction(this.monumentToShrix);
            expect(this.player1.amber).toBe(0);
            expect(this.monumentToShrix.amber).toBe(1);
        });

        it('should prompt to select player if Citizen Shrix is on discard', function () {
            this.player1.player.moveCard(this.citizenShrix, 'discard');
            this.player1.reap(this.galeatops);
            expect(this.player1.amber).toBe(1);
            this.player1.useAction(this.monumentToShrix);
            expect(this.player1).toHavePromptButton('Mine');
            expect(this.player1).toHavePromptButton("Opponent's");
        });

        it('should be able to select from Mine if CS is on discard, even if my amber is 0', function () {
            this.player1.player.moveCard(this.citizenShrix, 'discard');
            this.player1.useAction(this.monumentToShrix);
            this.player1.clickPrompt('Mine');
            expect(this.player1.amber).toBe(0);
            expect(this.monumentToShrix.amber).toBe(0);
        });

        it('should be able to select from Mine if CS is on discard, if my amber is not zero', function () {
            this.player1.player.moveCard(this.citizenShrix, 'discard');
            this.player1.reap(this.galeatops);
            expect(this.player1.amber).toBe(1);
            this.player1.useAction(this.monumentToShrix);
            this.player1.clickPrompt('Mine');
            expect(this.player1.amber).toBe(0);
            expect(this.monumentToShrix.amber).toBe(1);
        });

        it('should be able to select from Opponent if CS is on discard', function () {
            this.player1.player.moveCard(this.citizenShrix, 'discard');
            this.player1.reap(this.galeatops);
            this.player1.useAction(this.monumentToShrix);
            this.player1.clickPrompt("Opponent's");
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            expect(this.monumentToShrix.amber).toBe(1);
        });

        it("should work with Poltergeist and not consider opponent's discard", function () {
            this.player1.player.moveCard(this.citizenShrix, 'discard');
            this.player1.reap(this.galeatops);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.poltergeist);
            this.player2.clickCard(this.monumentToShrix);
            expect(this.monumentToShrix.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });
    });

    describe("Monument to Shrix's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['bad-penny', 'citizen-shrix', 'galeatops'],
                    hand: ['chant-of-hubris']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'monument-to-shrix'],
                    hand: ['poltergeist']
                }
            });

            this.monumentToShrix.tokens.amber = 3;
        });

        it('should be able to use amber on monument', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('3');
            this.player2.clickPrompt('red');
            expect(this.player2.amber).toBe(1);
        });
    });
});
