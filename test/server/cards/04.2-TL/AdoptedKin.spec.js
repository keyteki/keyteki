describe('Adopted Kin', function() {
    integration(function() {
        describe('Adopted Kin\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['niten-adept', 'doomed-shugenja'],
                        hand: ['adopted-kin', 'fine-katana', 'ancient-master', 'reprieve']
                    },
                    player2: {
                        inPlay: ['miya-mystic'],
                        hand: ['assassination', 'cloud-the-mind']
                    }
                });
                this.adept = this.player1.findCardByName('niten-adept');
                this.shugenja = this.player1.findCardByName('doomed-shugenja');
                this.katana = this.player1.findCardByName('fine-katana');
                this.master = this.player1.findCardByName('ancient-master');
                this.kin = this.player1.findCardByName('adopted-kin');
                this.reprieve = this.player1.findCardByName('reprieve');
                this.mystic = this.player2.findCardByName('miya-mystic');
                this.cloud = this.player2.findCardByName('cloud-the-mind');
                this.assassination = this.player2.findCardByName('assassination');

                this.player1.playAttachment(this.kin, this.adept);
                this.player2.pass();
                this.player1.playAttachment(this.katana, this.adept);
                this.player2.pass();
                this.player1.clickCard(this.master);
                this.player1.clickPrompt('Play Ancient Master as an attachment');
                this.player1.clickCard(this.adept);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adept]
                });
                this.player1.pass();
                this.player2.clickPrompt('Done');
            });

            it('should return other attachments to hand when attached character is discarded', function() {
                expect(this.player1.player.hand.size()).toBe(1);
                this.player2.clickCard(this.cloud);
                this.player2.clickCard(this.adept);
                this.player1.pass();
                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.adept);
                expect(this.player1.player.hand.size()).toBe(3);
                expect(this.player1.player.hand).toContain(this.katana);
                expect(this.player1.player.hand).toContain(this.master);
                expect(this.player2.player.hand).toContain(this.cloud);
            });

            it('should only give the "ancestral"-keyword to attachments on attached character', function() {
                this.player2.clickCard(this.cloud);
                this.player2.clickCard(this.mystic);
                this.player1.clickCard(this.reprieve);
                this.player1.clickCard(this.shugenja);
                expect(this.cloud.hasKeyword('ancestral')).toBe(false);
                expect(this.reprieve.hasKeyword('ancestral')).toBe(false);
            });
        });

        describe('Adopted Kin', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['niten-adept'],
                        hand: ['adopted-kin', 'fine-katana', 'ancient-master']
                    },
                    player2: {
                        hand: ['let-go', 'fiery-madness']
                    }
                });
                this.adept = this.player1.findCardByName('niten-adept');
                this.katana = this.player1.findCardByName('fine-katana');
                this.master = this.player1.findCardByName('ancient-master');
                this.kin = this.player1.findCardByName('adopted-kin');
                this.letGo = this.player2.findCardByName('let-go');
                this.madness = this.player2.findCardByName('fiery-madness');
                this.player1.playAttachment(this.kin, this.adept);
                this.player2.pass();
                this.player1.playAttachment(this.katana, this.adept);
                this.player2.playAttachment(this.madness, this.adept);
                this.player1.clickCard(this.master);
                this.player1.clickPrompt('Play Ancient Master as an attachment');
                this.player1.clickCard(this.adept);
            });

            it('should give every other attachment the "ancestral"-keyword', function() {
                expect(this.katana.hasKeyword('ancestral')).toBe(true);
                expect(this.master.hasKeyword('ancestral')).toBe(true);
                expect(this.madness.hasKeyword('ancestral')).toBe(true);
                expect(this.kin.hasKeyword('ancestral')).toBe(false);
            });

            it('should make every other attachment lose the "ancestral"-keyword if removed from character', function() {
                this.player2.clickCard(this.letGo);
                this.player2.clickCard(this.kin);
                expect(this.katana.hasKeyword('ancestral')).toBe(false);
                expect(this.master.hasKeyword('ancestral')).toBe(false);
                expect(this.madness.hasKeyword('ancestral')).toBe(false);
            });
        });

        describe('Adopted Kin', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['niten-adept', 'doomed-shugenja'],
                        hand: ['adopted-kin', 'adopted-kin', 'cloud-the-mind']
                    },
                    player2: {
                        inPlay: ['doji-challenger'],
                        hand: ['duelist-training']
                    }
                });
                this.adept = this.player1.findCardByName('niten-adept');
                this.shugenja = this.player1.findCardByName('doomed-shugenja');
                this.player1.playAttachment('adopted-kin', this.adept);
                this.kin = this.player1.findCardByName('adopted-kin', 'hand');
                this.cloud = this.player1.findCardByName('cloud-the-mind');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.training = this.player2.findCardByName('duelist-training');
                this.player2.pass();
            });

            it('should not be able to be attached twice to the same character', function() {
                this.player1.clickCard(this.kin);
                expect(this.player1).toBeAbleToSelect(this.shugenja);
                expect(this.player1).not.toBeAbleToSelect(this.adept);
            });

            it('should also work when attached to opponent\'s character', function() {
                this.player1.playAttachment(this.kin, this.challenger);
                this.player2.playAttachment(this.training, this.challenger);
                this.player1.playAttachment(this.cloud, this.challenger);
                expect(this.training.hasKeyword('ancestral')).toBe(true);
                expect(this.cloud.hasKeyword('ancestral')).toBe(true);
                expect(this.kin.hasKeyword('ancestral')).toBe(false);
            });
        });
    });
});
