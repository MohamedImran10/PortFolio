# HTTPS Security Checklist for mohamedimran.me

## Pre-Deployment Checklist ✅

- [x] **CNAME file configured** with `mohamedimran.me`
- [x] **Next.js config optimized** for custom domain
- [x] **No basePath** (removed for custom domain)
- [x] **Static export enabled** (`output: 'export'`)
- [x] **Security headers added** to Next.js config
- [x] **All external links use HTTPS**
- [x] **No mixed content issues**
- [x] **GitHub Actions workflow ready**

## DNS Configuration Checklist

### Required DNS Records (Configure with your domain provider)

- [ ] **A Records** pointing to GitHub Pages IPs:
  - [ ] 185.199.108.153
  - [ ] 185.199.109.153
  - [ ] 185.199.110.153
  - [ ] 185.199.111.153

- [ ] **AAAA Records** (IPv6) pointing to:
  - [ ] 2606:50c0:8000::153
  - [ ] 2606:50c0:8001::153
  - [ ] 2606:50c0:8002::153
  - [ ] 2606:50c0:8003::153

### Alternative DNS Setup
- [ ] **ALIAS/ANAME Record** pointing to `mohamedimran10.github.io`

## GitHub Pages Configuration

- [ ] **Repository Settings > Pages**
  - [ ] Source: Deploy from a branch
  - [ ] Branch: main / (root)
  - [ ] Custom domain: `mohamedimran.me`
  - [ ] Enforce HTTPS: ✅ (will be enabled after DNS propagation)

## Post-Deployment Verification

- [ ] **DNS Propagation Check** (24-48 hours max)
  ```bash
  # Check DNS resolution
  dig mohamedimran.me
  nslookup mohamedimran.me
  ```

- [ ] **HTTPS Certificate Status**
  - [ ] Visit: https://mohamedimran.me
  - [ ] Check for 🔒 lock icon in browser
  - [ ] Verify certificate validity

- [ ] **Security Headers Verification**
  - [ ] Test at: https://securityheaders.com
  - [ ] Check X-Frame-Options
  - [ ] Verify X-Content-Type-Options
  - [ ] Confirm Referrer-Policy

## Troubleshooting Steps

### If HTTPS doesn't work:

1. **Check DNS propagation**: Use tools like `whatsmydns.net`
2. **Restart certificate provisioning**:
   - GitHub Settings > Pages
   - Remove custom domain
   - Re-add `mohamedimran.me`
   - Wait 10-15 minutes

3. **Verify domain length**: Must be < 64 characters ✅
4. **Check for typos** in DNS configuration
5. **Contact domain provider** if issues persist

### If mixed content warnings appear:

1. **Check browser console** for HTTP resource loads
2. **Update any HTTP links** to HTTPS
3. **Verify all CDN links** use HTTPS
4. **Check CSS background images** for HTTP URLs

## Security Features Implemented

- 🔒 **HTTPS Enforcement** via GitHub Pages
- 🛡️ **Security Headers** in Next.js config
- 🚫 **X-Frame-Options: DENY** (prevents clickjacking)
- 🔍 **X-Content-Type-Options: nosniff** (prevents MIME sniffing)
- 📋 **Referrer-Policy** configured
- 🎯 **Permissions-Policy** for privacy

## Performance Optimizations

- ⚡ **Static Site Generation** for fast loading
- 🌐 **GitHub CDN** for global performance
- 📱 **Mobile-optimized** responsive design
- 🖼️ **Image optimization** enabled
- 📦 **Asset bundling** with Next.js

## Monitoring and Maintenance

- 📊 **Monitor certificate expiry** (auto-renewed by GitHub)
- 🔄 **Regular security header checks**
- 📈 **Performance monitoring** with web vitals
- 🐛 **Error tracking** in browser console

---

## Quick Commands for Verification

```bash
# Check if site is live
curl -I https://mohamedimran.me

# Check security headers
curl -I https://mohamedimran.me | grep -E "(X-Frame|X-Content|Referrer)"

# Test DNS resolution
dig mohamedimran.me A
dig mohamedimran.me AAAA
```

## Resources

- [GitHub Pages HTTPS Guide](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [SSL Labs Server Test](https://www.ssllabs.com/ssltest/)
- [Security Headers Checker](https://securityheaders.com/)
- [DNS Propagation Checker](https://www.whatsmydns.net/)
