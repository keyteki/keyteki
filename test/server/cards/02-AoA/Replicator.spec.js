describe('Replicator', function () {
    describe("Replicator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 2,
                    inPlay: ['replicator', 'gamgee', 'titan-mechanic']
                },
                player2: {
                    amber: 5,
                    inPlay: ['foozle', 'bingle-bangbang']
                }
            });
        });

        it("should use Gamgee's reap effect", function () {
            this.player1.reap(this.replicator);
            this.player1.clickCard(this.gamgee);
            expect(this.player1.player.amber).toBe(4);
            expect(this.player2.player.amber).toBe(4);
        });

        it("should use Foozle's reap effect", function () {
            this.player1.fightWith(this.titanMechanic, this.bingleBangbang);
            this.player1.reap(this.replicator);
            this.player1.clickCard(this.foozle);
            expect(this.player1.player.amber).toBe(4);
            expect(this.player2.player.amber).toBe(5);
        });

        it("should fail Foozle's reap effect's condition", function () {
            this.player1.reap(this.replicator);
            this.player1.clickCard(this.foozle);
            expect(this.player1.player.amber).toBe(3);
            expect(this.player2.player.amber).toBe(5);
        });
    });
    describe("Replicator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 2,
                    hand: ['red-planet-ray-gun'],
                    inPlay: ['replicator', 'ulyq-megamouth', 'dextre']
                },
                player2: {
                    amber: 5,
                    inPlay: ['foozle', 'bingle-bangbang']
                }
            });
        });

        it('Copy reap effects including upgrades', function () {
            // This test specifically addresses multiple reap effects and
            // Is xit'd until we re-factor the base replicator card code
            this.player1.playUpgrade(this.redPlanetRayGun, this.ulyqMegamouth);
            this.player1.reap(this.ulyqMegamouth);
            expect(this.player1).toBeAbleToSelect(this.ulyqMegamouth);
            this.player1.clickCard(this.ulyqMegamouth);
            this.player1.clickPrompt('Red Planet Ray Gun');
            this.player1.clickCard(this.foozle);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.replicator);
            this.player1.clickCard(this.replicator);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1).toBeAbleToSelect(this.ulyqMegamouth);
            this.player1.clickCard(this.ulyqMegamouth);
            expect(this.player1).toHavePrompt('Ulyq Megamouth');
            expect(this.player1).toBeAbleToSelect(this.dextre);
        });
    });
});
