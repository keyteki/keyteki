describe('Gleaming the Cube', function () {
    describe("Gleaming the Cube's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['gleaming-the-cube'],
                    inPlay: ['ember-imp']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'hunting-witch'],
                    discard: ['dust-pixie']
                }
            });

            this.player1.moveCard(this.dustPixie, 'deck');
        });

        it('should ready and use a friendly creature when played', function () {
            this.emberImp.exhausted = true;
            this.player1.play(this.gleamingTheCube);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.exhausted).toBe(false);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.emberImp.exhausted).toBe(true);
            expect(this.player1.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should discard top card and change active house when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.gleamingTheCube);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.gleamingTheCube.location).toBe('discard');
            this.player2.reap(this.huntingWitch);
            expect(this.player2.amber).toBe(6);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not change house if deck is empty', function () {
            this.player1.activateProphecy(this.overreach, this.gleamingTheCube);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.player.deck = [];
            this.player2.reap(this.krump);
            expect(this.gleamingTheCube.location).toBe('discard');
            this.player2.clickCard(this.huntingWitch);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
