import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Load environment variables
const SUPABASE_URL              = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BRAWLSTARS_API_KEY        = process.env.NEXT_PUBLIC_SECRET_API_KEY;
const BRAWLSTARS_BASE_URL       = process.env.NEXT_PUBLIC_PUBLIC_BASE_URL || 'https://api.brawlstars.com/v1';

// Initialize Supabase client with service role key for admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

console.log('Starting player trophy update script...');

async function updatePlayerTrophies() {
  try {
    // Get all players who have been visited in the last 30 days
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('tag, name')
      .gte('visited_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (playersError) {
      console.error('Error fetching players:', playersError);
      return;
    }

    console.log(`Found ${players.length} players to update`);

    // Process each player
    for (const player of players) {
      try {
        console.log(`Processing player: ${player.name} (${player.tag})`);
        
        // Format the tag for the API request (removing # if present)
        const formattedTag = player.tag.replace('#', '');
        
        // Call the Brawl Stars API
        const response = await axios.get(`${BRAWLSTARS_BASE_URL}/players/%23${formattedTag}`, {
          headers: {
            'Authorization': `Bearer ${BRAWLSTARS_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status !== 200) {
          console.error(`API error for player ${player.tag}: ${response.status}`);
          continue;
        }
        
        const playerData = response.data;
        
        // Insert data into player_trophies table
        const { error: insertError } = await supabase
          .from('player_trophies')
          .insert({
            player_tag: player.tag,
            trophies: playerData.trophies,
            highest_trophies: playerData.highestTrophies,
            recorded_at: new Date().toISOString()
          });
          
        if (insertError) {
          console.error(`Error inserting trophies for player ${player.tag}:`, insertError);
        } else {
          console.log(`Successfully updated trophies for ${player.name}: ${playerData.trophies}`);
        }
        
        // Prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (playerError) {
        console.error(`Error processing player ${player.tag}:`, playerError.message);
      }
    }
    
    console.log('Trophy update complete!');
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

// Run the update function
updatePlayerTrophies().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
