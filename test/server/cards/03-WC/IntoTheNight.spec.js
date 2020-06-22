describe('Into the Night', function () {
    describe("Into the Night's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['a-vinda', 'mooncurser', 'tantadlin'],
                    hand: [
                        'into-the-night',
                        'lamindra',
                        'lamindra',
                        'lamindra',
                        'lamindra',
                        'lamindra'
                    ]
                },
                player2: {
                    inPlay: ['krump'],
                    hand: ['troll', 'groggins', 'groggins', 'groggins', 'groggins', 'groggins']
                }
            });
        });
        it('Prevent non-shadows creatures from fighting until the start of their next turn', function () {
            this.player1.play(this.intoTheNight);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.krump);
            expect(this.player2).not.toHavePromptButton('Fight with this creature');
        });
    });
    describe("Into the Night's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['a-vinda', 'mooncurser', 'tantadlin'],
                    hand: [
                        'into-the-night',
                        'lamindra',
                        'lamindra',
                        'lamindra',
                        'lamindra',
                        'lamindra'
                    ]
                },
                player2: {
                    inPlay: ['krump', 'bad-penny'],
                    hand: ['troll', 'groggins', 'groggins', 'groggins', 'groggins', 'groggins']
                }
            });
        });
        it('Allow opponent shadows creatures to fight', function () {
            this.player1.play(this.intoTheNight);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.clickCard(this.badPenny);
            expect(this.player2).toHavePromptButton('Fight with this creature');
        });
    });
    describe("Into the Night's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['a-vinda', 'mooncurser', 'tantadlin'],
                    hand: [
                        'into-the-night',
                        'lamindra',
                        'lamindra',
                        'lamindra',
                        'lamindra',
                        'lamindra'
                    ]
                },
                player2: {
                    inPlay: ['krump'],
                    hand: ['buzzle', 'groggins', 'groggins', 'groggins', 'groggins', 'groggins']
                }
            });
        });
        it('Prevent non-shadows creatures from fighting until the start of their next turn', function () {
            this.player1.play(this.intoTheNight);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.buzzle);
            this.player2.clickCard(this.krump);
            this.player2.clickCard(this.buzzle);
            expect(this.player2).not.toHavePromptButton('Fight with this creature');
        });
    });
});
