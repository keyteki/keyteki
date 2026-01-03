describe('Sacred Duty', function () {
    describe("Sacred Duty's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'redemption',
                    token: 'zealot',
                    hand: ['sacred-duty'],
                    inPlay: ['zealot:toad'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    amber: 1,
                    inPlay: ['old-bruno']
                }
            });

            this.zealot1 = this.player1.player.creaturesInPlay[0];
            this.zealot2 = this.player1.player.deck[0];
        });

        it('should give creature +2 power and ready it', function () {
            this.player1.reap(this.zealot1);
            this.player1.playUpgrade(this.sacredDuty, this.zealot1);
            expect(this.zealot1.getPower()).toBe(3);
            expect(this.zealot1.exhausted).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should give creature the ability to make a token on fight', function () {
            this.player1.playUpgrade(this.sacredDuty, this.zealot1);
            this.player1.fightWith(this.zealot1, this.oldBruno);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.zealot2.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
