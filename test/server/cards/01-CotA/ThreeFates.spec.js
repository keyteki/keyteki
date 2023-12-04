describe('Three Fates', function () {
    describe("Three Fates's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['ember-imp', 'urchin', 'dominator-bauble'],
                    hand: ['three-fates', 'hand-of-dis']
                },
                player2: {
                    inPlay: ['zorg', 'troll', 'batdrone']
                }
            });
        });

        it('should prompt the player to choose 3 creatures', function () {
            this.player1.play(this.threeFates);
            expect(this.player1).toHavePrompt('Three Fates');
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.zorg);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.troll);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.emberImp);
            this.player1.clickPrompt('Done');
            expect(this.zorg.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.emberImp.location).toBe('discard');
        });

        it('should not allow clicking Done without a legal combination of targets', function () {
            this.player1.play(this.threeFates);
            this.player1.clickCard(this.zorg);
            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.batdrone);
            expect(this.player1).not.toHavePromptButton('Done');
        });

        it('should work when there is only 1 creature in play', function () {
            this.player1.play(this.handOfDis);
            this.player1.clickCard(this.troll);
            this.player1.fightWith(this.emberImp, this.batdrone);
            this.player1.clickCard(this.dominatorBauble);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toHavePrompt('Dominator Bauble');
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.zorg);
            expect(this.batdrone.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.emberImp.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            this.player1.play(this.threeFates);
            expect(this.player1).toHavePrompt('Three Fates');
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.zorg);
            this.player1.clickPrompt('Done');
            expect(this.zorg.location).toBe('discard');
        });

        it('should work when there is only 2 creatures in play', function () {
            this.player1.play(this.handOfDis);
            this.player1.clickCard(this.troll);
            this.player1.fightWith(this.emberImp, this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.emberImp.location).toBe('discard');
            this.player1.play(this.threeFates);
            expect(this.player1).toHavePrompt('Three Fates');
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.zorg);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Done');
            expect(this.zorg.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
        });
    });

    describe('bug with two 5s and two 3s', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['three-fates']
                },
                player2: {
                    inPlay: ['shooler', 'ancient-bear', 'murmook', 'witch-of-the-eye']
                }
            });
            this.player1.play(this.threeFates);
        });

        it('should allow selecting all the creatures', function () {
            expect(this.player1).toHavePrompt('Three Fates');
            expect(this.player1).toBeAbleToSelect(this.shooler);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            expect(this.player1).toBeAbleToSelect(this.murmook);
            expect(this.player1).toBeAbleToSelect(this.witchOfTheEye);
            expect(this.player1).not.toHavePromptButton('Done');
        });
    });
});
