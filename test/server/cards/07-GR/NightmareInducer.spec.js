describe('Nightmare Inducer', function () {
    describe("Nightmare Inducer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['nightmare-inducer', 'bubbles', 'citizen-shrix'],
                    discard: ['stomp']
                },
                player2: {
                    inPlay: ['skullback-crab', 'flaxia', 'batdrone'],
                    discard: ['crushing-deep', 'hunting-witch', 'poke']
                }
            });
        });

        it('exhausts enemy creatures and puts card back on bottom of deck', function () {
            this.player1.useAction(this.nightmareInducer);
            expect(this.player1).toBeAbleToSelect(this.crushingDeep);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.poke);
            expect(this.player1).not.toBeAbleToSelect(this.stomp);
            this.player1.clickCard(this.huntingWitch);
            expect(this.skullbackCrab.exhausted).toBe(false);
            expect(this.flaxia.exhausted).toBe(true);
            expect(this.batdrone.exhausted).toBe(false);
            expect(this.bubbles.exhausted).toBe(false);
            expect(this.citizenShrix.exhausted).toBe(false);
            expect(this.huntingWitch.location).toBe('deck');
            expect(this.player2.player.deck[this.player2.player.deck.length - 1]).toBe(
                this.huntingWitch
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not exhaust friendly creatures', function () {
            this.player1.useAction(this.nightmareInducer);
            this.player1.clickCard(this.crushingDeep);
            expect(this.skullbackCrab.exhausted).toBe(true);
            expect(this.flaxia.exhausted).toBe(false);
            expect(this.batdrone.exhausted).toBe(false);
            expect(this.bubbles.exhausted).toBe(false);
            expect(this.citizenShrix.exhausted).toBe(false);
            expect(this.crushingDeep.location).toBe('deck');
            expect(this.player2.player.deck[this.player2.player.deck.length - 1]).toBe(
                this.crushingDeep
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing with no enemy discard', function () {
            this.player2.moveCard(this.crushingDeep, 'deck');
            this.player2.moveCard(this.huntingWitch, 'deck');
            this.player2.moveCard(this.poke, 'deck');
            this.player1.useAction(this.nightmareInducer);
            expect(this.player1).not.toBeAbleToSelect(this.crushingDeep);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.poke);
            expect(this.player1).not.toBeAbleToSelect(this.stomp);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
