describe('Circlespeak', function () {
    describe("Circlespeak's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'unfathomable',
                    hand: ['circlespeak', 'crushing-deep'],
                    inPlay: ['bubbles'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 3,
                    inPlay: ['batdrone', 'flaxia'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
        });

        it('captures nothing onto enemy creature if no player is haunted', function () {
            this.player1.play(this.circlespeak);
            expect(this.player1).toBeAbleToSelect(this.bubbles);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
            expect(this.flaxia.tokens.amber).toBe(undefined);
            this.expectReadyToTakeAction(this.player1);
        });

        it('captures nothing onto friendly creature if no player is haunted', function () {
            this.player1.play(this.circlespeak);
            this.player1.clickCard(this.bubbles);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
            expect(this.bubbles.tokens.amber).toBe(undefined);
            this.expectReadyToTakeAction(this.player1);
        });

        it('captures 2 onto enemy creature if one player is haunted', function () {
            this.player1.fightWith(this.bubbles, this.batdrone);
            this.player1.play(this.circlespeak);
            this.player1.clickCard(this.flaxia);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
            expect(this.flaxia.tokens.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('captures 2 onto friendly creature if one player is haunted', function () {
            this.player1.fightWith(this.bubbles, this.batdrone);
            this.player1.play(this.circlespeak);
            this.player1.clickCard(this.bubbles);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
            expect(this.bubbles.tokens.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('captures 4 onto enemy creature if both players are haunted', function () {
            this.player1.fightWith(this.bubbles, this.batdrone);
            this.player1.play(this.crushingDeep);
            this.player1.play(this.circlespeak);
            this.player1.clickCard(this.flaxia);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.flaxia.tokens.amber).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });

        it('captures 4 onto friendly creature if both players are haunted', function () {
            this.player1.fightWith(this.bubbles, this.batdrone);
            this.player1.play(this.crushingDeep);
            this.player1.play(this.circlespeak);
            this.player1.clickCard(this.bubbles);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.bubbles.tokens.amber).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
