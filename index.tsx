import React, { useState, useMemo, FormEvent, FC } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Interface defining the structure for a product object.
interface Product {
  id: number;
  name: string;
  price: number;
}

// Initial sample data to populate the product list.
const initialProducts: Product[] = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Keyboard', price: 75 },
  { id: 3, name: 'Mouse', price: 25 },
  { id: 4, name: 'Monitor', price: 300 },
  { id: 5, name: 'Webcam', price: 50 },
];

const App: FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Memoized value to find and display the price of a searched item efficiently.
  const foundPrice = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const searchLower = searchTerm.toLowerCase();
    const foundProduct = products.find(p => p.name.toLowerCase().startsWith(searchLower));
    return foundProduct ? `$${foundProduct.price.toFixed(2)}` : 'Tidak ditemukan';
  }, [searchTerm, products]);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!productName.trim() || !productPrice) return;

    const price = parseFloat(productPrice);
    if (isNaN(price)) {
      alert('Harga harus berupa angka.');
      return;
    }

    if (editingId !== null) {
      // Update existing product
      setProducts(
        products.map(p =>
          p.id === editingId ? { ...p, name: productName.trim(), price } : p
        )
      );
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now(), // Use timestamp for a simple unique ID
        name: productName.trim(),
        price,
      };
      setProducts([...products, newProduct]);
    }

    resetForm();
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setProductName(product.name);
    setProductPrice(product.price.toString());
    document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteClick = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };
  
  const resetForm = () => {
    setEditingId(null);
    setProductName('');
    setProductPrice('');
  }

  return (
    <div className="container">
      <header>
        <h1>Harga Pokok Produk DRF HIJAB</h1>
      </header>

      <section className="card search-section">
        <h2>Cari Harga Barang</h2>
        <div className="search-wrapper">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Ketik nama barang..."
            aria-label="Cari nama barang"
          />
          {searchTerm && <p className="price-display">Harga: <strong>{foundPrice}</strong></p>}
        </div>
      </section>

      <main className="card crud-section">
        <h2>{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="productName">Nama Produk</label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="Contoh: Meja Belajar"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="productPrice">Harga Produk</label>
            <input
              id="productPrice"
              type="number"
              value={productPrice}
              onChange={e => setProductPrice(e.target.value)}
              placeholder="Contoh: 150"
              required
              step="0.01"
              min="0"
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Perbarui Produk' : 'Tambah Produk'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Batal
              </button>
            )}
          </div>
        </form>
      </main>

      <section className="card product-list-section">
        <h2>Daftar Produk</h2>
        <ul className="product-list">
          {products.map(product => (
            <li key={product.id} className="product-item">
              <div className="product-details">
                <span className="product-name">{product.name}</span>
                <span className="product-price">${product.price.toFixed(2)}</span>
              </div>
              <div className="product-actions">
                <button onClick={() => handleEditClick(product)} className="btn btn-edit" aria-label={`Edit ${product.name}`}>Edit</button>
                <button onClick={() => handleDeleteClick(product.id)} className="btn btn-danger" aria-label={`Hapus ${product.name}`}>Hapus</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
