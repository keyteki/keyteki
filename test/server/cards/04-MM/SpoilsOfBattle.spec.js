describe('spoils-of-battle', function () {
    describe("Spoil of Battle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 4,
                    hand: ['spoils-of-battle'],
                    inPlay: ['urchin', 'nexus', 'dextre', 'dodger']
                },
                player2: {
                    amber: 6,
                    inPlay: ['batdrone', 'mother', 'zorg']
                }
            });
        });

        it('should cause 1 creature to capture 2 when none have amber on them to start', function () {
            this.player1.play(this.spoilsOfBattle);

            // should be able to capture on any friendly
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.dodger);

            // not enemy
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.mother);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);

            // choose urchin
            this.player1.clickCard(this.urchin);

            // at this point urchin should have captured 2
            expect(this.urchin.tokens.amber).toBe(2);
            expect(this.player2.amber).toBe(4);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should capture on other creatures that have amber without a prompt when there are fewer creatures than ameber', function () {
            this.mother.tokens.amber = 1;
            this.nexus.tokens.amber = 1;

            this.player1.play(this.spoilsOfBattle);
            this.player1.clickCard(this.urchin);

            expect(this.urchin.tokens.amber).toBe(2);
            expect(this.nexus.tokens.amber).toBe(2);
            expect(this.mother.tokens.amber).toBe(2);

            // note, it is 4 because spoil of battle has amber bonus
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt the player to pick creatures when there is insufficient amber', function () {
            this.player1.amber = 1;
            this.player2.amber = 3;

            // put amber on all the creatures
            this.mother.tokens.amber = 1;
            this.batdrone.tokens.amber = 1;
            this.zorg.tokens.amber = 1;
            this.urchin.tokens.amber = 1;
            this.nexus.tokens.amber = 1;
            this.dextre.tokens.amber = 1;
            this.dodger.tokens.amber = 1;

            // play spoils of battle
            this.player1.play(this.spoilsOfBattle);
            this.player1.clickCard(this.urchin);

            // confirm friendly creatures selectable and not opponent
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            expect(this.player1).not.toBeAbleToSelect(this.mother);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);

            // click on friendly creatures
            this.player1.clickCard(this.dodger);
            this.player1.clickCard(this.dextre);
            this.player1.clickPrompt('Done');

            // confirm opponent creatures are selectable and not friendly
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.dodger);
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.zorg);

            // select opponent creatures
            this.player1.clickCard(this.mother);
            this.player1.clickCard(this.batdrone);
            this.player1.clickPrompt('Done');

            // confirm final values
            expect(this.urchin.tokens.amber).toBe(2);
            expect(this.dodger.tokens.amber).toBe(2);
            expect(this.dextre.tokens.amber).toBe(2);
            expect(this.mother.tokens.amber).toBe(2);
            expect(this.batdrone.tokens.amber).toBe(2);

            // no amber for either player
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
