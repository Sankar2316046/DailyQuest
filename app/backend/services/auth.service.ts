import supabase from "@/lib/supabase";



interface SignUpData {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  user: any;
}


export class AuthService {
  async getusername() {
    const email = await this.getCurrentUserEmail();
    if (!email) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('name')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user name:', error);
      return null;
    }

    return data?.name || null;
  } 
    getCurrentUserEmail() {
        return supabase.auth.getUser().then(({ data, error }) => {
          if (error) {
            console.error("Error fetching user:", error);
            return null;
          }
          return data.user?.email || null;
        }).catch(error => {
          console.error("Unexpected error in getCurrentUserEmail:", error);
          return null;
        });
      }
         getCurrentUserId() {
        return supabase.auth.getUser().then(({ data, error }) => {
          if (error) {
            console.error("Error fetching user:", error);
            return null;
          }
          return data.user?.id || null;
        }).catch(error => {
          console.error("Unexpected error in getCurrentUserEmail:", error);
          return null;
        });
      }
    
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
    
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      const user = authData.user

      // Step 2: Insert into users table
      if (user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ id: user.id, name: data.name, email: data.email }])
      }
      return {
        user: authData.user,
      };
    } catch (error) {
      throw error;
    }
  }
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        user: data.user
      };
    } catch (error) { 
      throw error;
    }
  }
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
}