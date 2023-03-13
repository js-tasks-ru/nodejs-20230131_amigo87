const Category = require('../models/Category')
const Product = require('../models/Product')

module.exports.createTestData = async function createTestCategories() {

    const categories = (await Category.find())
    if (categories.length == 0){

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
        cat1.save().then(() => console.log('cat1 +'));
        cat2.save().then(() => console.log('cat2 +'));
    }

    const products = (await Product.find())
    if (products.length == 0){

        let cat1 = await Category.findOne({ title: 'Одежда' })
        let subcat1 = cat1.subcategories.find(title => 'Джинсы')

        let prod1 = new Product({
            title: "Классика",
            description: "Фирма Левис",
            price: 10000,
            category: cat1.id,
            subcategory: subcat1.id,
            images: ["https://blog.luxxy.com/wp-content/uploads/2022/03/4408061501.jpg"],
        })
        let prod2 = new Product({
            title: "Джоггеры",
            description: "Тренд на все года!",
            price: 3900,
            category: cat1.id,
            subcategory: subcat1.id,
            images: ["https://gothicstyle.ru/images/garment_management_department_taoyifang_xinheng_to/202202221624045341800.jpg"],
        })
        prod1.save().then(() => console.log('prod1 +'));
        prod2.save().then(() => console.log('prod2 +'));
    }
};