
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    // Get the API key from environment variables
    const apiKey = Deno.env.get('NEXT_PUBLIC_SECRET_API_KEY') || ''
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key is not configured in environment variables" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Create a database function to set the API key parameter
    const { error: createFunctionError } = await supabase.rpc('create_set_api_key_function')
    
    if (createFunctionError) {
      console.error('Error creating set_brawlstars_api_key function:', createFunctionError)
      return new Response(
        JSON.stringify({ error: "Failed to create set_brawlstars_api_key function" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Set the API key using the newly created function
    const { error: setKeyError } = await supabase.rpc('set_brawlstars_api_key', {
      api_key: apiKey
    })
    
    if (setKeyError) {
      console.error('Error setting API key for cron job:', setKeyError)
      return new Response(
        JSON.stringify({ error: "Failed to set API key for cron job" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: "API key set successfully for cron job" }),
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
