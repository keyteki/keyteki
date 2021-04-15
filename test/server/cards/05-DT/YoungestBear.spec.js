describe('Youngest Bear', function () {
    describe("Youngest Bear's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: [
                        'commander-chan',
                        'mighty-tiger',
                        'grabber-jammer',
                        'youngest-bear',
                        'dust-pixie'
                    ]
                },
                player2: {
                    inPlay: ['commander-remiel', 'commander-chan', 'lieutenant-khrkhar']
                }
            });
        });
        it('should allow using friendly neighbor creature when you reap', function () {
            this.player1.reap(this.youngestBear);
            expect(this.player1).toHavePrompt('Youngest Bear');
            expect(this.player1).toBeAbleToSelect(this.grabberJammer);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.mightyTiger);
            this.player1.clickCard(this.grabberJammer);
            expect(this.player1.amber).toBe(2);
        });

        it('should not allow using friendly neighbor that is exhausted', function () {
            this.player1.reap(this.dustPixie);
            this.player1.reap(this.youngestBear);
            expect(this.player1).toHavePrompt('Youngest Bear');
            expect(this.player1).toBeAbleToSelect(this.grabberJammer);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.mightyTiger);
            this.player1.clickCard(this.grabberJammer);
            expect(this.player1.amber).toBe(3);
        });

        it('should be optional to use friendly neighbor creature when you reap', function () {
            this.player1.reap(this.youngestBear);
            expect(this.player1).toHavePrompt('Youngest Bear');
            expect(this.player1).toBeAbleToSelect(this.grabberJammer);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(1);
        });
    });
});
