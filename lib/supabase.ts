import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Representative {
  rep_id: number
  whatsapp: string
  name: string
  active: boolean
  created_at: string
}

export async function checkRepresentativeAuth(repId: number): Promise<Representative | null> {
  try {
    const { data, error } = await supabase
      .from('representatives_auth')
      .select('*')
      .eq('rep_id', repId)
      .eq('active', true)
      .maybeSingle()

    if (error) {
      console.error('Error checking representative:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error checking representative:', error)
    return null
  }
}
