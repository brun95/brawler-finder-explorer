
# Brawl Stars Scripts

This folder contains utility scripts for the Brawl Stars application.

## Update Player Trophies

The `updatePlayerTrophies.js` script updates trophy data for all players who have been visited in the last 30 days.

### Prerequisites

- Node.js installed
- Required environment variables set in the `.env` file (at the root of the project)

### Required environment variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `VITE_SECRET_API_KEY`: Your Brawl Stars API key

### Running the script

```bash
# From the project root
node scripts/updatePlayerTrophies.js
```

This script will:
1. Connect to your Supabase database
2. Fetch all players who have been visited in the last 30 days
3. Call the Brawl Stars API to get updated trophy data for each player
4. Save the updated trophy information to the database

You can set up this script to run on a schedule (e.g., daily) using a cron job or similar task scheduler.
