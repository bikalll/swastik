/**
 * Admin Authentication - Supabase Auth for Swastik CMS
 */

class AdminAuth {
    constructor() {
        this.client = window.SupabaseConfig?.getClient();
        this.currentUser = null;
    }

    /**
     * Check if user is authenticated
     */
    async checkAuth() {
        if (!this.client) {
            console.error('Supabase not configured');
            return null;
        }

        const { data: { session } } = await this.client.auth.getSession();
        if (session) {
            this.currentUser = session.user;
            return session.user;
        }
        return null;
    }

    /**
     * Sign in with email and password
     */
    async signIn(email, password) {
        if (!this.client) {
            throw new Error('Supabase not configured. Please update js/supabase-config.js');
        }

        const { data, error } = await this.client.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        this.currentUser = data.user;
        return data.user;
    }

    /**
     * Sign out
     */
    async signOut() {
        if (!this.client) return;

        const { error } = await this.client.auth.signOut();
        if (error) throw error;

        this.currentUser = null;
        window.location.href = 'login.html';
    }

    /**
     * Get current user
     */
    getUser() {
        return this.currentUser;
    }

    /**
     * Require authentication - redirect to login if not authenticated
     */
    async requireAuth() {
        const user = await this.checkAuth();
        if (!user) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    /**
     * Redirect authenticated users away from login page
     */
    async redirectIfAuthenticated() {
        const user = await this.checkAuth();
        if (user) {
            window.location.href = 'index.html';
            return true;
        }
        return false;
    }
}

// Initialize auth
window.adminAuth = new AdminAuth();

// Handle login form
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        // Check if already logged in
        window.adminAuth.redirectIfAuthenticated();

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorEl = document.getElementById('error-message');
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');

            // Show loading state
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';
            submitBtn.disabled = true;
            errorEl.style.display = 'none';

            try {
                await window.adminAuth.signIn(email, password);
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Login error:', error);
                errorEl.textContent = error.message || 'Invalid credentials. Please try again.';
                errorEl.style.display = 'block';

                // Reset button state
                btnText.style.display = 'block';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }

    // Handle logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.adminAuth.signOut();
        });
    }
});
