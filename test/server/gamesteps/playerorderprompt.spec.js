const PlayerOrderPrompt = require('../../../server/game/gamesteps/playerorderprompt.js');

describe('the PlayerOrderPrompt', function () {
    beforeEach(function () {
        this.activePrompt = { active: true };
        this.waitingPrompt = { active: false };

        this.game = {
            getPlayers: vi.fn(),
            getPlayersInFirstPlayerOrder: vi.fn()
        };
        this.player1 = {
            setPrompt: vi.fn(),
            cancelPrompt: vi.fn(),
            startClock: vi.fn(),
            stopClock: vi.fn()
        };
        this.player2 = {
            setPrompt: vi.fn(),
            cancelPrompt: vi.fn(),
            startClock: vi.fn(),
            stopClock: vi.fn()
        };

        this.game.getPlayers.mockReturnValue([this.player1, this.player2]);
        this.game.getPlayersInFirstPlayerOrder.mockReturnValue([this.player2, this.player1]);

        this.prompt = new PlayerOrderPrompt(this.game);
        vi.spyOn(this.prompt, 'activePrompt').mockReturnValue(this.activePrompt);
        vi.spyOn(this.prompt, 'waitingPrompt').mockReturnValue(this.waitingPrompt);
    });

    describe('the continue() function', function () {
        describe('when there is a skip condition', function () {
            beforeEach(function () {
                vi.spyOn(this.prompt, 'skipCondition').mockImplementation(
                    (p) => p === this.player2
                );
            });

            it('should skip over the matching players', function () {
                this.prompt.continue();
                expect(this.prompt.currentPlayer).toBe(this.player1);
            });
        });

        describe('when the prompt is incomplete', function () {
            it('should prompt players in first-player order', function () {
                this.prompt.continue();
                expect(this.prompt.currentPlayer).toBe(this.player2);
            });

            it('should give the active prompt to the current player', function () {
                this.prompt.continue();
                expect(this.player2.setPrompt).toHaveBeenCalledWith(this.activePrompt);
            });

            it('should give the waiting prompt to the remaining players', function () {
                this.prompt.continue();
                expect(this.player1.setPrompt).toHaveBeenCalledWith(this.waitingPrompt);
            });

            it('should return false', function () {
                expect(this.prompt.continue()).toBe(false);
            });
        });

        describe('when each player has been completed', function () {
            beforeEach(function () {
                this.prompt.completePlayer();
                this.prompt.completePlayer();
            });

            it('should set the cancel prompts for each player', function () {
                this.prompt.continue();
                expect(this.player1.cancelPrompt).toHaveBeenCalled();
                expect(this.player2.cancelPrompt).toHaveBeenCalled();
            });

            it('should return true', function () {
                expect(this.prompt.continue()).toBe(true);
            });
        });

        describe('when the first player order changes after construction', function () {
            beforeEach(function () {
                this.game.getPlayersInFirstPlayerOrder.mockReturnValue([
                    this.player1,
                    this.player2
                ]);
            });

            it('should prompt players in the current first-player order', function () {
                this.prompt.continue();
                expect(this.prompt.currentPlayer).toBe(this.player1);
            });

            it('should give the active prompt to the current player', function () {
                this.prompt.continue();
                expect(this.player1.setPrompt).toHaveBeenCalledWith(this.activePrompt);
            });

            it('should give the waiting prompt to the remaining players', function () {
                this.prompt.continue();
                expect(this.player2.setPrompt).toHaveBeenCalledWith(this.waitingPrompt);
            });

            it('should return false', function () {
                expect(this.prompt.continue()).toBe(false);
            });
        });
    });
});
