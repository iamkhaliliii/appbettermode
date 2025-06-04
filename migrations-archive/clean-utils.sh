#!/bin/bash

# اسکریپت برای پاکسازی کامل api/utils و کامپایل مجدد

echo "پاکسازی api/utils..."
rm -rf api/utils
mkdir -p api/utils

echo "اجرای build..."
npm run build

echo "عملیات با موفقیت انجام شد." 