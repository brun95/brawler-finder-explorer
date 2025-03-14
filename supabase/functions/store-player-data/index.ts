
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BRAWLSTARS_BASE_URL = "https://api.brawlstars.com/v1"
const API_KEY = Deno.env.get('VITE_SECRET_API_KEY') || ''

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse the request body for manual data storage
    const { tag } = await req.json()
    
    if (!tag) {
      return new Response(
        JSON.stringify({ error: "Player tag is required" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Remove # if present and format the tag
    const formattedTag = tag.replace('#', '')
    
    console.log(`Fetching data for player: ${formattedTag}`)
    
    // Fetch player data
    const playerResponse = await fetch(`${BRAWLSTARS_BASE_URL}/players/%23${formattedTag}`, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json" 
      },
    })

    if (!playerResponse.ok) {
      console.error('Player API response error: ', await playerResponse.text())
      return new Response(
        JSON.stringify({ error: "Failed to fetch player data" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const playerData = await playerResponse.json()
    
    // Fetch battle log
    const battleResponse = await fetch(`${BRAWLSTARS_BASE_URL}/players/%23${formattedTag}/battlelog`, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json" 
      },
    })

    if (!battleResponse.ok) {
      console.error('Battle API response error:', await battleResponse.text())
      return new Response(
        JSON.stringify({ error: "Failed to fetch battle log" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const battleData = await battleResponse.json()
    
    // Call the store_player_data function - now it only updates player info and visited_at
    const { error } = await supabase.rpc('store_player_data', {
      p_tag             : formattedTag,
      p_name            : playerData.name,
      p_trophies        : playerData.trophies,
      p_highest_trophies: playerData.highestTrophies,
      p_battles         : battleData.items
    })

    if (error) {
      console.error('Error storing player data:', error)
      return new Response(
        JSON.stringify({ error: "Failed to store player data" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Set the Brawl Stars API key as a database parameter for the cron job
    try {
      const { error: setKeyError } = await supabase.rpc('set_brawlstars_api_key', {
        api_key: API_KEY
      })
      
      if (setKeyError) {
        console.error('Error setting API key for cron job:', setKeyError)
        // Continue even if setting the key failed
      }
    } catch (keyError) {
      console.error('Error setting API key for cron job:', keyError)
      // Continue even if setting the key failed
    }

    return new Response(
      JSON.stringify({ success: true, message: "Player data stored successfully" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
