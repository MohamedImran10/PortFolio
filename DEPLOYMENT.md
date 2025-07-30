# GitHub Pages HTTPS Deployment Guide

This document provides instructions for deploying your portfolio to GitHub Pages with HTTPS enabled on your custom domain `mohamedimran.me`.

## Current Configuration Status ✅

Your project is already properly configured for custom domain deployment:

- ✅ **CNAME file**: Contains `mohamedimran.me`
- ✅ **Next.js config**: Optimized for custom domain (no basePath)
- ✅ **Static export**: Configured with `output: 'export'`
- ✅ **GitHub Actions**: Workflow ready for deployment

## DNS Configuration Required

To enable HTTPS on your custom domain, configure these DNS records with your domain provider:

### For Apex Domain (mohamedimran.me)

**A Records:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**AAAA Records (IPv6):**
```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

### Alternative: ALIAS/ANAME Records
Instead of A records, you can use:
```
ALIAS or ANAME: mohamedimran10.github.io
```

### For Subdomain (if using www.mohamedimran.me)
```
CNAME: mohamedimran10.github.io
```

## HTTPS Certificate Troubleshooting

If HTTPS isn't working after DNS configuration:

1. **Wait for DNS Propagation** (up to 24 hours)
2. **Restart Certificate Provisioning:**
   - Go to Repository Settings > Pages
   - Click "Remove" next to custom domain
   - Re-enter `mohamedimran.me` and click "Save"
3. **Verify Domain Length** (must be < 64 characters) ✅
4. **Check DNS with tools like:**
   - `dig mohamedimran.me`
   - `nslookup mohamedimran.me`

## Deployment Steps

1. **Push to main branch** - GitHub Actions will automatically deploy
2. **Configure DNS** - Set up the records above with your domain provider
3. **Enable HTTPS** - GitHub will automatically provision SSL certificate
4. **Verify** - Check `https://mohamedimran.me` after propagation

## Security Features Already Implemented ✅

- ✅ All external links use HTTPS
- ✅ No mixed content issues
- ✅ Secure asset loading
- ✅ CSP-ready configuration

## Custom Domain Benefits

- 🔒 **Automatic HTTPS** via Let's Encrypt
- 🚀 **CDN Performance** via GitHub's global network
- 📱 **Mobile Optimization** 
- 🔍 **SEO Benefits** with custom domain
- 📊 **Analytics Ready**

## Resources

- [GitHub Pages Custom Domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [DNS Configuration Help](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
