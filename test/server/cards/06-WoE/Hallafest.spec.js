describe('Hallafest', function () {
    describe("Hallafest's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 1,
                    hand: ['hallafest', 'brikk-nastee', 'harmal-atoon', 'ged-hammer', 'krump'],
                    inPlay: ['vulka', 'vulka'],
                    deck: []
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should 4 Bräkken creatures to be selected from deck, and not allow more than 1 of same name to be selected', function () {
            this.vulka1 = this.player1.player.creaturesInPlay[0];
            this.vulka2 = this.player1.player.creaturesInPlay[1];

            this.player1.moveCard(this.vulka1, 'deck');
            this.player1.moveCard(this.vulka2, 'deck');
            this.player1.moveCard(this.brikkNastee, 'deck');
            this.player1.moveCard(this.harmalAtoon, 'deck');
            this.player1.moveCard(this.gedHammer, 'deck');

            this.player1.play(this.hallafest);

            expect(this.player1).toBeAbleToSelect(this.vulka1);
            expect(this.player1).toBeAbleToSelect(this.vulka2);
            expect(this.player1).toBeAbleToSelect(this.brikkNastee);
            expect(this.player1).toBeAbleToSelect(this.harmalAtoon);
            expect(this.player1).toBeAbleToSelect(this.gedHammer);
            expect(this.player1).not.toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.vulka1);

            // click on vulka 2, but the ui will not actually allow it to be selected since vulka1 is selected
            this.player1.clickCard(this.vulka2);

            // select the other cards
            this.player1.clickCard(this.brikkNastee);
            this.player1.clickCard(this.harmalAtoon);
            this.player1.clickCard(this.gedHammer);

            this.player1.clickPrompt('Done');

            expect(this.vulka1.location).toBe('hand');
            expect(this.vulka2.location).toBe('deck');
            expect(this.brikkNastee.location).toBe('hand');
            expect(this.harmalAtoon.location).toBe('hand');
            expect(this.gedHammer.location).toBe('hand');

            expect(this.player1.chains).toBe(4);

            // make sure there are no active prompts
            this.player1.endTurn();
        });

        it('should allow less than 1 Bräkken creatures to be selected from deck, and only give 1 chain', function () {
            this.vulka1 = this.player1.player.creaturesInPlay[0];
            this.vulka2 = this.player1.player.creaturesInPlay[1];

            this.player1.moveCard(this.vulka1, 'deck');
            this.player1.moveCard(this.vulka2, 'deck');
            this.player1.moveCard(this.brikkNastee, 'deck');
            this.player1.moveCard(this.harmalAtoon, 'deck');
            this.player1.moveCard(this.gedHammer, 'deck');

            this.player1.play(this.hallafest);
            this.player1.clickCard(this.vulka1);
            this.player1.clickPrompt('Done');

            expect(this.vulka1.location).toBe('hand');
            expect(this.vulka2.location).toBe('deck');
            expect(this.brikkNastee.location).toBe('deck');
            expect(this.harmalAtoon.location).toBe('deck');
            expect(this.gedHammer.location).toBe('deck');

            expect(this.player1.chains).toBe(1);

            this.player1.endTurn();
        });
    });
});
