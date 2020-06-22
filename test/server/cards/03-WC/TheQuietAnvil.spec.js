describe('The Quiet Anvil', function () {
    describe("The Quiet Anvil's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'shadows',
                    inPlay: ['the-quiet-anvil', 'bad-penny'],
                    hand: [
                        'manchego',
                        'mother',
                        'batdrone',
                        'wild-wormhole',
                        'hexpion',
                        'dextre',
                        'titan-mechanic',
                        'doc-bookton'
                    ]
                },
                player2: {
                    amber: 2,
                    inPlay: ['krump']
                }
            });
        });
        it('should reduce key cost by 2A while in play and destroy itself when a key is forged (player side)', function () {
            this.player1.reap(this.badPenny);
            expect(this.player1.amber).toBe(4);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.theQuietAnvil.location).toBe('discard');
        });
        it('should reduce key cost by 2A while in play and destroy itself when a key is forged (opponent side)', function () {
            this.player1.reap(this.badPenny);
            expect(this.player1.amber).toBe(4);
            this.player2.amber = 4;
            this.player1.endTurn();
            this.player2.clickPrompt('blue');
            this.player2.clickPrompt('brobnar');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.theQuietAnvil.location).toBe('discard');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(4);
        });
    });
});
