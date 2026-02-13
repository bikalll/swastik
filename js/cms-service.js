/**
 * CMS Service
 * Handles data fetching from Supabase for the frontend
 */

class CMSService {
    constructor() {
        this.client = window.SupabaseConfig?.getClient();
    }

    /**
     * Get Hero content for a specific page
     */
    async getHero(pageSlug) {
        if (!this.client) return null;
        const { data, error } = await this.client
            .from('hero_sections')
            .select('*')
            .eq('page_slug', pageSlug)
            .single();

        if (error) {
            console.warn(`Error loading hero for ${pageSlug}:`, error);
            return null;
        }
        return data;
    }

    /**
     * Get all active services
     */
    async getServices(featuredOnly = false) {
        if (!this.client) return [];
        let query = this.client
            .from('services')
            .select('*')
            .eq('is_active', true)
            .order('display_order');

        if (featuredOnly) {
            query = query.eq('is_featured', true);
        }

        const { data, error } = await query;
        return error ? [] : data;
    }

    /**
     * Get products with optional category filter
     */
    async getProducts(categoryId = null, limit = null, featuredOnly = false) {
        if (!this.client) return [];
        let query = this.client
            .from('products')
            .select('*, category:product_categories(name)')
            .eq('is_active', true)
            .order('display_order');

        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }
        if (featuredOnly) {
            query = query.eq('is_featured', true);
        }
        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;
        return error ? [] : data;
    }

    /**
     * Get product filters/categories
     */
    async getCategories() {
        if (!this.client) return [];
        const { data, error } = await this.client
            .from('product_categories')
            .select('*')
            .order('display_order');
        return error ? [] : data;
    }

    /**
     * Get testimonials
     */
    async getTestimonials(featuredOnly = false) {
        if (!this.client) return [];
        let query = this.client
            .from('testimonials')
            .select('*')
            .eq('is_active', true)
            .order('display_order');

        if (featuredOnly) {
            query = query.eq('is_featured', true);
        }

        const { data, error } = await query;
        return error ? [] : data;
    }

    /**
     * Get FAQs
     */
    async getFAQs() {
        if (!this.client) return [];
        const { data, error } = await this.client
            .from('faqs')
            .select('*')
            .eq('is_active', true)
            .order('display_order');
        return error ? [] : data;
    }

    /**
     * Get partners
     */
    async getPartners(topOnly = false) {
        if (!this.client) return [];
        let query = this.client
            .from('partners')
            .select('*')
            .eq('is_active', true)
            .order('display_order');

        if (topOnly) {
            query = query.eq('is_top_partner', true);
        }

        const { data, error } = await query;
        return error ? [] : data;
    }

    /**
     * Get collections
     */
    async getCollections(featuredOnly = false) {
        if (!this.client) return [];
        let query = this.client
            .from('collections')
            .select('*')
            .eq('is_active', true)
            .order('display_order');

        if (featuredOnly) {
            query = query.eq('is_featured', true);
        }

        const { data, error } = await query;
        return error ? [] : data;
    }

    /**
     * Get site settings
     */
    async getSiteSettings() {
        if (!this.client) return {};
        const { data, error } = await this.client
            .from('site_settings')
            .select('*');

        if (error) return {};

        // Convert array to object key-value
        return data.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
    }

    /**
     * Submit contact form
     */
    async submitContactForm(formData) {
        if (!this.client) return { error: 'Supabase not configured' };

        const { data, error } = await this.client
            .from('contact_submissions')
            .insert([formData])
            .select();

        return { data, error };
    }
}

window.cmsService = new CMSService();
