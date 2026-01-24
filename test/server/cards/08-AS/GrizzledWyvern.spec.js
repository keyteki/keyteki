describe('Grizzled Wyvern', function () {
    describe("Grizzled Wyvern's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['grizzled-wyvern']
                },
                player2: {
                    inPlay: ['batdrone', 'dextre']
                }
            });
        });

        it('should capture from opponent and from self', function () {
            this.player1.amber = 3;
            this.player2.amber = 3;
            this.player1.play(this.grizzledWyvern);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).toHavePromptButton('3');
            this.player1.selectOption(3);

            expect(this.grizzledWyvern.location).toBe('play area');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.grizzledWyvern.amber).toBe(6);
        });

        it('should prompt for amber capture from opponent', function () {
            this.player1.amber = 2;
            this.player2.amber = 7;
            this.player1.play(this.grizzledWyvern);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).not.toHavePromptButton('3');
            expect(this.player1).toHavePromptButton('4');
            expect(this.player1).toHavePromptButton('5');
            expect(this.player1).toHavePromptButton('6');

            this.player1.selectOption(6);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.grizzledWyvern.amber).toBe(6);
        });

        it('should prompt for amber capture from opponent and auto calculate from own', function () {
            this.player1.amber = 5;
            this.player2.amber = 7;
            this.player1.play(this.grizzledWyvern);

            this.player1.selectOption(4);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
            expect(this.grizzledWyvern.amber).toBe(6);
        });

        it('should destroy when choosing to capture 1 from self and fewer than 6 total is captured', function () {
            this.player1.amber = 1;
            this.player2.amber = 3;
            this.player1.play(this.grizzledWyvern);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).toHavePromptButton('3');
            this.player1.selectOption(3);

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
            expect(this.grizzledWyvern.location).toBe('discard');
        });
    });
});
