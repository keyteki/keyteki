describe('Ixxyxli Fixfinger', function () {
    describe("Ixxyxli Fixfinger's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['ixxyxli-fixfinger', 'zorg', 'uxlyx-the-zookeeper'],
                    hand: ['inka-the-spider']
                },
                player2: {
                    inPlay: ['yxlyx-stimrager']
                }
            });
        });

        it('should give +1 armor to martian creatures other than the Ixxyxli Fixfinger', function () {
            expect(this.ixxyxliFixfinger.armor).toBe(2);
            expect(this.zorg.armor).toBe(0);
            expect(this.uxlyxTheZookeeper.armor).toBe(1);
            expect(this.yxlyxStimrager.armor).toBe(3);
        });
    });
});
