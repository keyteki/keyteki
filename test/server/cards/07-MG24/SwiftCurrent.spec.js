describe('Swift Current', function () {
    describe("Swift Current's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    inPlay: [
                        'legendary-keyraken',
                        'swift-current',
                        'crushing-tentacle',
                        'grappling-tentacle',
                        'troll'
                    ]
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('each friendly tentacle captures 1 on action', function () {
            this.player1.clickCard(this.swiftCurrent);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.crushingTentacle.amber).toBe(1);
            expect(this.grapplingTentacle.amber).toBe(1);
            expect(this.legendaryKeyraken.amber).toBe(0);
            expect(this.troll.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
