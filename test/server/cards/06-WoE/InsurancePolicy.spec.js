describe('Insurance Policy', function () {
    describe("Insurance Policy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'ekwidon',
                    inPlay: ['antiquities-dealer', 'troll'],
                    hand: ['insurance-policy', 'insurance-policy']
                },
                player2: {
                    amber: 3,
                    inPlay: ['bumpsy'],
                    hand: ['collar-of-subordination']
                }
            });
        });

        it('should cause player to lose an amber and not gain amber on destroyed', function () {
            this.player1.playUpgrade(this.insurancePolicy, this.antiquitiesDealer);
            expect(this.player1.amber).toBe(1);
            this.player1.fightWith(this.antiquitiesDealer, this.bumpsy);
            expect(this.antiquitiesDealer.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
        });

        it('should cause player to lose an amber and gain amber on destroyed on next turn', function () {
            this.player1.playUpgrade(this.insurancePolicy, this.antiquitiesDealer);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.bumpsy, this.antiquitiesDealer);
            expect(this.antiquitiesDealer.location).toBe('discard');
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(3);
        });

        it('should stack', function () {
            this.insurancePolicy2 = this.player1.hand[1];
            this.player1.playUpgrade(this.insurancePolicy, this.antiquitiesDealer);
            this.player1.playUpgrade(this.insurancePolicy2, this.antiquitiesDealer);
            expect(this.player1.amber).toBe(0);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.bumpsy, this.antiquitiesDealer);
            this.player2.clickPrompt('Autoresolve');
            expect(this.antiquitiesDealer.location).toBe('discard');
            expect(this.player1.amber).toBe(8);
        });

        it('should fire for current controller', function () {
            this.player1.playUpgrade(this.insurancePolicy, this.antiquitiesDealer);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.playUpgrade(this.collarOfSubordination, this.antiquitiesDealer);
            this.player2.clickPrompt('Left');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.fightWith(this.troll, this.antiquitiesDealer);
            expect(this.antiquitiesDealer.location).toBe('discard');
            expect(this.player2.amber).toBe(7);
        });
    });
});
