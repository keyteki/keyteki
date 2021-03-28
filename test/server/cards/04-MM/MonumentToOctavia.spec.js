describe('Monument to Octavia', function () {
    describe("Monument to Octavia's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 2,
                    inPlay: ['monument-to-octavia', 'bad-penny', 'cornicen-octavia'],
                    hand: ['chant-of-hubris']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll'],
                    hand: ['poltergeist']
                }
            });
        });

        it('should prompt for a creature when activated', function () {
            this.player1.useAction(this.monumentToOctavia);

            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.cornicenOctavia);
            expect(this.player1).toBeAbleToSelect(this.badPenny);
            expect(this.player1).not.toBeAbleToSelect(this.monumentToOctavia);
        });

        it('should capture 1 amber from selected creature when octavia is not in discard', function () {
            this.player1.useAction(this.monumentToOctavia);
            this.player1.clickCard(this.badPenny);

            expect(this.badPenny.tokens.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });

        it('should capture 2 amber from selected creature when octavia is in discard', function () {
            this.player1.player.moveCard(this.cornicenOctavia, 'discard');
            this.player1.useAction(this.monumentToOctavia);
            this.player1.clickCard(this.badPenny);

            expect(this.badPenny.tokens.amber).toBe(2);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
        });

        it("should work with Poltergeist and not consider opponent's discard", function () {
            this.player1.player.moveCard(this.cornicenOctavia, 'discard');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.poltergeist);
            this.player2.clickCard(this.monumentToOctavia);

            expect(this.player2).toBeAbleToSelect(this.troll);
            expect(this.player2).not.toBeAbleToSelect(this.badPenny);

            this.player2.clickCard(this.troll);
            expect(this.monumentToOctavia.location).toBe('discard');

            expect(this.troll.tokens.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(5);
        });
    });
});
