describe('3LL-I0T', function () {
    describe("3LL-I0T's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['3ll-i0t', 'officer-s-blaster', 'quadracorder'],
                    inPlay: ['charette'],
                    discard: ['gub', 'light-of-the-archons', 'insurance-policy']
                },
                player2: {
                    hand: ['wild-spirit'],
                    inPlay: ['flaxia']
                }
            });
        });

        it('can play an upgrade from discard onto itself', function () {
            this.player1.playCreature(this['3llI0t']);
            expect(this.player1).toBeAbleToSelect(this.lightOfTheArchons);
            expect(this.player1).toBeAbleToSelect(this.insurancePolicy);
            this.player1.clickCard(this.lightOfTheArchons);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(2);
            expect(this.lightOfTheArchons.location).toBe('play area');
            expect(this.lightOfTheArchons.parent).toBe(this['3llI0t']);
        });

        it('gets the Play: ability of the played upgrade', function () {
            this.player1.playCreature(this['3llI0t']);
            this.player1.clickCard(this.insurancePolicy);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(0);
            expect(this.insurancePolicy.location).toBe('play area');
            expect(this.insurancePolicy.parent).toBe(this['3llI0t']);
        });

        it('can discard a card and resolve its play ability on scrap', function () {
            this.player1.playUpgrade(this.officerSBlaster, this.charette);
            this.player1.playUpgrade(this.quadracorder, this.flaxia);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playUpgrade(this.wildSpirit, this.flaxia);
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.clickCard(this['3llI0t']);
            this.player1.clickPrompt('Discard this card');
            expect(this.player1).isReadyToTakeAction();
            expect(this.officerSBlaster.location).toBe('deck');
            expect(this.officerSBlaster.parent).toBe(null);
            expect(this.player1.player.deck).toContain(this.officerSBlaster);
            expect(this.quadracorder.location).toBe('deck');
            expect(this.quadracorder.parent).toBe(null);
            expect(this.player1.player.deck).toContain(this.quadracorder);
            expect(this.wildSpirit.location).toBe('deck');
            expect(this.wildSpirit.parent).toBe(null);
            expect(this.player2.player.deck).toContain(this.wildSpirit);
            expect(this.charette.upgrades.length).toBe(0);
            expect(this.flaxia.upgrades.length).toBe(0);
            expect(this['3llI0t'].location).toBe('discard');
        });
    });
});
