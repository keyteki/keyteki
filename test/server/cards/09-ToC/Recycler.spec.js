describe('Recycler', function () {
    describe("Recycler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    token: 'minion',
                    inPlay: ['recycler'],
                    deck: new Array(12).fill('toad'),
                    discard: [
                        'dust-pixie',
                        'hunting-witch',
                        'full-moon',
                        'junk-restoration',
                        'plow-sword'
                    ]
                },
                player2: {
                    amber: 1
                }
            });

            this.minion1 = this.player1.player.deck[0];
            this.minion2 = this.player1.player.deck[1];
            this.minion3 = this.player1.player.deck[2];
        });

        it('should discard top 3 cards and make 1 token for 1 creature', function () {
            this.player1.moveCard(this.dustPixie, 'deck');
            this.player1.moveCard(this.fullMoon, 'deck');
            this.player1.moveCard(this.junkRestoration, 'deck');
            this.player1.reap(this.recycler);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.fullMoon.location).toBe('discard');
            expect(this.junkRestoration.location).toBe('discard');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.minion1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard top 3 cards and make 2 tokens for 2 creatures', function () {
            this.player1.moveCard(this.dustPixie, 'deck');
            this.player1.moveCard(this.fullMoon, 'deck');
            this.player1.moveCard(this.huntingWitch, 'deck');
            this.player1.reap(this.recycler);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.minion2);
            expect(this.player1.player.creaturesInPlay[1]).toBe(this.minion1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard top 3 cards and make 0 tokens for 0 creatures', function () {
            this.player1.moveCard(this.plowSword, 'deck');
            this.player1.moveCard(this.fullMoon, 'deck');
            this.player1.moveCard(this.junkRestoration, 'deck');
            this.player1.reap(this.recycler);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
