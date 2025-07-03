# Deployment Guide for Haki Kenya Legal Aid Platform

## Prerequisites

1. **Supabase Project Setup**
   - Create a new project at [supabase.com](https://supabase.com)
   - Note your project URL and anon key
   - Run the migration files in the Supabase SQL editor

2. **Storage Buckets Setup**
   ```sql
   -- Run in Supabase SQL editor
   INSERT INTO storage.buckets (id, name, public) VALUES 
   ('documents', 'documents', true),
   ('user-documents', 'user-documents', false);
   ```

3. **Storage Policies**
   ```sql
   -- Public read access to document templates
   CREATE POLICY "Public read access" ON storage.objects 
   FOR SELECT USING (bucket_id = 'documents');

   -- Users can manage their own documents
   CREATE POLICY "Users can manage own documents" ON storage.objects 
   FOR ALL USING (bucket_id = 'user-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

## Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment Options

### Option 1: Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

### Option 2: Netlify Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

3. **Login to Netlify**
   ```bash
   netlify login
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

5. **Set Environment Variables**
   - Go to your Netlify dashboard
   - Navigate to Site settings > Environment variables
   - Add the required variables

### Option 3: GitHub Integration (Recommended)

#### For Vercel:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/haki-kenya.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables
   - Deploy

#### For Netlify:

1. **Push to GitHub** (same as above)

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables
   - Deploy

## Build Configuration

### Vercel Configuration (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Netlify Configuration (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

## Post-Deployment Setup

1. **Test Authentication**
   - Try signing up and logging in
   - Verify email confirmation works

2. **Test File Uploads**
   - Upload a document
   - Verify storage permissions

3. **Test Real-time Features**
   - Submit a question
   - Check notifications

4. **Configure Custom Domain** (Optional)
   - Add your domain in Vercel/Netlify dashboard
   - Update DNS records
   - Enable HTTPS

## Monitoring and Analytics

### Error Tracking
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage analytics

### Performance Monitoring
- Vercel Analytics (built-in)
- Netlify Analytics (built-in)
- Web Vitals monitoring

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use different keys for production

2. **Supabase Security**
   - Review RLS policies
   - Enable email confirmation
   - Set up proper CORS origins

3. **Content Security Policy**
   Add to your `index.html`:
   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;">
   ```

## Maintenance

1. **Regular Updates**
   ```bash
   npm update
   npm audit fix
   ```

2. **Database Backups**
   - Supabase provides automatic backups
   - Consider additional backup strategies for critical data

3. **Performance Optimization**
   - Monitor bundle size
   - Optimize images
   - Use lazy loading

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version (use 18+)
   - Clear node_modules and reinstall
   - Check for TypeScript errors

2. **Environment Variables Not Working**
   - Ensure variables start with `VITE_`
   - Restart development server
   - Check deployment platform settings

3. **Supabase Connection Issues**
   - Verify URL and keys
   - Check network connectivity
   - Review CORS settings

### Support Resources:
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

## Success Checklist

- [ ] Supabase project configured
- [ ] Storage buckets created
- [ ] RLS policies applied
- [ ] Environment variables set
- [ ] Application deployed
- [ ] Custom domain configured (optional)
- [ ] Authentication tested
- [ ] File uploads working
- [ ] Real-time features functional
- [ ] Error tracking configured
- [ ] Performance monitoring enabled

Your Haki Kenya Legal Aid Platform is now ready for production use!