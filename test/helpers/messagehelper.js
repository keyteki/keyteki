/**
 * Checks that all log messages match exactly.
 * @param {Object} context - The test context (this)
 * @param {Array<string>} expectedMessages - Array of messages to check in order
 * @returns {Object} Result with pass boolean and message function
 */
function checkAllMessages(context, expectedMessages) {
    if (!expectedMessages || expectedMessages.length === 0) {
        return { pass: false, message: () => 'Expected messages array cannot be empty' };
    }

    const logs = context.getChatLogs(Infinity);

    // Find the start of logs - after the turn 2 player1 house choice
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
            message: () => `Start of logs not found\n\nGame logs:\n${logs.join('\n')}\n`
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
                    }"\n\nGame logs:\n${relevantLogs.join('\n')}\n`
            };
        }

        if (!relevantLogs[i].includes(expectedMessages[i])) {
            return {
                pass: false,
                message: () =>
                    `Message mismatch at position ${i}.\nExpected: "${
                        expectedMessages[i]
                    }"\nActual:   "${relevantLogs[i]}"\n\nGame logs:\n${relevantLogs.join('\n')}\n`
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
                    .join('\n')}\n\nGame logs:\n${relevantLogs.join('\n')}\n`
        };
    }

    return { pass: true, message: () => '' };
}

module.exports = { checkAllMessages };
