
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const supabase = useSupabaseClient();

export const handleRegister = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
        email,
        password,
    });
    
    if (error) {
        alert(error.message);
    }
};