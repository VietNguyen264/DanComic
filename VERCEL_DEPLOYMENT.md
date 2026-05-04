# Vercel Deployment Guide

## 📋 Cách Deploy DanComic lên Vercel

### 1. Chuẩn Bị
```bash
# Đảm bảo code đã commit lên GitHub
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Vercel Environment Variables
Trên Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_ADMIN_EMAIL = admin@example.com
ADMIN_PASSWORD = admin123
NEXT_PUBLIC_MOCKAPI_URL = https://69d6fefd9c5ebb0918c6e261.mockapi.io
```

### 3. Deploy
- Connect GitHub repo to Vercel
- Auto-deploy on push to `main` branch
- Build settings:
  - Framework: Next.js
  - Build Command: `npm run build`
  - Output Directory: `.next`

### 4. Fix 403 Error (Nếu Gặp)
Lỗi 403 Forbidden thường là từ Vercel Analytics. Có 2 cách fix:

**Option A: Disable Analytics**
- Vercel Dashboard → Settings → Analytics
- Click "Disable"

**Option B: Add vercel.json config**
```json
{
  "analytics": false,
  "crons": []
}
```

### 5. Environment-Specific URLs
Nếu muốn khác nhau giữa development & production:

```bash
# .env.local (local)
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Vercel Env Vars (production)
NEXT_PUBLIC_ADMIN_EMAIL=admin@dancomic.com
ADMIN_PASSWORD=your-secure-password
```

### 6. Check Deployment Status
- Vercel Dashboard → Deployments
- Check build logs: **Logs** tab
- Test live preview: **Visit** button

---

## 🐛 Troubleshooting

**Q: 403 Forbidden Error?**
- A: Disable Vercel Analytics hoặc thêm `vercel.json`

**Q: Build fails?**
- A: Check build logs, lihat `npm run build` local
- Đảm bảo `next.config.ts` không có syntax errors

**Q: Environment variables không work?**
- A: Restart deployment sau khi add variables
- Reload browser cache (Cmd/Ctrl + Shift + Delete)

**Q: Web chạy nhưng chậm?**
- A: Check Image optimization settings
- Disable Analytics
- Check MockAPI response time

---

## 📊 Performance Tips

1. **Enable Caching:**
   - Vercel auto caches static files
   - Images cached 1 year

2. **Optimize Bundle:**
   - `npm run build` → check bundle size
   - Lazy load heavy components

3. **Monitor:**
   - Vercel Analytics → Web Vitals
   - Check Core Web Vitals scores

---

**Deployment Status:** ✅ Ready to Deploy!
