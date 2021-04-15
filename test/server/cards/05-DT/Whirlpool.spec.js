describe('Whirlpool', function () {
    describe("Whirlpool's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['harland-mindlock'],
                    inPlay: ['kaupe', 'wikolia', 'whirlpool']
                },
                player2: {
                    inPlay: ['batdrone', 'mother', 'zorg', 'krump']
                }
            });
        });

        it('Gives wikolia to the opponent and put it on the left', function () {
            this.player1.endTurn();
            expect(this.player2.player.cardsInPlay).toContain(this.wikolia);
            expect(this.wikolia.controller).toBe(this.player2.player);
            expect(this.player2.player.creaturesInPlay[0]).toBe(this.wikolia);

            this.player2.clickPrompt('Logos');
            this.player2.endTurn();
            expect(this.player1.player.cardsInPlay).toContain(this.krump);
            expect(this.krump.controller).toBe(this.player1.player);
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.krump);

            this.player1.clickPrompt('Unfathomable');
            this.player1.endTurn();
            expect(this.player2.player.cardsInPlay).toContain(this.kaupe);
            expect(this.kaupe.controller).toBe(this.player2.player);
            expect(this.player2.player.creaturesInPlay[0]).toBe(this.kaupe);

            expect(this.kaupe.controller).toBe(this.player2.player);
            expect(this.wikolia.controller).toBe(this.player2.player);
            expect(this.batdrone.controller).toBe(this.player2.player);
            expect(this.mother.controller).toBe(this.player2.player);
            expect(this.zorg.controller).toBe(this.player2.player);
            expect(this.krump.controller).toBe(this.player1.player);
        });

        it('When stealing a previously transferred creature, can choose which flank to put it on', function () {
            this.player1.endTurn();
            expect(this.player2.player.cardsInPlay).toContain(this.wikolia);
            expect(this.wikolia.controller).toBe(this.player2.player);
            expect(this.player2.player.creaturesInPlay[0]).toBe(this.wikolia);

            this.player2.clickPrompt('Logos');
            this.player2.endTurn();
            expect(this.player1.player.cardsInPlay).toContain(this.krump);
            expect(this.krump.controller).toBe(this.player1.player);
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.krump);

            this.player1.clickPrompt('Logos');
            this.player1.play(this.harlandMindlock);
            this.player1.clickCard(this.wikolia);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.cardsInPlay).toContain(this.wikolia);
            expect(this.wikolia.controller).toBe(this.player1.player);
            expect(this.player1.player.creaturesInPlay[3]).toBe(this.wikolia);
        });

        it('Does not transfer a creature when the controller has no creatures', function () {
            this.player1.moveCard(this.wikolia, 'discard');
            this.player1.moveCard(this.kaupe, 'discard');
            this.player1.endTurn();

            this.player2.clickPrompt('Logos');
            this.player2.endTurn();
            expect(this.player1.player.cardsInPlay).toContain(this.krump);
            expect(this.krump.controller).toBe(this.player1.player);
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.krump);

            this.player1.clickPrompt('Unfathomable');
            this.player1.endTurn();
            expect(this.player2.player.cardsInPlay).toContain(this.krump);
            expect(this.krump.controller).toBe(this.player2.player);
            expect(this.player2.player.creaturesInPlay[0]).toBe(this.krump);

            expect(this.batdrone.controller).toBe(this.player2.player);
            expect(this.mother.controller).toBe(this.player2.player);
            expect(this.zorg.controller).toBe(this.player2.player);
            expect(this.krump.controller).toBe(this.player2.player);
        });
    });
});
