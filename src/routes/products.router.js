const express = require("express");
const router = express.Router();
const fs = require("fs");
const filePath = '../products.json'; 

//Mostrar todos los productos
router.get('/', (req, res) => {
    if (!fs.existsSync(filePath)) {
        return res.status(200).json({msg: "No tienes ningún producto agregado"});
    }
    
    const data = fs.readFileSync(filePath, "utf8");
    res.status(200).json(JSON.parse(data));
});

//Mostrar producto por ID
router.get('/:pid', (req, res) => {
    const data = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(data);
    const productID = parseInt(req.params.pid);
    const encontrado = products.find((product) => product.id === productID);
    if (encontrado) {
        res.status(200).json(encontrado);
    } else {
        res.status(404).json({msg:`Producto con id ${productID} no fue encontrado`});
    }
});

//Agregar un nuevo producto
router.post('/', (req, res) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([])); 
    }
    const data = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(data);
    
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ msg: "Todos los campos son requeridos" });
    }

    const newProduct = {
        id: products.length + 1,
        title: title || "New Product",
        description: description || "New Description",
        code: code || "New code",
        price: price || 0,
        status: status || true,
        stock: stock || 0,
        category: category || null,
        thumbnails: thumbnails || null
    };
    
    products.push(newProduct);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

    res.status(200).json({msg: "Producto agregado con exito"});
});

//Actualizar un producto
router.put('/:pid', (req, res) => {
    const data = fs.readFileSync(filePath, "utf8");
    let products = JSON.parse(data);
    const productID = parseInt(req.params.pid);
    const encontradoIndex = products.findIndex((product) => product.id === productID);

    if (encontradoIndex !== -1) {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;

        products[encontradoIndex].title = title || products[encontradoIndex].title;
        products[encontradoIndex].description = description || products[encontradoIndex].description;
        products[encontradoIndex].code = code || products[encontradoIndex].code;
        products[encontradoIndex].price = price || products[encontradoIndex].price;
        products[encontradoIndex].status = status || products[encontradoIndex].status;
        products[encontradoIndex].stock = stock || products[encontradoIndex].stock;
        products[encontradoIndex].category = category || products[encontradoIndex].category;
        products[encontradoIndex].thumbnails = thumbnails || products[encontradoIndex].thumbnails;

        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

        res.json(products[encontradoIndex]);
    } else {
        res.status(404).json({msg: "No se ha encontrado producto con el id proporcionado"});
    }
});

//Eliminar un producto
router.delete('/:pid', (req, res) => {
    const data = fs.readFileSync(filePath, "utf8");
    let products = JSON.parse(data);
    const productID = parseInt(req.params.pid);
    const encontrado = products.find((product) => product.id === productID);
    if (encontrado){
        products = products.filter((product) => product.id !== productID);
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
        res.status(200).json({ msg: `Producto con ID ${productID} eliminado correctamente` });
    } 
    res.status(404).json({ msg: `Producto con ID ${productID} no se encontro`});
});

module.exports = router;


