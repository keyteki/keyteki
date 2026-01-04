describe('Wild Bounty', function () {
    describe("Wild Bounty's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: [
                        'fertility-chant',
                        'dust-pixie',
                        'wild-bounty',
                        'reclaimed-by-nature',
                        'niffle-grounds'
                    ]
                },
                player2: {
                    inPlay: ['troll', 'flaxia'],
                    amber: 2
                }
            });
        });

        it('should not trigger twice before Wild Bounty is played', function () {
            this.player1.play(this.fertilityChant);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(4);
        });

        it('should trigger twice after Wild Bounty and resolve default bonus icons twice', function () {
            this.player1.play(this.wildBounty);
            expect(this.player1.amber).toBe(0);
            this.player1.play(this.fertilityChant);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(8);
            expect(this.player2.amber).toBe(4);
        });

        it('should trigger twice only for the immediate next card', function () {
            this.player1.play(this.wildBounty);
            expect(this.player1.amber).toBe(0);
            this.player1.play(this.fertilityChant);
            this.player1.play(this.dustPixie);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(10);
            expect(this.player2.amber).toBe(4);
        });

        it('should not trigger twice , twice,  if card played is returned to hand', function () {
            this.player1.play(this.wildBounty);
            expect(this.player1.amber).toBe(0);
            this.player1.play(this.fertilityChant);
            expect(this.player1.amber).toBe(8);
            this.player1.moveCard(this.fertilityChant, 'hand');
            this.player1.play(this.fertilityChant);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(12);
            expect(this.player2.amber).toBe(6);
        });

        it('should reveal a card and apply enhanced bonus icons twice', function () {
            this.dustPixie.enhancements = ['amber', 'draw', 'damage'];
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
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(6);
            expect(this.player1.player.hand.length).toBe(5);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.player2.amber).toBe(2);
        });

        it('should not trigger twice if resolving the same card bonus icons due to another effect', function () {
            this.player1.play(this.wildBounty);
            expect(this.player1.amber).toBe(0);
            this.player1.play(this.niffleGrounds);
            expect(this.player1.amber).toBe(2);
            this.player1.play(this.reclaimedByNature);
            this.player1.clickCard(this.niffleGrounds);
            expect(this.player1.amber).toBe(4);
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

            this.wildBounty2.enhancements = ['amber', 'draw'];
            this.player1.play(this.wildBounty2);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1.player.hand.length).toBe(4);

            this.player1.play(this.fertilityChant);
            expect(this.player1.amber).toBe(10);
            expect(this.player2.amber).toBe(4);

            this.player1.play(this.dustPixie);

            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(12);
            expect(this.player2.amber).toBe(4);
        });
    });

    describe("Wild Bounty's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['wild-bounty', 'wild-wormhole', 'interdimensional-graft', 'data-forge'],
                    amber: 0
                },
                player2: {
                    inPlay: ['troll', 'flaxia'],
                    amber: 2
                }
            });

            this.player1.moveCard(this.wildBounty, 'deck');
        });

        it('should not trigger by previous action played (Wild Wormhole)', function () {
            this.player1.play(this.wildWormhole);
            expect(this.wildBounty.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);

            this.player1.play(this.interdimensionalGraft);
            expect(this.player1.amber).toBe(3);
            this.player1.play(this.dataForge);
            expect(this.player1.amber).toBe(4);

            expect(this.player1).isReadyToTakeAction();
        });
    });
});
