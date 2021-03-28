describe('Soulkeeper', function () {
    describe("Soulkeeper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['shooler', 'old-yurk'],
                    hand: ['soulkeeper']
                },
                player2: {
                    inPlay: ['nexus', 'troll', 'dodger']
                }
            });
        });

        it('should destroy the most powerful enemy creature when the creature it is attached to dies', function () {
            this.player1.playUpgrade(this.soulkeeper, this.oldYurk);
            this.player1.fightWith(this.oldYurk, this.troll);
            expect(this.player1).toHavePrompt('Old Yurk');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).not.toBeAbleToSelect(this.dodger);
            this.player1.clickCard(this.troll);
            expect(this.oldYurk.location).toBe('discard');
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
        });
    });
    describe("Soulkeeper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['shooler', 'old-yurk'],
                    hand: ['soulkeeper']
                },
                player2: {
                    inPlay: ['nexus', 'bilgum-avalanche', 'yantzee-gang', 'dodger']
                }
            });
        });

        it('should allow the choice between enemy creatures when two or more have the highest power', function () {
            this.player1.playUpgrade(this.soulkeeper, this.oldYurk);
            this.player1.fightWith(this.oldYurk, this.bilgumAvalanche);
            expect(this.player1).toHavePrompt('Old Yurk');
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.yantzeeGang);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            expect(this.player1).not.toBeAbleToSelect(this.bilgumAvalanche);
            expect(this.bilgumAvalanche.location).toBe('play area');
            this.player1.clickCard(this.yantzeeGang);
            expect(this.oldYurk.location).toBe('discard');
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.bilgumAvalanche.location).toBe('discard');
            expect(this.yantzeeGang.location).toBe('discard');
        });
    });
    describe("Soulkeeper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['shooler', 'old-yurk'],
                    hand: ['soulkeeper', 'pawn-sacrifice']
                },
                player2: {
                    inPlay: ['nexus', 'bilgum-avalanche', 'yantzee-gang']
                }
            });
        });

        it('should fire when the creature is sacrificed', function () {
            this.player1.playUpgrade(this.soulkeeper, this.oldYurk);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.play(this.pawnSacrifice);
            expect(this.player1).toHavePrompt('Choose a creature to sacrifice');
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.oldYurk);
            this.player1.clickCard(this.oldYurk);
            expect(this.player1).toHavePrompt('Old Yurk');
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.yantzeeGang);
            expect(this.player1).toBeAbleToSelect(this.bilgumAvalanche);
            this.player1.clickCard(this.yantzeeGang);
            expect(this.player1).toHavePrompt('Choose 2 creatures');
            expect(this.player1).toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.bilgumAvalanche);
            expect(this.player1).toBeAbleToSelect(this.shooler);
            this.player1.clickCard(this.nexus);
            this.player1.clickCard(this.bilgumAvalanche);
            this.player1.clickPrompt('Done');
            expect(this.oldYurk.location).toBe('discard');
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.yantzeeGang.location).toBe('discard');
        });
    });
});
