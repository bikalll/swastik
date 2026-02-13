/**
 * Supabase Configuration
 * Centralized config for Supabase client
 */

const SupabaseConfig = {
    url: 'https://qscmpicltffnezehwfru.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzY21waWNsdGZmbmV6ZWh3ZnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNDMwMDYsImV4cCI6MjA4NDkxOTAwNn0.DccX9GKEWp015X_F_eem8zl1VjuNbJg3hRJEanc_QGI', // User provided key

    /**
     * Get initialized Supabase client
     */
    getClient: function () {
        if (!window.supabase) {
            console.error('Supabase SDK not loaded');
            return null;
        }

        if (!this.client) {
            this.client = window.supabase.createClient(this.url, this.key);
        }
        return this.client;
    }
};

// Expose to window
window.SupabaseConfig = SupabaseConfig;
