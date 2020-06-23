describe('Xenotraining', function () {
    describe("Xenotraining's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'staralliance',
                    hand: ['xenotraining'],
                    inPlay: ['lieutenant-khrkhar']
                },
                player2: {
                    amber: 6,
                    hand: ['remote-access']
                }
            });
        });
        it('should prompt to capture [1] when it is played', function () {
            this.player1.play(this.xenotraining);
            expect(this.player1).toHavePrompt('Xenotraining');
            expect(this.player1).toBeAbleToSelect(this.lieutenantKhrkhar);
            this.player1.clickCard(this.lieutenantKhrkhar);
            expect(this.player2.player.amber).toBe(5);
            expect(this.lieutenantKhrkhar.tokens.amber).toBe(1);
        });
    });
    describe("Xenotraining's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'staralliance',
                    hand: ['xenotraining'],
                    inPlay: ['lieutenant-khrkhar', 'mother']
                },
                player2: {
                    amber: 6,
                    hand: ['remote-access']
                }
            });
        });
        it('should prompt to capture [2] when it is played', function () {
            this.player1.play(this.xenotraining);
            expect(this.player1).toHavePrompt('Xenotraining');
            expect(this.player1).toBeAbleToSelect(this.lieutenantKhrkhar);
            expect(this.player1).toBeAbleToSelect(this.mother);
            this.player1.clickCard(this.lieutenantKhrkhar);
            this.player1.clickCard(this.mother);
            expect(this.player2.player.amber).toBe(4);
            expect(this.lieutenantKhrkhar.tokens.amber).toBe(1);
            expect(this.mother.tokens.amber).toBe(1);
        });
    });
    describe("Xenotraining's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'staralliance',
                    hand: ['xenotraining'],
                    inPlay: ['lieutenant-khrkhar', 'mother', 'rustgnawer']
                },
                player2: {
                    amber: 6,
                    hand: ['remote-access']
                }
            });
        });
        it('should prompt to capture [3] when it is played', function () {
            this.player1.play(this.xenotraining);
            expect(this.player1).toHavePrompt('Xenotraining');
            expect(this.player1).toBeAbleToSelect(this.lieutenantKhrkhar);
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.rustgnawer);
            this.player1.clickCard(this.lieutenantKhrkhar);
            this.player1.clickCard(this.mother);
            this.player1.clickCard(this.rustgnawer);
            expect(this.player2.player.amber).toBe(3);
            expect(this.lieutenantKhrkhar.tokens.amber).toBe(1);
            expect(this.mother.tokens.amber).toBe(1);
            expect(this.rustgnawer.tokens.amber).toBe(1);
        });
        it('you should be able to capture all aember onto one creature', function () {
            this.player1.play(this.xenotraining);
            expect(this.player1).toHavePrompt('Xenotraining');
            expect(this.player1).toBeAbleToSelect(this.lieutenantKhrkhar);
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.rustgnawer);
            this.player1.clickCard(this.mother);
            this.player1.clickCard(this.mother);
            this.player1.clickCard(this.mother);
            expect(this.player2.player.amber).toBe(3);
            expect(this.mother.tokens.amber).toBe(3);
        });
    });
});
