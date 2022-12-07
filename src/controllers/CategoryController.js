const Category = require("../models/Category");


class CategoryController{
    getCategoryById(){

    }

    getAllCategory(){

    }

    async addCategoryById(req, res){
        try {
			const category = new Category(req.body)
			await category.save()
			res.status(201).json({ message: 'Create category successful' })
		} catch (err) {
			console.log('Add Category Error', err)
			res.status(401).json({ Error: 'Error' })
		}

    }

    deleteCategoryById(){

    }

    updateCategoryById(){

    }
}

module.exports = new CategoryController