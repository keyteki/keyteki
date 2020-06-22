describe('Soft Landing', function () {
    describe("Soft Landing's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['zorg', 'mindwarper', 'soft-landing']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.player1.play(this.softLanding);
        });

        it('should ready the next card played', function () {
            this.player1.play(this.zorg);
            expect(this.zorg.exhausted).toBe(false);
            this.player1.play(this.mindwarper);
            expect(this.mindwarper.exhausted).toBe(true);
        });
        /*
            it('should stack', function() {
                this.player1.moveCard(this.softLanding, 'hand');
                this.player1.play(this.softLanding);
                this.player1.play(this.zorg);
                expect(this.zorg.exhausted).toBe(false);
                this.player1.play(this.mindwarper);
                expect(this.mindwarper.exhausted).toBe(false);
            });
            */
        it('should not carry over to the following turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.play(this.mindwarper);
            expect(this.mindwarper.exhausted).toBe(true);
        });
    });

    describe("Soft Landing's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['zorg', 'mindwarper', 'soft-landing', 'john-smyth'],
                    inPlay: ['tunk']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
        });

        it('should ready the next card played after you click the prompt when you have another simultaneous ability', function () {
            this.player1.play(this.softLanding);
            this.player1.play(this.zorg);
            this.player1.clickPrompt('Soft Landing');
            expect(this.zorg.exhausted).toBe(false);
            this.player1.play(this.mindwarper);
            expect(this.mindwarper.exhausted).toBe(true);
        });

        it('should ready the next card played even if you have a prompt and choose to resolve the other trigger first', function () {
            this.player1.fightWith(this.tunk, this.batdrone);
            expect(this.tunk.tokens.damage).toBe(1);
            this.player1.play(this.softLanding);
            this.player1.play(this.mindwarper);
            this.player1.clickCard(this.tunk);
            expect(this.mindwarper.exhausted).toBe(false);
            expect(this.tunk.tokens.damage).toBe(undefined);
        });
    });
});
