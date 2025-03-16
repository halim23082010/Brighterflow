const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// رابط الموقع المستهدف
const url = 'https://tr.aliexpress.com/item/1005006249095503.html?spm=a2g0o.best.moretolove.1.38507e06YfgqF8&pdp_npi=4%40dis%21SAR%2162.51%21SAR28.75%21%21%21%21%21%40212e520d17415326742216779e443f%2112000037199743973%21btf%21%21%21&_gl=1*4hvpnn*_gcl_aw*R0NMLjE3MzcyOTAzOTUuQ2owS0NRaUE0cks4QmhEN0FSSXNBRmU1TFhMS2o4WUhzdkFZcnNZR1JaNGQ5U0toUmFqVzUxMXZ1T0hndjIzVDFaY2M0bTNUbXAxMVZfWWFBdkJmRUFMd193Y0I.*_gcl_dc*R0NMLjE3MzcyOTAzOTUuQ2owS0NRaUE0cks4QmhEN0FSSXNBRmU1TFhMS2o4WUhzdkFZcnNZR1JaNGQ5U0toUmFqVzUxMXZ1T0hndjIzVDFaY2M0bTNUbXAxMVZfWWFBdkJmRUFMd193Y0I.*_gcl_au*MTU3MjE0OTM1NS4xNzM3MTIyMzY0*_ga*MzE3MDM0ODEzLjE3MzcxMjI2OTk.*_ga_VED1YSGNC7*MTc0MTUzMjY3MC4yNy4xLjE3NDE1MzI2NzguNTIuMC4w&gatewayAdapt=glo2tur'; // استبدل هذا برابط الموقع الحقيقي

// جلب بيانات المنتجات
axios.get(url)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    const products = [];
    $('div.product-item').each((index, element) => {
      const name = $(element).find('h1').text().trim(); // اسم المنتج
      const price = $(element).find('span.price').text().trim(); // السعر
      const image = $(element).find('img').attr('src'); // رابط الصورة
      products.push({ name, price, image });
    });

    // حفظ البيانات في ملف JSON
    fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
    console.log('تم حفظ البيانات في ملف products.json');
  })
  .catch((error) => {
    console.error('حدث خطأ أثناء جلب البيانات:', error);
  });