describe('Light Everlasting', function () {
    describe("Light Everlasting's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['light-everlasting'],
                    inPlay: ['ganymede-archivist', 'helper-bot', 'dextre'],
                    discard: [
                        'archimedes',
                        'flaxia',
                        'bulwark',
                        'champion-anaphiel',
                        'haedroth-s-wall'
                    ]
                },
                player2: {
                    inPlay: ['inka-the-spider', 'ember-imp']
                }
            });
        });

        it('should be able to play a sanctum creature anywhere in battleline', function () {
            this.player1.play(this.lightEverlasting);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).not.toBeAbleToSelect(this.archimedes);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.haedrothSWall);

            this.player1.clickCard(this.bulwark);
            expect(this.player1).toHavePromptButton('Left');
            expect(this.player1).toHavePromptButton('Deploy Left');
            expect(this.player1).toHavePromptButton('Right');
            expect(this.player1).toHavePromptButton('Deploy Right');

            this.player1.clickPrompt('Deploy Right');
            this.player1.clickCard(this.helperBot);
            expect(this.bulwark.neighbors).toContain(this.helperBot);
            expect(this.bulwark.neighbors).toContain(this.dextre);
        });
    });
});
