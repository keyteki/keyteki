describe('Returning Champion', function () {
    describe("Returning Champion's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['returning-champion', 'burn-the-stockpile'],
                    inPlay: ['troll'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['dust-pixie', 'cornicen-octavia']
                }
            });
            this.player1.chains = 36;
        });

        it('deals 3 damage to itself on play', function () {
            this.player1.playCreature(this.returningChampion);
            expect(this.returningChampion.damage).toBe(3);
        });

        describe('after fight', function () {
            beforeEach(function () {
                this.player1.playCreature(this.returningChampion);
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                this.player1.clickPrompt('brobnar');
            });

            it('does nothing if not haunted', function () {
                this.player1.fightWith(this.returningChampion, this.dustPixie);
                expect(this.player1).isReadyToTakeAction();
            });

            describe('if haunted', function () {
                beforeEach(function () {
                    this.player1.play(this.burnTheStockpile);
                });

                it('moves damage', function () {
                    this.player1.fightWith(this.returningChampion, this.dustPixie);
                    expect(this.player1).toBeAbleToSelect(this.troll);
                    expect(this.player1).not.toBeAbleToSelect(this.returningChampion);
                    expect(this.player1).toBeAbleToSelect(this.cornicenOctavia);
                    expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
                    this.player1.clickCard(this.cornicenOctavia);
                    expect(this.returningChampion.damage).toBe(0);
                    expect(this.cornicenOctavia.damage).toBe(4);
                    expect(this.player1).isReadyToTakeAction();
                });

                it('moves damage to destroy a creature', function () {
                    this.player1.fightWith(this.returningChampion, this.cornicenOctavia);
                    expect(this.player1).toBeAbleToSelect(this.troll);
                    expect(this.player1).not.toBeAbleToSelect(this.returningChampion);
                    expect(this.player1).not.toBeAbleToSelect(this.cornicenOctavia);
                    expect(this.player1).toBeAbleToSelect(this.dustPixie);
                    this.player1.clickCard(this.dustPixie);
                    expect(this.returningChampion.damage).toBe(0);
                    expect(this.dustPixie.location).toBe('discard');
                    expect(this.player1).isReadyToTakeAction();
                });

                it('moves damage to a friendly creature', function () {
                    this.player1.fightWith(this.returningChampion, this.dustPixie);
                    expect(this.player1).toBeAbleToSelect(this.troll);
                    expect(this.player1).not.toBeAbleToSelect(this.returningChampion);
                    expect(this.player1).toBeAbleToSelect(this.cornicenOctavia);
                    expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
                    this.player1.clickCard(this.troll);
                    expect(this.returningChampion.damage).toBe(0);
                    expect(this.troll.damage).toBe(4);
                    expect(this.player1).isReadyToTakeAction();
                });
            });
        });
    });
});
