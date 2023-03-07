const Category = require('../models/Category')
const Product = require('../models/Product')

module.exports.fixtures = async function createTestCategories() {

        let cat1 = new Category({ 
            title: 'Одежда',
            subcategories: [
                { title: 'Джинсы' },
                { title: 'Футболки' },
                { title: 'Джемперы' },
                { title: 'Куртки' },
            ]
        });
        let cat2 = new Category({ 
            title: 'Ювелирка',
            subcategories: [
                { title: 'Цепочки' },
                { title: 'Кольца' },
                { title: 'Серьги' },
                { title: 'Кулоны' },
            ]
        });
        await cat1.save().then(() => console.log('cat1 +'));
        await cat2.save().then(() => console.log('cat2 +'));

        let subcat1 = cat1.subcategories[0]

        let prod1 = new Product({
            title: "Пошив: Классика",
            description: "Фирма Левис. Можно целую диссертацию про джинсы написать. Про их влияние в жизни планеты.",
            price: 10000,
            category: cat1.id,
            subcategory: subcat1.id,
            images: ["https://blog.luxxy.com/wp-content/uploads/2022/03/4408061501.jpg"],
        })
        let prod2 = new Product({
            title: "Джоггеры",
            description: "Тренд на все года! Пошив и тут есть. Левис или другая марка. Тест ради текста",
            price: 3900,
            category: cat1.id,
            subcategory: subcat1.id,
            images: ["https://gothicstyle.ru/images/garment_management_department_taoyifang_xinheng_to/202202221624045341800.jpg"],
        })
        await prod1.save().then(() => console.log('prod1 +'));
        prod2.save().then(() => console.log('prod2 +'));

};