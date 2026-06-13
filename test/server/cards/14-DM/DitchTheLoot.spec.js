describe('Ditch the Loot', function () {
    describe("Ditch the Loot's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['ditch-the-loot'],
                    inPlay: ['urchin', 'hobnobber']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
            this.urchin.amber = 3;
            this.bumpsy.amber = 2;
        });

        it('moves all amber from friendly to friendly', function () {
            this.player1.play(this.ditchTheLoot);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.hobnobber);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.hobnobber);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.hobnobber);
            expect(this.urchin.amber).toBe(0);
            expect(this.hobnobber.amber).toBe(3);
            expect(this.troll.amber).toBe(0);
            expect(this.bumpsy.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('moves all amber from friendly to enemy', function () {
            this.player1.play(this.ditchTheLoot);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.troll);
            expect(this.urchin.amber).toBe(0);
            expect(this.hobnobber.amber).toBe(0);
            expect(this.troll.amber).toBe(3);
            expect(this.bumpsy.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('moves all amber from enemy to friendly', function () {
            this.player1.play(this.ditchTheLoot);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.amber).toBe(5);
            expect(this.hobnobber.amber).toBe(0);
            expect(this.troll.amber).toBe(0);
            expect(this.bumpsy.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('moves all amber from enemy to enemy', function () {
            this.player1.play(this.ditchTheLoot);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.troll);
            expect(this.urchin.amber).toBe(3);
            expect(this.hobnobber.amber).toBe(0);
            expect(this.troll.amber).toBe(2);
            expect(this.bumpsy.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target creatures with no amber on them', function () {
            this.player1.play(this.ditchTheLoot);
            this.player1.clickCard(this.hobnobber);
            this.player1.clickCard(this.troll);
            expect(this.urchin.amber).toBe(3);
            expect(this.hobnobber.amber).toBe(0);
            expect(this.troll.amber).toBe(0);
            expect(this.bumpsy.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Ditch the Loot with only one creature in play that has amber', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['ditch-the-loot'],
                    inPlay: ['urchin']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('leaves the amber on the friendly creature when there is no other creature to receive it', function () {
            this.player2.moveCard(this.troll, 'discard');
            this.urchin.amber = 3;
            this.player1.play(this.ditchTheLoot);
            expect(this.urchin.amber).toBe(3);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('leaves the amber on the enemy creature when there is no other creature to receive it', function () {
            this.player1.moveCard(this.urchin, 'discard');
            this.troll.amber = 3;
            this.player1.play(this.ditchTheLoot);
            expect(this.troll.amber).toBe(3);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Ditch the Loot's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['essence-entangler'],
                    inPlay: ['cxo-taber']
                },
                player2: {
                    hand: ['ditch-the-loot'],
                    inPlay: ['urchin']
                }
            });
            this.cxoTaber.amber = 2;
            this.urchin.amber = 3;
        });

        it('moves all amber simultaneously', function () {
            this.player1.playUpgrade(this.essenceEntangler, this.cxoTaber);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.ditchTheLoot);
            this.player2.clickCard(this.urchin);
            this.player2.clickCard(this.cxoTaber);
            expect(this.urchin.amber).toBe(0);
            expect(this.cxoTaber.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(6);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
