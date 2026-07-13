// نظام إدارة قاعدة البيانات SQL الذاتية والمدمجة للمتجر
const SQLStorage = {
    // المنتجات والأسعار الافتراضية المطلوبة بدقة
    defaultData: {
        headphones: [
            {name: "سماعة Airpods M10", price: 150}, {name: "سماعة Airpods Pro 2", price: 250},
            {name: "سماعة Airpods Pro", price: 200}, {name: "سماعة سلك عادية 50", price: 50},
            {name: "سماعة سلك عادية 70", price: 70}, {name: "سماعة سلك عادية 80", price: 80},
            {name: "سماعة سلك عادية 100", price: 100}, {name: "سماعة سلك ايفون", price: 150},
            {name: "هيدفون P9", price: 250}, {name: "هيدفون قطة", price: 250}
        ],
        cables: [
            {name: "وصلة مايكرو 30", price: 30}, {name: "وصلة مايكرو 70", price: 70}, {name: "وصلة مايكرو 80", price: 80}, {name: "وصلة مايكرو 100", price: 100},
            {name: "وصلة تايب سي 50", price: 50}, {name: "وصلة تايب سي 70", price: 70}, {name: "وصلة تايب سي 80", price: 80}, {name: "وصلة تايب سي 100", price: 100},
            {name: "وصلة تايب سي إلى تايب سي", price: 150}, {name: "وصلة ايفون تايب سي انكر", price: 150}, {name: "وصلة ايفون عادية", price: 150}
        ],
        cases: [
            {name: "جراب ايفون 150", price: 150}, {name: "جراب ايفون 200", price: 200}, {name: "جراب ايفون 250", price: 250}, {name: "جراب ايفون 300", price: 300}
        ]
    },

    // جلب البيانات بالكامل
    getProducts: function() {
        let current = localStorage.getItem('elkady_sql_products');
        if(!current) {
            localStorage.setItem('elkady_sql_products', JSON.stringify(this.defaultData));
            return this.defaultData;
        }
        return JSON.parse(current);
    },

    // تحديث وحفظ البيانات من صفحة الأدمن
    saveProducts: function(data) {
        localStorage.setItem('elkady_sql_products', JSON.stringify(data));
    }
};