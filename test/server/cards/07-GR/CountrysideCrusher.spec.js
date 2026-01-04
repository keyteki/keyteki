describe('Countryside Crusher', function () {
    describe("Countryside Crusher's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['countryside-crusher'],
                    inPlay: ['troll', 'slimy-jark']
                },
                player2: {
                    inPlay: ['flaxia', 'dust-pixie', 'dew-faerie'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
            this.player2.chains = 36;
        });

        describe('on fight', function () {
            beforeEach(function () {
                this.player1.playCreature(this.countrysideCrusher);
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                this.player1.clickPrompt('brobnar');
            });

            it('can ready and fight with a neighbor when opponent is haunted', function () {
                this.player1.fightWith(this.countrysideCrusher, this.flaxia);
                expect(this.flaxia.location).toBe('discard');
                expect(this.player2.player.discard.length).toBe(10);
                this.player1.clickCard(this.countrysideCrusher);
                this.player1.clickCard(this.slimyJark);
                this.player1.clickCard(this.dustPixie);
                expect(this.dustPixie.location).toBe('discard');
                expect(this.player1).isReadyToTakeAction();
            });

            it('does nothing when opponent is not haunted', function () {
                this.player1.fightWith(this.countrysideCrusher, this.dewFaerie);
                expect(this.player1).isReadyToTakeAction();
            });

            it('is optional', function () {
                this.player1.fightWith(this.countrysideCrusher, this.flaxia);
                this.player1.clickPrompt('Done');
                expect(this.player1).isReadyToTakeAction();
            });
        });

        it('can ready and fight with least-power creature on scrap', function () {
            this.player1.clickCard(this.countrysideCrusher);
            this.player1.clickPrompt('Discard this card');
            expect(this.player1).toBeAbleToSelect(this.slimyJark);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.slimyJark);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
