import { supabase, type Profile } from './supabase'

export async function signUp(email: string, password: string, fullName: string) {
  try {
    // Sign up the user - profile will be created automatically by trigger
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (authError) {
      throw authError
    }

    if (!authData.user) {
      throw new Error('User creation failed')
    }

    return { user: authData.user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return { user: data.user, session: data.session, error: null }
  } catch (error) {
    return { user: null, session: null, error }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
    return { error: null }
  } catch (error) {
    return { error }
  }
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      throw error
    }

    return { user: data.user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

export async function getProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      throw error
    }

    return { profile: data as Profile, error: null }
  } catch (error) {
    return { profile: null, error }
  }
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return { profile: data as Profile, error: null }
  } catch (error) {
    return { profile: null, error }
  }
}
