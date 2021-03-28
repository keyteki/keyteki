describe('Medic Ingram', function () {
    describe("Medic Ingram's play/reap/fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['troll', 'valdr'],
                    hand: ['medic-ingram']
                },
                player2: {
                    inPlay: ['lamindra', 'krump']
                }
            });
            expect(this.troll.warded).toBe(false);
            expect(this.valdr.warded).toBe(false);
            expect(this.medicIngram.warded).toBe(false);
            expect(this.lamindra.warded).toBe(false);
            expect(this.krump.warded).toBe(false);

            this.troll.tokens['damage'] = 1;
            this.valdr.tokens['damage'] = 3;
            this.krump.tokens['damage'] = 5;
        });

        it('Play may heal any creature', function () {
            this.player1.play(this.medicIngram);

            expect(this.player1).toHavePrompt('Medic Ingram');
            expect(this.player1).toHavePromptButton('Done');

            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.valdr);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.medicIngram);

            expect(this.troll.warded).toBe(false);
            expect(this.valdr.warded).toBe(false);
            expect(this.medicIngram.warded).toBe(true);
            expect(this.krump.warded).toBe(false);

            expect(this.troll.tokens.damage).toBe(1);
            expect(this.valdr.tokens.damage).toBe(3);
            expect(this.krump.tokens.damage).toBe(5);
        });

        it('Reap may heal any creature', function () {
            this.player1.play(this.medicIngram);
            this.player1.clickCard(this.medicIngram);

            this.medicIngram.ready();
            this.player1.reap(this.medicIngram);

            expect(this.player1).toHavePrompt('Medic Ingram');
            expect(this.player1).toHavePromptButton('Done');

            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.valdr);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.troll);

            expect(this.troll.warded).toBe(true);
            expect(this.valdr.warded).toBe(false);
            expect(this.medicIngram.warded).toBe(true);
            expect(this.krump.warded).toBe(false);

            expect(this.troll.hasToken('damage')).toBe(false);
            expect(this.valdr.tokens.damage).toBe(3);
            expect(this.krump.tokens.damage).toBe(5);
        });

        it('Fight may heal any creature', function () {
            this.player1.play(this.medicIngram);
            this.player1.clickCard(this.medicIngram);

            this.medicIngram.ready();
            this.player1.fightWith(this.medicIngram, this.lamindra);

            expect(this.player1).toHavePrompt('Medic Ingram');
            expect(this.player1).toHavePromptButton('Done');

            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.valdr);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.valdr);

            expect(this.troll.warded).toBe(false);
            expect(this.valdr.warded).toBe(true);
            expect(this.medicIngram.warded).toBe(true);
            expect(this.krump.warded).toBe(false);

            expect(this.troll.tokens.damage).toBe(1);
            expect(this.valdr.hasToken('damage')).toBe(false);
            expect(this.krump.tokens.damage).toBe(5);
        });

        it('Play may heal maximum of 3', function () {
            this.player1.play(this.medicIngram);
            this.player1.clickCard(this.krump);

            expect(this.troll.warded).toBe(false);
            expect(this.valdr.warded).toBe(false);
            expect(this.medicIngram.warded).toBe(false);
            expect(this.krump.warded).toBe(true);

            expect(this.troll.tokens.damage).toBe(1);
            expect(this.valdr.tokens.damage).toBe(3);
            expect(this.krump.tokens.damage).toBe(2);
        });
    });
});
