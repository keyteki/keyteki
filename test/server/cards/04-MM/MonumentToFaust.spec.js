describe('Monument to Faust', function () {
    describe("Monument to Faust's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    inPlay: ['monument-to-faust', 'bad-penny', 'faust-the-great'],
                    hand: ['chant-of-hubris']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll'],
                    hand: ['poltergeist']
                }
            });
        });

        it('should increase key cost when Faust The Great is not in discard', function () {
            this.player1.useAction(this.monumentToFaust);
            this.player1.endTurn();
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(7);
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
        });

        it('should capture 2 amber from selected creature when octavia is in discard', function () {
            this.player1.player.moveCard(this.faustTheGreat, 'discard');
            this.player1.useAction(this.monumentToFaust);
            this.player1.endTurn();
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(8);
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
        });

        it("should work with Poltergeist and not consider opponent's discard", function () {
            this.player1.player.moveCard(this.faustTheGreat, 'discard');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.poltergeist);
            this.player2.clickCard(this.monumentToFaust);
            expect(this.player1.player.getCurrentKeyCost()).toBe(7);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            expect(this.monumentToFaust.location).toBe('discard');
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
            this.player1.endTurn();
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
        });
    });
});
