# Supabase Setup Guide for Swastik Interiors CMS

Follow these steps to create your Supabase project and configure it for the CMS.

## Step 1: Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up (or log in)
3. Click "New Project"
4. Fill in:
   - **Organization**: Create or select one
   - **Project name**: `swastik-interiors-cms`
   - **Database password**: Create a strong password (save this!)
   - **Region**: Choose closest to Nepal (Singapore or Mumbai)
5. Click "Create new project"
6. Wait 2-3 minutes for project setup

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** (gear icon) > **API**
2. Copy these two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)

3. Open the file `js/supabase-config.js` in your project
4. Replace the placeholder values with your credentials

## Step 3: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `database/schema.sql` 
4. Paste it into the SQL Editor
5. Click "Run" to execute

## Step 4: Set Up Storage Buckets

1. Go to **Storage** in sidebar
2. Create these buckets (click "New Bucket" for each):
   - `heroes` - For hero background images
   - `products` - For product images
   - `testimonials` - For customer avatars
   - `partners` - For partner logos
   - `company` - For company page images
   - `collections` - For collection images

3. For each bucket, set the policy:
   - Click the bucket > "Policies" tab
   - Enable "Allow public access for reading"

## Step 5: Seed Initial Data

1. Go to **SQL Editor**
2. Click "New Query"
3. Copy contents of `database/seed.sql`
4. Paste and click "Run"

## Step 6: Create Admin User

1. Go to **Authentication** > **Users**
2. Click "Add User" > "Create new user"
3. Enter:
   - Email: Your admin email
   - Password: Strong password
4. This will be your admin login

---

## Troubleshooting

**Can't connect?**
- Check that your Project URL and anon key are correct
- Make sure there are no spaces before/after the values

**Tables not created?**
- Check the SQL Editor for any errors
- Make sure you ran the complete schema.sql

**Images not uploading?**
- Verify storage buckets exist
- Check bucket policies allow uploads

---

## Need Help?

If you encounter any issues, share the error message and I'll help resolve it!
