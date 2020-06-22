describe('Wild Bounty', function () {
    describe("Wild Bounty's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['fertility-chant', 'dust-pixie', 'wild-bounty']
                },
                player2: {
                    inPlay: ['troll', 'flaxia'],
                    amber: 2
                }
            });
        });

        it('should not trigger twice before Wild Bounty is played', function () {
            this.player1.play(this.fertilityChant);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(4);
        });

        it('should trigger twice after Wild Bounty and resolve default bonus icons twice', function () {
            this.player1.play(this.wildBounty);
            expect(this.player1.amber).toBe(0);
            this.player1.play(this.fertilityChant);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickPrompt('Wild Bounty');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(8);
            expect(this.player2.amber).toBe(4);
        });

        it('should trigger twice only for the immediate next card', function () {
            this.player1.play(this.wildBounty);
            expect(this.player1.amber).toBe(0);
            this.player1.play(this.fertilityChant);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickPrompt('Wild Bounty');
            this.player1.play(this.dustPixie);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(10);
            expect(this.player2.amber).toBe(4);
        });

        it('should reveal a card and apply enhanced bonus icons twice', function () {
            this.dustPixie.cardData.enhancements = ['amber', 'draw', 'damage'];
            this.player1.play(this.wildBounty);
            expect(this.player1.amber).toBe(0);
            this.player1.play(this.dustPixie);
            expect(this.player1).toHavePrompt('Choose a creature to damage due to bonus icon');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Choose a creature to damage due to bonus icon');
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(6);
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.player2.amber).toBe(2);
        });
    });

    describe("Wild Bounty's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['fertility-chant', 'dust-pixie', 'wild-bounty', 'wild-bounty'],
                    amber: 0
                },
                player2: {
                    inPlay: ['troll', 'flaxia'],
                    amber: 2
                }
            });

            this.wildBounty1 = this.player1.player.hand[2];
            this.wildBounty2 = this.player1.player.hand[3];
        });

        it('should trigger twice after second wildBounty1 is played and twice after card played after wildBounty2, third card resolve bonus once', function () {
            this.player1.play(this.wildBounty1);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.player1.player.hand.length).toBe(3);

            this.wildBounty2.cardData.enhancements = ['amber', 'draw'];
            this.player1.play(this.wildBounty2);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickPrompt('Wild Bounty');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1.player.hand.length).toBe(4);

            this.player1.play(this.fertilityChant);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickPrompt('Wild Bounty');
            expect(this.player1.amber).toBe(10);
            expect(this.player2.amber).toBe(4);

            this.player1.play(this.dustPixie);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(12);
            expect(this.player2.amber).toBe(4);
        });
    });
});
