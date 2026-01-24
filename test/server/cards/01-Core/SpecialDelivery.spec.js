describe('Special Delivery', function () {
    describe("Special Delivery's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: [
                        'special-delivery',
                        'the-grey-rider',
                        'lamindra',
                        'bulwark',
                        'rad-penny'
                    ]
                },
                player2: {
                    inPlay: ['troll', 'urchin', 'shadow-self', 'nexus']
                }
            });
        });

        it('should purge creatures who are destroyed by it', function () {
            this.player2.moveCard(this.shadowSelf, 'discard');
            this.player1.useOmni(this.specialDelivery);
            expect(this.player1).toBeAbleToSelect(this.theGreyRider);
            expect(this.player1).toBeAbleToSelect(this.radPenny);
            expect(this.player1).not.toBeAbleToSelect(this.bulwark);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.nexus);
            expect(this.nexus.location).toBe('purged');
            expect(this.specialDelivery.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should not purge creatures who are not destroyed', function () {
            this.player2.moveCard(this.shadowSelf, 'discard');
            this.player1.useOmni(this.specialDelivery);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.specialDelivery.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should not purge creatures who are destroyed, but were not the target', function () {
            this.shadowSelf.tokens.damage = 7;
            this.player1.useOmni(this.specialDelivery);
            this.player1.clickCard(this.nexus);
            expect(this.nexus.tokens.damage).toBeUndefined();
            expect(this.nexus.location).toBe('play area');
            expect(this.shadowSelf.location).toBe('discard');
            expect(this.specialDelivery.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should not purge rad penny when she goes back to deck', function () {
            this.player1.useOmni(this.specialDelivery);
            this.player1.clickCard(this.radPenny);
            expect(this.radPenny.location).toBe('deck');
            expect(this.specialDelivery.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should not purge warded creatures', function () {
            this.radPenny.ward();
            this.player1.useOmni(this.specialDelivery);
            this.player1.clickCard(this.radPenny);
            expect(this.radPenny.warded).toBe(false);
            expect(this.radPenny.location).toBe('play area');
            expect(this.specialDelivery.location).toBe('discard');
            this.player1.endTurn();
        });
    });

    describe("Special Delivery's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['armageddon-cloak'],
                    inPlay: ['bingle-bangbang', 'alaka']
                },
                player2: {
                    inPlay: ['special-delivery']
                }
            });

            this.player1.playUpgrade(this.armageddonCloak, this.bingleBangbang);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
        });

        it('should not purge armageddon cloak', function () {
            this.player2.useOmni(this.specialDelivery);
            this.player2.clickCard(this.bingleBangbang);
            expect(this.bingleBangbang.location).toBe('play area');
            expect(this.armageddonCloak.location).toBe('discard');
            expect(this.specialDelivery.location).toBe('discard');
            this.player2.endTurn();
        });
    });
});
