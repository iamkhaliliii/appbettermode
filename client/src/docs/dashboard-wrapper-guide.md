# راهنمای استفاده از DashboardPageWrapper

این کامپوننت به منظور مدیریت یکپارچه بارگذاری صفحات داشبورد و بهبود عملکرد سایت ایجاد شده است.

## مزایا

1. **کش کردن داده‌های سایت**: با استفاده از `SiteDataContext` داده‌ها یک بار بارگذاری شده و در صفحات مختلف به اشتراک گذاشته می‌شوند
2. **مدیریت خطاها و حالت‌های بارگذاری**: نمایش متحد رابط کاربری برای همه صفحات
3. **کاهش کدهای تکراری**: بدون نیاز به تکرار منطق بارگذاری در هر صفحه
4. **بهبود عملکرد**: انتقال سریع‌تر بین صفحات داشبورد

## نحوه استفاده

برای استفاده از این wrapper در صفحات داشبورد، کافیست به جای استفاده مستقیم از `DashboardLayout`، از `DashboardPageWrapper` استفاده کنید:

```tsx
import { DashboardPageWrapper } from "@/components/dashboard/DashboardPageWrapper";

export default function YourDashboardPage() {
  const [, params] = useRoute('/dashboard/site/:siteSD/your-page');
  const siteSD = params?.siteSD || '';
  
  return (
    <DashboardPageWrapper 
      siteSD={siteSD}
      onNewContent={() => setAddContentDialogOpen(true)} // اختیاری
      secondarySidebar={<YourSecondarySidebar />} // اختیاری
    >
      {/* محتوای اصلی صفحه */}
      <div>
        محتوای صفحه شما
      </div>
    </DashboardPageWrapper>
  );
}
```

## پارامترهای ورودی

| پارامتر | نوع | توضیحات |
|---------|-----|---------|
| `siteSD` | string | شناسه سایت |
| `requireSite` | boolean | آیا بارگذاری اطلاعات سایت اجباری است؟ (پیش‌فرض: true) |
| `secondarySidebar` | ReactNode | کامپوننت سایدبار ثانویه (اختیاری) |
| `onNewContent` | () => void | تابع اجرا شونده هنگام کلیک روی دکمه افزودن محتوا (اختیاری) |

## مثال قبل و بعد

### قبل:

```tsx
export default function OldPage() {
  const [, params] = useRoute('/dashboard/site/:siteSD/page');
  const siteSD = params?.siteSD || '';
  
  const { loadSite, sites, isLoading: contextIsLoading } = useSiteData();
  const [siteDetails, setSiteDetails] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // بارگذاری اطلاعات سایت
  useEffect(() => {
    const fetchSiteData = async () => {
      // کد طولانی بارگذاری داده
      // ...
    };

    fetchSiteData();
  }, [siteSD, sites, loadSite]);

  // کدهای تکراری برای نمایش حالت‌های مختلف (بارگذاری، خطا، ...)
  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  if (!siteDetails) {
    return <NotFoundView />;
  }

  return (
    <DashboardLayout currentSiteIdentifier={siteDetails.id} siteName={siteDetails.name}>
      {/* محتوای اصلی */}
    </DashboardLayout>
  );
}
```

### بعد:

```tsx
export default function NewPage() {
  const [, params] = useRoute('/dashboard/site/:siteSD/page');
  const siteSD = params?.siteSD || '';
  
  return (
    <DashboardPageWrapper siteSD={siteSD}>
      {/* محتوای اصلی */}
    </DashboardPageWrapper>
  );
}
```

## نکات مهم

1. برای دریافت جزئیات سایت در داخل کامپوننت، می‌توانید از `useSiteData` استفاده کنید:
```tsx
const { sites } = useSiteData();
const siteDetails = sites[siteSD];
```

2. کامپوننت‌های `SettingsSidebar` و دیگر کامپوننت‌هایی که به اطلاعات سایت نیاز دارند،
باید به‌روزرسانی شوند تا داده‌ها را از `useSiteData` دریافت کنند. 