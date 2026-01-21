describe('Scout', function () {
    describe("Scout's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['scout'],
                    inPlay: ['bumpsy', 'troll']
                },
                player2: {
                    inPlay: ['sequis', 'bulwark']
                }
            });
        });

        it('should give skirmish to selected creatures and fight with them', function () {
            this.player1.play(this.scout);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.sequis);
            this.player1.clickCard(this.bulwark);
            expect(this.bumpsy.tokens.damage).toBeUndefined();
            expect(this.troll.tokens.damage).toBeUndefined();
            expect(this.sequis.tokens.damage).toBe(5);
            expect(this.bulwark.tokens.damage).toBe(8);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow selecting fewer than 2 creatures', function () {
            this.player1.play(this.scout);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.sequis);
            expect(this.bumpsy.tokens.damage).toBeUndefined();
            expect(this.sequis.tokens.damage).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
