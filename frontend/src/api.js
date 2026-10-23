
const API_URL = 'http://localhost/amader-bazar-api';

export async function getProducts() {
  const response = await fetch(`${API_URL}/get-products.php`);

  if (!response.ok) {
    throw new Error('Products load failed');
  }

 
const data = await response.json();

if (!data.success) {
  console.error('Get products API response:', data);
  throw new Error(data.message || 'Products load failed');
}

  return data.products.map((product) => ({
    ...product,
    image: product.image
      ? `${API_URL}/${product.image}`
      : null,
    price: Number(product.price),
    oldPrice: Number(product.oldPrice || 0),
    stock: Number(product.stock || 0),
    rating: Number(product.rating || 4.5),
    emoji: product.emoji || '🛍️',
    color: product.color || 'mint'
  }));
}

export async function addProduct(product, imageFile) {
  const formData = new FormData();

  formData.append('name', product.name);
  formData.append('category', product.category);
  formData.append('price', String(product.price));
  formData.append('oldPrice', String(product.oldPrice));
  formData.append('stock', String(product.stock));
  formData.append('desc', product.desc || '');

  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await fetch(`${API_URL}/add-product.php`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Product save failed');
  }

  return data;
}

export async function updateProduct(id, product, imageFile) {
  const formData = new FormData();

  formData.append('id', String(id));
  formData.append('name', product.name);
  formData.append('category', product.category);
  formData.append('price', String(product.price));
  formData.append('oldPrice', String(product.oldPrice));
  formData.append('stock', String(product.stock));
  formData.append('desc', product.desc || '');

  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await fetch(`${API_URL}/update-product.php`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Product update failed');
  }

  return data;
}

export async function deleteProduct(id) {
  const formData = new FormData();
  formData.append('id', String(id));

  const response = await fetch(`${API_URL}/delete-product.php`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Product delete failed');
  }

  return data;
}
