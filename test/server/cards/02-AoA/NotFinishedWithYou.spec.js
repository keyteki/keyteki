describe('Not Finished With You', function () {
    describe("Not Finished With You's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['not-finished-with-you'],
                    discard: [
                        'troll',
                        'urchin',
                        'bloodshard-imp',
                        'pound',
                        'signal-fire',
                        'bonerot-venom'
                    ]
                },
                player2: {
                    discard: ['krump']
                }
            });
        });

        it('shuffles selected creatures from any house in discard back into the deck and ignores non-creatures', function () {
            this.player1.play(this.notFinishedWithYou);
            // Creatures from three different houses are selectable
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.bloodshardImp);
            // Action, artifact, and upgrade in discard are not selectable
            expect(this.player1).not.toBeAbleToSelect(this.pound);
            expect(this.player1).not.toBeAbleToSelect(this.signalFire);
            expect(this.player1).not.toBeAbleToSelect(this.bonerotVenom);
            // Opponent's creatures in their discard are not selectable
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.bloodshardImp);
            this.player1.clickPrompt('Done');
            expect(this.troll.location).toBe('deck');
            expect(this.urchin.location).toBe('deck');
            expect(this.bloodshardImp.location).toBe('deck');
            expect(this.pound.location).toBe('discard');
            expect(this.signalFire.location).toBe('discard');
            expect(this.bonerotVenom.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('allows selecting no creatures', function () {
            this.player1.play(this.notFinishedWithYou);
            this.player1.clickPrompt('Done');
            expect(this.troll.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.bloodshardImp.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
