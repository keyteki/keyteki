describe('Gate Warden', function () {
    describe("Gate Warden's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    token: 'catena-fiend',
                    hand: ['gate-warden'],
                    inPlay: ['gub'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    token: 'prospector',
                    inPlay: ['krump', 'troll', 'prospector:toad']
                }
            });

            this.toad1 = this.player1.player.deck[0];
        });

        it('should make a token on play', function () {
            this.player1.playCreature(this.gateWarden);
            this.player1.clickPrompt('Left');
            expect(this.toad1.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.toad1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should prevent opponent reaps while you have a token', function () {
            this.player1.playCreature(this.gateWarden);
            this.player1.clickPrompt('Right');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.krump);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
            this.player2.clickPrompt('Cancel');
            this.player2.fightWith(this.troll, this.toad1);
            this.player2.reap(this.krump);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not prevent own reaps while you have a token', function () {
            this.player1.playCreature(this.gateWarden);
            this.player1.clickPrompt('Left');
            this.player1.reap(this.gub);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
