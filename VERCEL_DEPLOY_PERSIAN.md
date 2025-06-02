# راهنمای دیپلوی در Vercel

## ✅ مشکل حل شد!

### تغییراتی که انجام دادیم:

1. **اسکریپت `scripts/build.mjs` را آپدیت کردیم** - حالا فایل‌های کامپایل شده را از `server/` به `api/` کپی می‌کند

2. **اسکریپت `scripts/fix-vercel-build.sh` را بهبود دادیم** - اگر `api/index.js` وجود نداشته باشد، آن را ایجاد می‌کند

3. **اسکریپت جدید `scripts/prepare-vercel.sh` ایجاد کردیم** - تمام مراحل build را انجام می‌دهد و صحت آن را بررسی می‌کند

4. **دستور `vercel-build` را ساده کردیم** - حالا فقط یک اسکریپت را اجرا می‌کند

## 🚀 مراحل دیپلوی:

### 1. تنظیم Environment Variables در Vercel:

برای به Vercel Dashboard و در قسمت Settings → Environment Variables این متغیرها را اضافه کنید:

```
DATABASE_URL=postgresql://...
SESSION_SECRET=یک-رشته-تصادفی-امن
```

### 2. دیپلوی کردن:

تغییرات به صورت خودکار به Vercel دیپلوی می‌شوند چون شما قبلاً پروژه را به Vercel متصل کرده‌اید.

### 3. بررسی وضعیت:

- به [Vercel Dashboard](https://vercel.com/dashboard) بروید
- پروژه خود را انتخاب کنید
- در قسمت Deployments وضعیت دیپلوی را بررسی کنید

## 🔧 در صورت بروز مشکل:

### تست محلی:
```bash
# برای تست build process به صورت محلی:
bash scripts/prepare-vercel.sh
```

### بررسی لاگ‌ها:
در Vercel Dashboard → Deployments → View Function Logs

### مشکلات رایج:

1. **خطای Database**: مطمئن شوید `DATABASE_URL` صحیح است
2. **خطای Build**: لاگ‌های build را بررسی کنید
3. **خطای Runtime**: لاگ‌های Function را بررسی کنید

## ✨ نکات مهم:

- فولدر `api/` دیگر در `.gitignore` نیست (موقتاً)
- بعد از اینکه دیپلوی موفق شد، می‌توانید دوباره `api/` را به `.gitignore` اضافه کنید
- فایل‌های TypeScript در `server/` هستند و فایل‌های JavaScript کامپایل شده در `api/`

موفق باشید! 🎉 