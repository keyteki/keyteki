describe('Kartanoo', function () {
    describe("Kartanoo's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['kartanoo', 'medic-ingram', 'hologrammophone', 'transporter-platform']
                },
                player2: {
                    inPlay: ['troll', 'cannon']
                }
            });
        });

        it('should allow using own artifact', function () {
            this.player1.reap(this.kartanoo);
            expect(this.player1).toBeAbleToSelect(this.hologrammophone);
            expect(this.player1).toBeAbleToSelect(this.transporterPlatform);
            this.player1.clickCard(this.hologrammophone);
            this.player1.clickCard(this.kartanoo);
            expect(this.kartanoo.tokens.ward).toBe(1);
        });

        it("should allow using opponent's artifact", function () {
            this.player1.reap(this.kartanoo);
            expect(this.player1).toBeAbleToSelect(this.cannon);
            this.player1.clickCard(this.cannon);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);
        });

        it('should not allow using exhausted artifact', function () {
            this.player1.useAction(this.transporterPlatform);
            this.player1.clickCard(this.medicIngram);
            expect(this.transporterPlatform.exhausted).toBe(true);
            this.player1.reap(this.kartanoo);
            expect(this.player1).toBeAbleToSelect(this.hologrammophone);
            expect(this.player1).not.toBeAbleToSelect(this.transporterPlatform);
            expect(this.player1).toBeAbleToSelect(this.cannon);
        });
    });
});
