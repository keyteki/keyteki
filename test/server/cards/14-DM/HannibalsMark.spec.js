describe("Hannibal's Mark", function () {
    describe("Hannibal's Mark's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['hannibal-s-mark']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('takes control of an enemy flank creature, makes it Skyborn, and adds 3 power counters', function () {
            this.player1.play(this.hannibalSMark);
            this.player1.clickCard(this.troll);
            expect(this.troll.controller).toBe(this.player1.player);
            expect(this.troll.hasHouse('skyborn')).toBe(true);
            expect(this.troll.powerCounters).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot target a non-flank enemy creature', function () {
            this.player1.play(this.hannibalSMark);
            this.player1.clickCard(this.krump);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Hannibal's Mark when controlled creature changes hands", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['hannibal-s-mark', 'maqui-expedition']
                },
                player2: {
                    amber: 1,
                    hand: ['now-and-later', 'mack-the-knife', 'rein-and-cycle'],
                    inPlay: ['gemcoat-vendor']
                }
            });
        });

        it('does not re-apply Skyborn after the creature is bounced, replayed, and taken again', function () {
            this.player1.play(this.hannibalSMark);
            this.player1.clickCard(this.gemcoatVendor);
            expect(this.gemcoatVendor.controller).toBe(this.player1.player);
            expect(this.gemcoatVendor.hasHouse('skyborn')).toBe(true);

            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.play(this.nowAndLater);
            this.player2.clickCard(this.gemcoatVendor);
            expect(this.gemcoatVendor.location).toBe('hand');
            this.player2.clickCard(this.mackTheKnife);
            this.player2.play(this.gemcoatVendor);
            expect(this.gemcoatVendor.location).toBe('play area');
            expect(this.gemcoatVendor.controller).toBe(this.player2.player);
            expect(this.gemcoatVendor.hasHouse('skyborn')).toBe(false);
            expect(this.gemcoatVendor.hasHouse('ekwidon')).toBe(true);

            this.player2.endTurn();
            this.player1.clickPrompt('skyborn');
            this.player1.play(this.maquiExpedition);
            this.player1.clickCard(this.gemcoatVendor);
            expect(this.gemcoatVendor.controller).toBe(this.player1.player);
            expect(this.gemcoatVendor.hasHouse('skyborn')).toBe(false);
            expect(this.gemcoatVendor.hasHouse('ekwidon')).toBe(true);
        });

        it('removes Skyborn while the opponent takes control and re-applies it when retaken', function () {
            this.player1.play(this.hannibalSMark);
            this.player1.clickCard(this.gemcoatVendor);
            expect(this.gemcoatVendor.controller).toBe(this.player1.player);
            expect(this.gemcoatVendor.hasHouse('skyborn')).toBe(true);

            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.reinAndCycle);
            this.player2.clickCard(this.gemcoatVendor);
            expect(this.gemcoatVendor.controller).toBe(this.player2.player);
            expect(this.gemcoatVendor.hasHouse('skyborn')).toBe(false);
            expect(this.gemcoatVendor.hasHouse('ekwidon')).toBe(true);

            this.player2.endTurn();
            this.player1.clickPrompt('skyborn');
            this.player1.play(this.maquiExpedition);
            this.player1.clickCard(this.gemcoatVendor);
            expect(this.gemcoatVendor.controller).toBe(this.player1.player);
            expect(this.gemcoatVendor.hasHouse('skyborn')).toBe(true);
        });
    });
});
