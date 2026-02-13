/**
 * Admin Application - Main CMS functionality for Swastik Interiors
 */

class AdminApp {
    constructor() {
        this.client = window.SupabaseConfig?.getClient();
        this.init();
    }

    async init() {
        if (!window.SupabaseConfig || !window.SupabaseConfig.getClient()) {
            this.showErrorBanner('Supabase Client Error. Please check js/supabase-config.js');
            return;
        }

        // Check authentication
        const isAuthenticated = await window.adminAuth.requireAuth();
        if (!isAuthenticated) return;

        // Update user email display
        const user = window.adminAuth.getUser();
        const userEmailEl = document.getElementById('user-email');
        if (userEmailEl && user) {
            userEmailEl.textContent = user.email;
        }

        // Load dashboard stats
        await this.loadDashboardStats();

        // Initialize sidebar toggle
        this.initSidebarToggle();
    }

    showErrorBanner(message) {
        const banner = document.createElement('div');
        banner.style.cssText = 'background: #fee2e2; color: #dc2626; padding: 1rem; margin-bottom: 1rem; border-radius: 0.5rem; border: 1px solid #fca5a5;';
        banner.textContent = message;

        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.prepend(banner);
        }
    }

    /**
     * Load dashboard statistics
     */
    async loadDashboardStats() {
        if (!this.client) return;

        try {
            // Products count
            const { count: productsCount } = await this.client
                .from('products')
                .select('*', { count: 'exact', head: true });
            this.updateStat('products-count', productsCount || 0);

            // Testimonials count
            const { count: testimonialsCount } = await this.client
                .from('testimonials')
                .select('*', { count: 'exact', head: true });
            this.updateStat('testimonials-count', testimonialsCount || 0);

            // Services count
            const { count: servicesCount } = await this.client
                .from('services')
                .select('*', { count: 'exact', head: true });
            this.updateStat('services-count', servicesCount || 0);

            // Partners count
            const { count: partnersCount } = await this.client
                .from('partners')
                .select('*', { count: 'exact', head: true });
            this.updateStat('partners-count', partnersCount || 0);

        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    updateStat(elementId, value) {
        const el = document.getElementById(elementId);
        if (el) el.textContent = value;
    }

    /**
     * Initialize sidebar toggle for mobile
     */
    initSidebarToggle() {
        const toggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');

        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024 &&
                    !sidebar.contains(e.target) &&
                    !toggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            });
        }
    }

    // =====================================================
    // CRUD Operations
    // =====================================================

    /**
     * Create a new record
     */
    async create(table, data) {
        if (!this.client) throw new Error('Supabase not configured');

        const { data: result, error } = await this.client
            .from(table)
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        return result;
    }

    /**
     * Read records
     */
    async read(table, options = {}) {
        if (!this.client) throw new Error('Supabase not configured');

        let query = this.client.from(table).select(options.select || '*');

        if (options.filter) {
            Object.entries(options.filter).forEach(([key, value]) => {
                query = query.eq(key, value);
            });
        }

        if (options.order) {
            query = query.order(options.order.column, { ascending: options.order.ascending });
        }

        if (options.limit) {
            query = query.limit(options.limit);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    /**
     * Read single record
     */
    async readOne(table, id) {
        if (!this.client) throw new Error('Supabase not configured');

        const { data, error } = await this.client
            .from(table)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Update a record
     */
    async update(table, id, data) {
        if (!this.client) throw new Error('Supabase not configured');

        const { data: result, error } = await this.client
            .from(table)
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return result;
    }

    /**
     * Delete a record
     */
    async delete(table, id) {
        if (!this.client) throw new Error('Supabase not configured');

        const { error } = await this.client
            .from(table)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }

    // =====================================================
    // Image Upload
    // =====================================================

    /**
     * Upload image to Supabase Storage
     */
    async uploadImage(bucket, file, path = null) {
        if (!this.client) throw new Error('Supabase not configured');

        const fileExt = file.name.split('.').pop();
        const fileName = path || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { data, error } = await this.client.storage
            .from(bucket)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = this.client.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return publicUrl;
    }

    /**
     * Delete image from Supabase Storage
     */
    async deleteImage(bucket, path) {
        if (!this.client) throw new Error('Supabase not configured');

        // Extract path from URL if full URL provided
        if (path.startsWith('http')) {
            const url = new URL(path);
            path = url.pathname.split('/').pop();
        }

        const { error } = await this.client.storage
            .from(bucket)
            .remove([path]);

        if (error) throw error;
        return true;
    }

    // =====================================================
    // UI Helpers
    // =====================================================

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        const container = document.querySelector('.toast-container') || this.createToastContainer();

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="Close">×</button>
        `;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);

        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    /**
     * Confirm dialog
     */
    async confirm(message, title = 'Confirm') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay active';
            overlay.innerHTML = `
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" aria-label="Close">×</button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" data-action="cancel">Cancel</button>
                        <button class="btn btn-danger" data-action="confirm">Delete</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            const cleanup = () => {
                overlay.remove();
            };

            overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => {
                cleanup();
                resolve(false);
            });

            overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => {
                cleanup();
                resolve(true);
            });

            overlay.querySelector('.modal-close').addEventListener('click', () => {
                cleanup();
                resolve(false);
            });

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    cleanup();
                    resolve(false);
                }
            });
        });
    }

    /**
     * Format date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Format price
     */
    formatPrice(price) {
        return new Intl.NumberFormat('en-IN').format(price);
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize admin app
document.addEventListener('DOMContentLoaded', () => {
    window.adminApp = new AdminApp();
});
