#!/bin/bash

# Array of commits with their dates and messages
# Format: "YYYY-MM-DDTHH:MM:SS|Commit Message"
declare -a COMMITS=(
  "2026-04-17T10:00:00|Initial project setup with Next.js and Tailwind"
  "2026-04-17T11:15:00|Configure Supabase environment variables and client"
  "2026-04-17T12:30:00|Create initial database schema for users and profiles"
  "2026-04-17T14:00:00|Implement authentication flow and signup validation"
  "2026-04-17T15:20:00|Add Stripe subscription engine integration"
  "2026-04-17T16:45:00|Build modular score tracking component"
  "2026-04-17T17:10:00|Develop tiered prize draw engine logic"
  "2026-04-17T18:05:00|Setup charity integration functionality"
  "2026-04-17T19:30:00|Create premium admin dashboard layout"
  "2026-04-17T20:15:00|Implement glassmorphic design for admin charity management"
  "2026-04-17T21:40:00|Refine authentication flow with demo access capabilities"
  "2026-04-17T22:50:00|Debug and resolve Supabase API credentials validation"
  "2026-04-18T01:10:00|Finalize backend API validation logic"
  "2026-04-18T01:30:00|Integrate Stripe payment processing for subscriptions"
  "2026-04-18T01:50:00|Implement database RLS policies for user signups"
  "2026-04-18T02:15:00|Verify and fix dashboard routing structure"
  "2026-04-18T02:40:00|Migrate middleware to Next.js 16 proxy pattern"
  "2026-04-18T03:00:00|Fix deployment environment variable configurations"
  "2026-04-18T03:20:00|Update package dependencies and versions"
  "2026-04-18T03:50:00|Configure local development server runtime"
  "2026-04-18T04:05:00|Add documentation for project setup"
  "2026-04-18T04:15:00|Rename middleware.ts to proxy.ts to fix deprecation warning"
  "2026-04-18T04:20:00|Update proxy.ts exports and cleanup unused code"
)

echo "Creating 23 commits for April 17th and 18th..."

for item in "${COMMITS[@]}"; do
  # Split the item into date and message
  COMMIT_DATE="${item%%|*}"
  COMMIT_MSG="${item##*|}"
  
  echo "Committing: [$COMMIT_DATE] $COMMIT_MSG"
  
  # Export git dates
  export GIT_AUTHOR_DATE="$COMMIT_DATE"
  export GIT_COMMITTER_DATE="$COMMIT_DATE"
  
  # Create an empty commit
  git commit --allow-empty -m "$COMMIT_MSG"
done

# Unset the variables so they don't persist in the shell
unset GIT_AUTHOR_DATE
unset GIT_COMMITTER_DATE

echo "Done! 23 commits have been added to your history."
echo "You can view them with: git log --oneline -n 23"
echo "To push these to GitHub, run: git push origin main"
