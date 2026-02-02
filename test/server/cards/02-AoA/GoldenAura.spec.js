describe('Golden Aura', function () {
    describe("Golden Aura's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['golden-aura', 'mighty-lance'],
                    inPlay: ['zorg']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
            this.zorg.damage = 5;
        });

        it('should fully heal the chosen creature and make it Sanctum and immune to fight damage', function () {
            this.player1.play(this.goldenAura);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.zorg);
            expect(this.zorg.damage).toBe(0);
            expect(this.zorg.hasHouse('sanctum')).toBe(true);
            this.player1.fightWith(this.zorg, this.bumpsy);
            expect(this.zorg.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should fully heal the chosen creature and make it Sanctum and action to damage', function () {
            this.player1.play(this.goldenAura);
            this.player1.clickCard(this.zorg);
            this.player1.play(this.mightyLance);
            this.player1.clickCard(this.zorg);
            expect(this.zorg.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should only last until end of turn', function () {
            this.player1.play(this.goldenAura);
            this.player1.clickCard(this.zorg);
            this.player1.endTurn();
            expect(this.zorg.hasHouse('sanctum')).toBe(false);
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.bumpsy, this.zorg);
            expect(this.zorg.damage).toBe(5);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should overwrite other houses', function () {
            this.zorg.enhancements = ['dis'];
            this.player1.play(this.goldenAura);
            this.player1.clickCard(this.zorg);
            expect(this.zorg.damage).toBe(0);
            expect(this.zorg.hasHouse('sanctum')).toBe(true);
            expect(this.zorg.hasHouse('dis')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
