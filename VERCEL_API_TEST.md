# راهنمای تست API در Vercel

## 🔍 مشکلی که داشتیم:
کلاینت به `localhost:4000` درخواست می‌فرستاد به جای URL صحیح Vercel که باعث خطاهای زیر می‌شد:
- `net::ERR_CONNECTION_REFUSED`
- `Invalid CMS types response format`
- `Invalid response format`

## ✅ راه حل‌هایی که اعمال کردیم:

### 1. تابع `getApiUrl()` را آپدیت کردیم:
```typescript
// در production از relative URLs استفاده می‌کند
if (window.location.hostname !== 'localhost') {
  return ''; // Empty string = relative URL
}
```

### 2. متغیر محیطی اضافه کردیم در `vercel.json`:
```json
{
  "env": {
    "VITE_API_BASE_URL": ""
  },
  "build": {
    "env": {
      "VITE_API_BASE_URL": ""
    }
  }
}
```

### 3. تمام فایل‌های زیر را آپدیت کردیم:
- `client/src/lib/utils.ts`
- `client/src/lib/api.ts`
- `client/src/components/layout/dashboard/secondary-sidebar/ContentSidebar.tsx`
- `client/src/components/dashboard/site-config/content/utils.ts`
- `client/src/lib/brand-fetcher.ts`
- `client/src/lib/with-site-context.tsx`
- `client/src/components/dashboard/CreateSiteDialog.tsx`

## 🧪 نحوه تست:

### 1. بررسی Console در مرورگر:
باید ببینید:
```
[Utils] Using relative URLs for production
[API] GET /api/v1/sites/google
```

**نباید** ببینید:
```
GET http://localhost:4000/api/v1/sites/google
```

### 2. بررسی Network Tab:
- درخواست‌ها باید به دامنه Vercel بروند: `https://appbettermode.vercel.app/api/v1/...`
- نه به localhost

### 3. تست عملکرد:
- باید بتوانید CMS types را ببینید
- باید بتوانید posts را load کنید
- باید بتوانید spaces را ببینید

## 🐛 اگر هنوز مشکل دارید:

1. **Hard Refresh کنید**: Ctrl+Shift+R (Windows) یا Cmd+Shift+R (Mac)
2. **Cache مرورگر را پاک کنید**
3. **صبر کنید تا Vercel کاملاً دیپلوی شود** (معمولاً 2-3 دقیقه)
4. **لاگ‌های Vercel را بررسی کنید**: Vercel Dashboard → Functions → Logs

## 📝 نکات مهم:
- در development همچنان از `localhost:4000` استفاده می‌شود
- در production از relative URLs استفاده می‌شود (empty string)
- این تغییرات فقط روی client-side تأثیر دارند 