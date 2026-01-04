describe('Windrow Composting', function () {
    describe("Windrow Composting's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['windrow-composting'],
                    discard: ['echofly', 'dust-pixie', 'ecto-charge']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump'],
                    discard: ['lamindra', 'island-of-misfit-toys']
                }
            });
        });

        it('should shuffle a card from discard into deck when played', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));

            this.player1.play(this.windrowComposting);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.ectoCharge);
            this.player1.clickCard(this.echofly);
            expect(this.echofly.location).toBe('deck');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.ectoCharge.location).toBe('discard');
            expect(shuffled).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should shuffle both players discard piles into their decks when fate is triggered', function () {
            let shuffled = [];
            this.player1.player.game.on('onDeckShuffled', (event) => shuffled.push(event.player));

            this.player1.activateProphecy(this.overreach, this.windrowComposting);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.echofly.location).toBe('deck');
            expect(this.dustPixie.location).toBe('deck');
            expect(this.ectoCharge.location).toBe('deck');
            expect(this.lamindra.location).toBe('deck');
            expect(this.islandOfMisfitToys.location).toBe('deck');
            expect(this.windrowComposting.location).toBe('discard');
            expect(shuffled).toContain(this.player1.player);
            expect(shuffled).toContain(this.player2.player);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
