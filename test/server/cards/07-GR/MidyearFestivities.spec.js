describe('Midyear Festivities', function () {
    describe("Midyear Festivities's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['midyear-festivities'],
                    inPlay: [
                        'flaxia',
                        'dust-pixie',
                        'gemcoat-vendor',
                        'ironyx-rebel',
                        'hunting-witch',
                        'mindwarper'
                    ]
                },
                player2: {
                    amber: 1,
                    inPlay: [
                        'faust-the-great',
                        'brikk-nastee',
                        'groke',
                        'praefectus-ludo',
                        'urchin',
                        'culf-the-quiet'
                    ]
                }
            });
        });

        it('can return amber from 9 creatures and destroy them', function () {
            this.flaxia.amber = 2;
            this.gemcoatVendor.amber = 1;
            this.faustTheGreat.amber = 1;
            this.groke.amber = 3;
            this.urchin.amber = 2;

            this.player1.play(this.midyearFestivities);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.gemcoatVendor);
            expect(this.player1).toBeAbleToSelect(this.ironyxRebel);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.faustTheGreat);
            expect(this.player1).toBeAbleToSelect(this.brikkNastee);
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).toBeAbleToSelect(this.praefectusLudo);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.culfTheQuiet);

            this.player1.clickCard(this.faustTheGreat);
            this.player1.clickCard(this.brikkNastee);
            this.player1.clickCard(this.groke);
            this.player1.clickCard(this.praefectusLudo);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.culfTheQuiet);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.huntingWitch);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');

            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(7);
            this.player1.clickPrompt('Autoresolve');
            expect(this.faustTheGreat.location).toBe('discard');
            expect(this.brikkNastee.location).toBe('discard');
            expect(this.groke.location).toBe('discard');
            expect(this.praefectusLudo.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.culfTheQuiet.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('discard');

            expect(this.gemcoatVendor.location).toBe('play area');
            expect(this.ironyxRebel.location).toBe('play area');
            expect(this.mindwarper.location).toBe('play area');

            expect(this.player1).isReadyToTakeAction();
        });

        it('can destroy fewer than 9 creatures', function () {
            this.player1.moveCard(this.gemcoatVendor, 'discard');
            this.player1.moveCard(this.ironyxRebel, 'discard');
            this.player1.moveCard(this.mindwarper, 'discard');
            this.player2.moveCard(this.urchin, 'discard');

            this.player1.play(this.midyearFestivities);
            this.player1.clickCard(this.faustTheGreat);
            this.player1.clickCard(this.brikkNastee);
            this.player1.clickCard(this.groke);
            this.player1.clickCard(this.praefectusLudo);
            this.player1.clickCard(this.culfTheQuiet);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.huntingWitch);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');

            this.player1.clickPrompt('Autoresolve');
            expect(this.faustTheGreat.location).toBe('discard');
            expect(this.brikkNastee.location).toBe('discard');
            expect(this.groke.location).toBe('discard');
            expect(this.praefectusLudo.location).toBe('discard');
            expect(this.culfTheQuiet.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('discard');

            expect(this.player1).isReadyToTakeAction();
        });
    });
});
