describe("Aero O'Fore", function () {
    describe("Aero O'Fore's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['gub', 'charette', 'aero-o-fore', 'troll', 'krump']
                },
                player2: {
                    amber: 6
                }
            });
        });

        it('should do nothing if not in center', function () {
            this.player2.moveCard(this.troll, 'discard');
            this.player1.reap(this.aeroOFore);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should rearrange battleline and capture onto flank creatures when in center', function () {
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.gub);
            expect(this.player1.player.creaturesInPlay[3]).toBe(this.troll);
            this.player1.reap(this.aeroOFore);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.aeroOFore);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.gub);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.troll);
            expect(this.player1.player.creaturesInPlay[3]).toBe(this.gub);
            this.player1.clickPrompt('Done');
            expect(this.troll.amber).toBe(2);
            expect(this.krump.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be able to rearrange itself to flank and capture', function () {
            this.player1.reap(this.aeroOFore);
            this.player1.clickCard(this.gub);
            this.player1.clickCard(this.aeroOFore);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Done');
            expect(this.aeroOFore.amber).toBe(2);
            expect(this.krump.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be able to distribute less than 4 amber between flank creatures', function () {
            this.player2.amber = 3;
            this.player1.reap(this.aeroOFore);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.gub);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');
            expect(this.gub.amber).toBe(2);
            expect(this.krump.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when it leaves and re-enters the center during reap timing', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['chan-s-blaster', 'walls--blaster'],
                    inPlay: ['nexus', 'urchin', 'aero-o-fore', 'umbra', 'dodger']
                },
                player2: {
                    amber: 10
                }
            });

            this.player1.makeMaverick(this.chanSBlaster, 'skyborn');
            this.player1.makeMaverick(this.wallsBlaster, 'skyborn');
        });

        it('should capture 2 again after regaining center later in the same reap window', function () {
            this.player1.playUpgrade(this.chanSBlaster, this.aeroOFore);
            this.player1.playUpgrade(this.wallsBlaster, this.aeroOFore);
            this.player1.reap(this.aeroOFore);

            // Aero O'Fore capture 4
            this.player1.clickCard(this.aeroOFore);
            this.player1.clickPrompt(this.aeroOFore.name);
            this.player1.clickPrompt('Done');
            expect(this.nexus.amber).toBe(2);
            expect(this.dodger.amber).toBe(2);
            expect(this.player2.amber).toBe(6);

            // Chan's Blaster kill Urchin
            this.player1.clickCard(this.aeroOFore);
            this.player1.clickPrompt(this.chanSBlaster.name);
            this.player1.clickPrompt('Deal 2 damage');
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.aeroOFore.isInCenter()).toBe(false);

            // Wall's Blaster kill Umbra
            this.player1.clickCard(this.aeroOFore);
            this.player1.clickPrompt('Deal 2 damage');
            this.player1.clickCard(this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.aeroOFore.isInCenter()).toBe(true);

            // Aero O'Fore capture 2 again
            this.player1.clickPrompt('Done');
            expect(this.nexus.amber).toBe(4);
            expect(this.dodger.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
