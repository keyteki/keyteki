describe('Neotechnic Gopher', function () {
    describe("Neotechnic Gopher's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['neotechnic-gopher', 'flaxia', 'batdrone'],
                    inPlay: ['helper-bot']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump']
                }
            });
        });

        it('should discard a card when played', function () {
            this.player1.playCreature(this.neotechnicGopher);
            expect(this.player1).toHavePrompt('Choose a card to discard');
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1.amber).toBe(2); // No amber gain since hand not empty
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain 1 amber when played with no cards in hand', function () {
            this.player1.moveCard(this.flaxia, 'discard');
            this.player1.playCreature(this.neotechnicGopher);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard a card when reaping', function () {
            this.player1.moveCard(this.neotechnicGopher, 'play area');
            this.neotechnicGopher.exhausted = false;
            this.player1.reap(this.neotechnicGopher);
            expect(this.player1).toHavePrompt('Choose a card to discard');
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1.amber).toBe(3); // 1 from reap, no bonus since hand not empty
            expect(this.player1).isReadyToTakeAction();
        });

        it('should make opponent draw a card when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.neotechnicGopher);
            this.player1.endTurn();
            let p1HandLength = this.player1.hand.length;
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.player1.hand.length).toBe(p1HandLength + 1);
            expect(this.neotechnicGopher.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
