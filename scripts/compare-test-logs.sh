#!/bin/bash

# Runs tests with debug output for current branch and main, saving logs to /tmp
# Skips running if log file already exists

set -euo pipefail

current_branch=$(git branch --show-current)
if [[ -z "$current_branch" ]]; then
    echo "Not on a branch"
    exit 1
fi

if [[ "$current_branch" == "main" ]]; then
    echo "Already on main, nothing to compare"
    exit 0
fi

run_tests_for_branch() {
    local branch=$1
    local safe_branch=$(echo "$branch" | sed 's/[^a-zA-Z0-9._-]/-/g')
    local commit_hash=$(git rev-parse --short "$branch")
    local log_file="/tmp/${safe_branch}-${commit_hash}.log"
    local switched=false

    if [[ -f "$log_file" ]]; then
        echo "Log already exists: $log_file"
        return 0
    fi

    echo "Running tests for $branch -> $log_file"

    # Checkout branch if not current
    if [[ "$branch" != "$current_branch" ]]; then
        git stash -q --include-untracked 2>/dev/null || true
        git checkout -q "$branch"
        switched=true
    fi

    # Run tests, capturing exit code (strip timestamps from output)
    set +e
    DEBUG_TEST=1 npm test 2>&1 | sed 's/^[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\} [0-9]\{2\}:[0-9]\{2\}:[0-9]\{2\} //' > "$log_file"
    local test_exit=${PIPESTATUS[0]}
    set -e

    # Return to original branch
    if [[ "$switched" == "true" ]]; then
        git checkout -q "$current_branch"
        git stash pop -q 2>/dev/null || true
    fi

    if [[ $test_exit -ne 0 ]]; then
        echo "Tests failed for $branch (exit $test_exit), deleting: $log_file"
        # rm -f "$log_file"
        return $test_exit
    fi

    echo "Saved: $log_file"
}

run_tests_for_branch "$current_branch"
run_tests_for_branch "master"

safe_current_branch=$(echo "$current_branch" | sed 's/[^a-zA-Z0-9._-]/-/g')
current_log="/tmp/${safe_current_branch}-$(git rev-parse --short "$current_branch").log"
master_log="/tmp/master-$(git rev-parse --short master).log"

echo ""
echo "Log files:"
echo "  Current: $current_log"
echo "  Main:    $master_log"
echo ""
echo "Compare with:"
echo "  diff $master_log $current_log"
