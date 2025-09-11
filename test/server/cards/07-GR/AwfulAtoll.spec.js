describe('Awful Atoll', function () {
    describe("Awful Atoll's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'unfathomable',
                    hand: ['awful-atoll', 'crushing-deep'],
                    inPlay: ['bubbles'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    hand: ['gateway-to-dis'],
                    inPlay: ['troll', 'batdrone', 'gron-nine-toes', 'flamethrower'],
                    discard: new Array(10).fill('poke') // already haunted
                }
            });
        });

        it('gives -2 power for creatures controller by haunted players', function () {
            this.player1.play(this.awfulAtoll);
            expect(this.bubbles.power).toBe(5);
            expect(this.troll.power).toBe(6);
            expect(this.gronNineToes.power).toBe(3);
            expect(this.batdrone.location).toBe('discard');
            this.player1.play(this.crushingDeep);
            expect(this.bubbles.power).toBe(3);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.useAction(this.flamethrower);
            this.player2.clickCard(this.gronNineToes);
            expect(this.gronNineToes.power).toBe(7);
        });

        it('self-destructs with no creatures in play', function () {
            this.player1.play(this.awfulAtoll);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.gatewayToDis);
            expect(this.awfulAtoll.location).toBe('discard');
        });
    });
});
