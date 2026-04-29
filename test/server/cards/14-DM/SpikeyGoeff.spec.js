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

        it('has taunt keyword', function () {
            expect(this.spikeyGoeff.hasKeyword('taunt')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not have hazardous when not overwhelmed', function () {
            expect(this.player1.player.isOverwhelmed()).toBe(false);
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
                    inPlay: [
                        'troll',
                        'bumpsy',
                        'krump',
                        'helichopper',
                        'lamindra',
                        'shadys',
                        'echofly'
                    ]
                }
            });
        });

        it('gains hazardous 2 when overwhelmed', function () {
            expect(this.player1.player.isOverwhelmed()).toBe(true);
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
                    inPlay: ['lamindra']
                }
            });
        });

        it('deals 2 damage to a creature when scrapped from hand', function () {
            this.player1.scrap(this.spikeyGoeff);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            expect(this.spikeyGoeff.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
