
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BRAWLSTARS_BASE_URL = "https://api.brawlstars.com/v1"
const API_KEY             = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjA2YjM2MDQ3LTZkNmEtNDM1ZC05ZGExLWZjNzExM2Y1YTA4YSIsImlhdCI6MTc0MDE0OTgyMCwic3ViIjoiZGV2ZWxvcGVyLzNiN2Q0YWI5LWZkZTQtY2E2MC01ZjAyLWY0MDRiOWQ2YmMxNCIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiODkuMTgxLjIzMC4yNiJdLCJ0eXBlIjoiY2xpZW50In1dfQ.Wr8RsAxgxCuxc9VcvIPpnc3EzaHYb28VyWikB_5ooxMR-qNTmFlCuNjIherKrx4GTA39aOJ9yFtT_t8QwjuTgw'

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
      console.error('Player API response error: test ', await playerResponse.text())
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
    
    // Call the store_player_data function
    const { error } = await supabase.rpc('store_player_data', {
      p_tag: formattedTag,
      p_name: playerData.name,
      p_trophies: playerData.trophies,
      p_highest_trophies: playerData.highestTrophies,
      p_battles: battleData.items
    })

    if (error) {
      console.error('Error storing player data:', error)
      return new Response(
        JSON.stringify({ error: "Failed to store player data" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
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
