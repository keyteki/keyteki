describe('Spikey Goeff', function () {
    describe('Spikey Goeff has taunt and conditional hazardous', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['spikey-goeff']
                },
                player2: {}
            });
        });

        it('does not have hazardous when not overwhelmed', function () {
            expect(this.player1.player.isOverwhelmed()).toBe(false);
            expect(this.spikeyGoeff.hasKeyword('taunt')).toBe(true);
            expect(this.spikeyGoeff.getKeywordValue('hazardous')).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Spikey Goeff hazardous when overwhelmed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['spikey-goeff']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('gains hazardous 2 when overwhelmed', function () {
            expect(this.player1.player.isOverwhelmed()).toBe(true);
            expect(this.spikeyGoeff.hasKeyword('taunt')).toBe(true);
            expect(this.spikeyGoeff.getKeywordValue('hazardous')).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Spikey Goeff's scrap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['spikey-goeff']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('deals 2 damage to a creature when scrapped from hand', function () {
            this.player1.scrap(this.spikeyGoeff);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(2);
            expect(this.spikeyGoeff.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
