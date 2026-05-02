describe('Dreamcall', function () {
    describe("Dreamcall's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['dreamcall'],
                    inPlay: ['silvertooth', 'lamindra'],
                    discard: ['dreamcall', 'dreamcall'],
                    deck: ['urchin', 'urchin', 'urchin']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy', 'krump']
                }
            });
        });

        it('exhausts a creature and exhausts more + draws cards based on copies in discard', function () {
            this.player1.play(this.dreamcall);
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(true);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.krump);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(true);
            expect(this.player1.hand.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('only exhausts target when no copies in discard', function () {
            this.player1.player.discard = [];
            this.player1.play(this.dreamcall);
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(true);
            expect(this.bumpsy.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(false);
            expect(this.player1.hand.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target friendly creatures for both initial and additional exhausts', function () {
            this.player1.play(this.dreamcall);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.silvertooth);
            expect(this.silvertooth.exhausted).toBe(true);
            expect(this.player1).not.toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.lamindra);
            this.player1.clickCard(this.troll);
            expect(this.lamindra.exhausted).toBe(true);
            expect(this.troll.exhausted).toBe(true);
            expect(this.bumpsy.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(false);
            expect(this.player1.hand.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('requires exhausting at least one additional creature per copy in discard', function () {
            this.player1.player.discard.pop();
            this.player1.play(this.dreamcall);
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(true);
            expect(this.player1).toHavePrompt('Choose another creature to exhaust');
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(false);
            expect(this.player1.hand.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Dreamcall ordering', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['dreamcall', 'weak-link'],
                    discard: ['dreamcall', 'dreamcall'],
                    deck: ['urchin', 'urchin'],
                    inPlay: ['lamindra']
                },
                player2: {
                    amber: 12,
                    hand: ['prince-bufo'],
                    inPlay: ['bumpsy', 'krump', 'troll'],
                    prophecies: [
                        'the-cards-will-tell',
                        'overreach',
                        'fate-laughs-at-your-plans',
                        'expect-the-unexpected'
                    ]
                }
            });
        });

        it('draws before the second additional exhaust so prophecy fate sees the lower key cost', function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('brobnar');
            this.player2.activateProphecy(this.theCardsWillTell, this.princeBufo);
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            this.player1.playUpgrade(this.weakLink, this.troll);
            this.player1.play(this.dreamcall);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(false);
            expect(this.troll.exhausted).toBe(false);
            this.player1.clickCard(this.krump);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.krump.exhausted).toBe(true);
            expect(this.troll.exhausted).toBe(false);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            expect(this.player1).toHavePrompt('Which key would you like to forge?');
            this.player1.clickPrompt('Blue');
            expect(this.princeBufo.location).toBe('discard');
            expect(this.player2.amber).toBe(0);
            expect(this.player2.getForgedKeys()).toBe(2);
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Dreamcall with 3 copies in discard', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['dreamcall'],
                    discard: ['dreamcall', 'dreamcall', 'dreamcall'],
                    deck: ['urchin', 'urchin', 'urchin', 'urchin']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy', 'krump']
                }
            });
        });

        it('can pick the same additional creature for each subsequent exhaust', function () {
            this.player1.play(this.dreamcall);
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(true);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.exhausted).toBe(true);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.bumpsy);
            expect(this.krump.exhausted).toBe(false);
            expect(this.player1.hand.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
