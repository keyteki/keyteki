describe('Cryptic Collapse', function () {
    describe("Cryptic Collapse's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['cryptic-collapse', 'ember-imp', 'parasitic-arachnoid'],
                    inPlay: ['charette', 'hazard-zerp', 'hazard-zerp']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'dust-pixie'],
                    hand: ['flaxia']
                }
            });

            this.hazardZerp1 = this.player1.inPlay[1];
            this.hazardZerp2 = this.player1.inPlay[2];
        });

        it('should discard hand and make enemy creatures capture amber', function () {
            this.player1.play(this.crypticCollapse);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.parasiticArachnoid);
            expect(this.player2).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.emberImp);
            expect(this.player1.hand.length).toBe(0);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.dustPixie);
            expect(this.troll.amber).toBe(1);
            expect(this.dustPixie.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not capture amber if no cards in hand', function () {
            this.player1.scrap(this.emberImp);
            this.player1.scrap(this.parasiticArachnoid);
            this.player1.play(this.crypticCollapse);
            expect(this.troll.amber).toBe(0);
            expect(this.dustPixie.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not re-discard cards already discarded', function () {
            // Set things up so that the 2 Hazard Zerps are in hand, with
            // nothing else but Cryptic Collapse.
            this.player1.scrap(this.emberImp);
            this.player1.scrap(this.parasiticArachnoid);
            this.player1.moveCard(this.hazardZerp1, 'hand');
            this.player1.moveCard(this.hazardZerp2, 'hand');
            this.player1.play(this.crypticCollapse);

            // Select first card to discard
            expect(this.player1).toHavePrompt('Cryptic Collapse');
            expect(this.player1).toHavePrompt('Select next card to discard');
            expect(this.player1).toBeAbleToSelect(this.hazardZerp1);
            expect(this.player1).toBeAbleToSelect(this.hazardZerp2);
            this.player1.clickCard(this.hazardZerp1);

            // Hazard Zerp 1's scrap fires immediately - must discard Hazard Zerp 2
            expect(this.player1).toHavePrompt('Hazard Zerp');
            expect(this.player1).toHavePrompt('Choose a card to discard');
            expect(this.player1).not.toBeAbleToSelect(this.crypticCollapse);
            expect(this.player1).not.toBeAbleToSelect(this.hazardZerp1);
            expect(this.player1).toBeAbleToSelect(this.hazardZerp2);
            this.player1.clickCard(this.hazardZerp2);

            // Hazard Zerp 2's scrap fires - nothing left to discard
            // Damage from Hazard Zerp 2
            expect(this.player1).toHavePrompt('Hazard Zerp');
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.troll);

            // Damage from Hazard Zerp 1
            expect(this.player1).toHavePrompt('Hazard Zerp');
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.troll);

            // CC only actually discarded one card (Hazard Zerp 1), since
            // Hazard Zerp 2 was discarded by scrap not by Cryptic Collapse.
            expect(this.player1).toHavePrompt('Cryptic Collapse');
            expect(this.player1).toHavePrompt('Choose a creature to capture 1 amber');
            this.player1.clickCard(this.dustPixie);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
