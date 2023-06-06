describe('Ironyx Banner', function () {
    describe("Ironyx Banner's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'mars',
                    token: 'rebel',
                    inPlay: ['tunk', 'collector-worm', 'yxl-the-iron-captain', 'ironyx-vatminder'],
                    hand: ['ironyx-banner']
                },
                player2: {
                    amber: 4,
                    inPlay: ['alaka'],
                    hand: ['berserker-slam']
                }
            });

            this.deckCard = this.player1.deck[0];
        });

        it('should make a token creature after play', function () {
            this.player1.play(this.ironyxBanner);
            this.player1.clickPrompt('Left');
            expect(this.ironyxBanner.location).toBe('play area');
            let rebel = this.player1.inPlay[0];
            expect(rebel).toBe(this.deckCard);
            expect(rebel.name).toBe('Rebel');
            expect(rebel.armor).toBe(1);
            expect(rebel.power).toBe(2);
            this.player1.endTurn();
        });
    });

    describe("Ironyx Banner's persistent effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'mars',
                    token: 'grunt',
                    inPlay: [
                        'ironyx-banner',
                        'tunk',
                        'collector-worm',
                        'yxl-the-iron-captain',
                        'ironyx-rebel'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['alaka', 'borka-rikk'],
                    hand: ['berserker-slam']
                }
            });
        });

        it('should give +1 power and +1 armor for friendly Ironyx', function () {
            expect(this.tunk.armor).toBe(1);
            expect(this.tunk.power).toBe(6);
            expect(this.collectorWorm.armor).toBe(5);
            expect(this.collectorWorm.power).toBe(2);
            expect(this.yxlTheIronCaptain.armor).toBe(2);
            expect(this.yxlTheIronCaptain.power).toBe(5);
            expect(this.ironyxRebel.armor).toBe(1);
            expect(this.ironyxRebel.power).toBe(3);

            expect(this.alaka.armor).toBe(0);
            expect(this.alaka.power).toBe(4);
            expect(this.borkaRikk.armor).toBe(0);
            expect(this.borkaRikk.power).toBe(4);
        });
    });
});
