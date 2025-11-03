// server.js
const express = require('express');
const app = express(); // Inisialisasi aplikasi Express
const PORT = 3000;

// Middleware untuk membaca JSON body dari request
app.use(express.json());

// Data in-memory (sebagai pengganti database)
let products = [
    { id: 1, name: 'Pensil 28', price: 5000, stock: 120},
    { id: 2, name: 'Buku Tulis', price: 12000, stock: 50},
];

// 1. GET all products
app.get('/products', (req, res) => {
    res.json({ status: 'success', data: products });
});

// 2. GET product by ID
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        // Mengembalikan status 404 jika produk tidak ditemukan
        return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.json({ status: 'success', data: product });
});

// 3. POST (Create) new product
app.post('/products', (req, res) => {
    const { name, price, stock } = req.body;

    // Validasi input
    if (!name || price == null || stock == null) {
        // Mengembalikan status 400 jika input tidak valid
        return res.status(400).json({ status: 'error', message: 'Invalid input' });
    }

    const newProduct = {
        id: products.length + 1, // Logika ID sederhana
        name,
        price,
        stock
    };
    products.push(newProduct);

    // Mengembalikan status 201 untuk operasi Create yang sukses
    res.status(201).json({ status: 'success', message: 'Product created', data: newProduct });
});

// 4. PUT (Update) product by ID
app.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        // Mengembalikan status 404 jika produk tidak ditemukan
        return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    const { name, price, stock } = req.body;

    // Memperbarui data produk
    products[index] = { id, name, price, stock };

    // Mengembalikan status 200 untuk operasi Update yang sukses
    res.json({ status: 'success', message: 'Product updated', data: products[index] });
});

// 5. DELETE product by ID
app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        // Mengembalikan status 404 jika produk tidak ditemukan
        return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    // Menghapus 1 elemen dari array pada 'index'
    products.splice(index, 1);

    // Mengembalikan status 200/204
    res.json({ status: 'success', message: 'Product deleted' });
    // Catatan: Jika ingin menggunakan 204 (No Content), hapus 'res.json(...)'
    // dan ganti dengan 'res.status(204).send();'
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});