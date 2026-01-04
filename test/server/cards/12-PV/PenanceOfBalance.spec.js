describe('Penance of Balance', function () {
    describe("Penance of Balance's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['penance-of-balance'],
                    inPlay: ['dust-pixie'],
                    amber: 0
                },
                player2: {
                    amber: 2,
                    inPlay: ['flaxia', 'krump', 'troll', 'helper-bot']
                }
            });
        });

        it('should not be playable if enemy creatures <= opponent amber', function () {
            this.player2.amber = 4;
            this.player1.play(this.penanceOfBalance);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should destroy X enemy creatures when that option is chosen', function () {
            this.player1.play(this.penanceOfBalance);
            this.player1.clickPrompt('Destroy enemy creatures');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');
            expect(this.flaxia.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.helperBot.location).toBe('play area');
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should make opponent lose X amber when that option is chosen', function () {
            this.player1.play(this.penanceOfBalance);
            this.player1.clickPrompt('Opponent loses amber');
            expect(this.player2.player.creaturesInPlay.length).toBe(4);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
