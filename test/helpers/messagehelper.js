/**
 * Checks that messages from the main phase match exactly.
 * @param {Object} context - The test context (this)
 * @param {Array<string>} expectedMessages - Array of messages to check in order
 * @param {Object} [options] - Optional configuration
 * @param {number} [options.numLogs=100] - Number of logs to retrieve
 * @returns {Object} Result with pass boolean and message function
 */
function checkAllMessages(context, expectedMessages, options = {}) {
    const { numLogs = 100 } = options;

    if (!expectedMessages || expectedMessages.length === 0) {
        return { pass: false, message: () => 'Expected messages array cannot be empty' };
    }

    const logs = context.getChatLogs(numLogs);

    // Find the second player1 house choice (start of main phase after setupTest completes)
    let houseChoiceCount = 0;
    let startIndex = logs.findIndex((log) => {
        if (log.includes('player1 chooses')) {
            houseChoiceCount++;
            return houseChoiceCount === 2;
        }
        return false;
    });
    if (startIndex === -1) {
        return {
            pass: false,
            message: () =>
                `Main phase start not found (expected 2nd occurrence of "player1 chooses")\nAvailable logs:\n${logs.join(
                    '\n'
                )}`
        };
    }
    startIndex += 1;

    const relevantLogs = logs.slice(startIndex).filter((log) => log.trim() !== '');

    for (let i = 0; i < expectedMessages.length; i++) {
        if (i >= relevantLogs.length) {
            return {
                pass: false,
                message: () =>
                    `Missing log entry at position ${i}. Expected: "${
                        expectedMessages[i]
                    }"\nLogs from main phase:\n${relevantLogs.join('\n')}`
            };
        }

        if (!relevantLogs[i].includes(expectedMessages[i])) {
            return {
                pass: false,
                message: () =>
                    `Message mismatch at position ${i}.\nExpected: "${
                        expectedMessages[i]
                    }"\nActual:   "${relevantLogs[i]}"\nLogs from main phase:\n${relevantLogs.join(
                        '\n'
                    )}`
            };
        }
    }

    if (relevantLogs.length > expectedMessages.length) {
        const extraLogs = relevantLogs.slice(expectedMessages.length);
        return {
            pass: false,
            message: () =>
                `Found ${extraLogs.length} unexpected log(s) after expected messages:\n${extraLogs
                    .map((log, i) => `  ${expectedMessages.length + i}: "${log}"`)
                    .join('\n')}\nLogs from main phase:\n${relevantLogs.join('\n')}`
        };
    }

    return { pass: true, message: () => 'Expected chat messages not to match but they did.' };
}

module.exports = { checkAllMessages };
