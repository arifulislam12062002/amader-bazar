import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, Search, Menu, UserRound, ShieldCheck, Heart, Star, Truck, Sparkles, Plus, Minus, Trash2, X, PackagePlus, Pencil, LogOut, ShoppingBag } from 'lucide-react';

import { getProducts, addProduct, updateProduct, deleteProduct } from './api';


const initialProducts = [
  { id: 1, name: 'Samsung Galaxy A55', category: 'Electronics', price: 32999, oldPrice: 36999, emoji: '📱', color: 'lavender', rating: 4.8, stock: 12, desc: 'Brilliant display, great camera and all-day battery.' },
  { id: 2, name: 'UltraBook Air 15', category: 'Electronics', price: 54999, oldPrice: 62999, emoji: '💻', color: 'blue', rating: 4.7, stock: 8, desc: 'Lightweight performance for study and work.' },
  { id: 3, name: 'AirPods Pro', category: 'Electronics', price: 2299, oldPrice: 2999, emoji: '🎧', color: 'pink', rating: 4.6, stock: 25, desc: 'Comfortable listening with rich, clear sound.' },
  { id: 4, name: 'Smart Watch X', category: 'Electronics', price: 8999, oldPrice: 10999, emoji: '⌚', color: 'mint', rating: 4.5, stock: 18, desc: 'Your daily activity and notifications at a glance.' },
  { id: 5, name: 'Everyday Sneakers', category: 'Fashion', price: 2500, oldPrice: 3200, emoji: '👟', color: 'peach', rating: 4.4, stock: 30, desc: 'Easy everyday comfort with a sporty style.' },
  { id: 6, name: 'Cozy Lounge Chair', category: 'Home & Living', price: 7999, oldPrice: 9499, emoji: '🪑', color: 'yellow', rating: 4.7, stock: 6, desc: 'A cheerful accent for your favourite corner.' },
  { id: 7, name: 'Everyday Backpack', category: 'Fashion', price: 1450, oldPrice: 1890, emoji: '🎒', color: 'mint', rating: 4.3, stock: 20, desc: 'Roomy, practical and ready for everyday adventures.' },
  { id: 8, name: 'Skincare Set', category: 'Beauty', price: 1250, oldPrice: 1600, emoji: '🧴', color: 'pink', rating: 4.5, stock: 14, desc: 'A simple care set for your daily routine.' },
  { id: 9, name: 'Football Pro', category: 'Sports', price: 950, oldPrice: 1200, emoji: '⚽', color: 'blue', rating: 4.6, stock: 22, desc: 'A durable ball for fun games and practice.' },
  { id: 10, name: 'Desk Lamp', category: 'Home & Living', price: 1800, oldPrice: 2200, emoji: '💡', color: 'yellow', rating: 4.4, stock: 10, desc: 'Brighten your desk with a warm, modern glow.' },
  { id: 11, name: 'Wireless Gamepad', category: 'Electronics', price: 3200, oldPrice: 3999, emoji: '🎮', color: 'lavender', rating: 4.6, stock: 11, desc: 'Responsive controls for your favourite games.' },
  { id: 12, name: 'Gift Box', category: 'Toys', price: 780, oldPrice: 990, emoji: '🎁', color: 'peach', rating: 4.8, stock: 16, desc: 'A little surprise for someone special.' }
];
const categories = [['All Products', '✨'], ['Electronics', '📱'], ['Fashion', '👕'], ['Home & Living', '🛋️'], ['Sports', '⚽'], ['Beauty', '🧴'], ['Toys', '🧸']];
const money = n => '৳ ' + Number(n).toLocaleString('en-BD');
export default function App() {
  const [products, setProducts] = useState(initialProducts);

useEffect(() => {
  getProducts()
    .then((data) => {
      setProducts(data);
    })
    .catch((error) => {
      console.error('Products load error:', error);
    });
}, []);


  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [category, setCategory] = useState('All Products'); const [search, setSearch] = useState(''); const [cart, setCart] = useState([]); const [panel, setPanel] = useState(''); const [role, setRole] = useState(''); const [user, setUser] = useState(null); const [notice, setNotice] = useState(''); const [editing, setEditing] = useState(null); const [form, setForm] = useState({ name: '', category: 'Electronics', price: '', oldPrice: '', stock: '10', desc: '' }); const [orders, setOrders] = useState([]);
  const filtered = useMemo(() => products.filter(p => (category === 'All Products' || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase())), [products, category, search]);
  const count = cart.reduce((s, x) => s + x.qty, 0), total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  function toast(s) { setNotice(s); setTimeout(() => setNotice(''), 2600) }
  function add(p) { setCart(c => { const found = c.find(x => x.id === p.id); return found ? c.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x) : [...c, { ...p, qty: 1 }] }); toast('Added to your cart!') }
  function changeQty(id, delta) { setCart(c => c.map(x => x.id === id ? { ...x, qty: x.qty + delta } : x).filter(x => x.qty > 0)) }
  function login(e) { e.preventDefault(); const fd = new FormData(e.currentTarget); const email = fd.get('email'); const password = fd.get('password'); if (role === 'admin') { if (email === 'admin@amaderbazar.local' && password === 'Admin123!') { setUser({ name: 'Store Admin', email, role: 'admin' }); setPanel('admin'); toast('Admin demo session started') } else toast('Demo admin: admin@amaderbazar.local / Admin123!') } else { if (!email || !password) return toast('Enter your email and password'); setUser({ name: String(email).split('@')[0], email, role: 'user' }); setPanel(''); toast('Welcome to Amader Bazar!') } }


async function handleDeleteProduct(id, name) {
  const confirmed = window.confirm(`আপনি কি "${name}" প্রোডাক্টটি Delete করতে চান?`);

  if (!confirmed) return;

  try {
    await deleteProduct(id);

    const data = await getProducts();
    setProducts(data);

    toast('Product deleted successfully!');
  } catch (error) {
    console.error('Product delete error:', error);
    toast(error.message || 'Product delete failed!');
  }
}

  async function saveProduct(e) {
    e.preventDefault();


    const product = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      oldPrice: Number(form.oldPrice || form.price),
      stock: Number(form.stock),
      desc: form.desc,
      image: imagePreview
    };


    try {
     if (editing) {
  await updateProduct(editing, product, imageFile);
} else {
  await addProduct(product, imageFile);
}

      const data = await getProducts();
      setProducts(data);

      setImagePreview('');
      setImageFile(null);
      setEditing(null);
      setForm({
        name: '',
        category: 'Electronics',
        price: '',
        oldPrice: '',
        stock: '10',
        desc: ''
      });

      toast('Product saved successfully!');
    } catch (error) {
      console.error(error);
      toast('Product save failed!');
    }
  }


  function editProduct(p) { setEditing(p.id); setImagePreview(p.image || '');
setImageFile(null); setForm({ ...p, price: String(p.price), oldPrice: String(p.oldPrice), stock: String(p.stock) }); setPanel('productForm') }
  function checkout(e) { e.preventDefault(); if (!user) return setPanel('userLogin'); if (!cart.length) return toast('Your cart is empty'); const fd = new FormData(e.currentTarget); setOrders(o => [{ id: Date.now(), customer: user.name, total, status: 'Pending', address: fd.get('address') }, ...o]); setCart([]); setPanel(''); toast('Order placed successfully!') }
  return <div className="app">
    <div className="topline">🎉 Welcome to Amader Bazar — smart shopping, happier living! <span>Free delivery on orders over ৳3,000</span></div>
    <header className="header"><button className="iconbtn mobileMenu" onClick={() => setPanel(panel === 'menu' ? '' : 'menu')}><Menu /></button><button className="brand" onClick={() => { setCategory('All Products'); setPanel('') }}><span className="brandmark">🛒</span><span><b>Amader <em>Bazar</em></b><small>SHOP SMART · LIVE BETTER</small></span></button><div className="search"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for products, brands and more..." /><button onClick={() => document.querySelector('.products')?.scrollIntoView({ behavior: 'smooth' })}>Search</button></div><nav><button onClick={() => setPanel('userLogin')}><UserRound size={17} /> Login</button><button onClick={() => { setRole('user'); setPanel('register') }}>Register</button><button className="cartbtn" onClick={() => setPanel('cart')}><ShoppingCart size={20} /><span>{count}</span></button></nav></header>
    <div className="categorybar">{categories.map(([c, emoji]) => <button className={category === c ? 'active' : ''} key={c} onClick={() => { setCategory(c); document.querySelector('.products')?.scrollIntoView({ behavior: 'smooth' }) }}>{emoji} {c}</button>)}<button className="adminlink" onClick={() => { setRole('admin'); setPanel('adminLogin') }}><ShieldCheck size={16} /> Admin</button></div>
    <main>
      <section className="hero"><div className="herotext"><div className="eyebrow"><Sparkles size={15} /> THE EVERYDAY SHOPPING FEST</div><h1>Big Deals.<br /><span>Big Smiles.</span></h1><p>Everything you love, at prices you'll love even more.</p><div className="heroactions"><button className="primary" onClick={() => document.querySelector('.products')?.scrollIntoView({ behavior: 'smooth' })}>Shop now <span>→</span></button><div className="delivery"><Truck /><small><b>Quick delivery</b><br />Right to your door</small></div></div><div className="dots"><i /><i /><i /></div></div><div className="heroart"><div className="sunburst" /><div className="dealbubble">UP TO<br /><b>50% OFF</b></div><div className="bigemoji">🛍️</div><div className="float f1">🎧</div><div className="float f2">⌚</div><div className="float f3">📱</div><div className="float f4">🎁</div><div className="herocaption">Your happy place for shopping ✨</div></div></section>
      <section className="benefits"><div><span>🚚</span><p><b>Fast Delivery</b><small>At your doorstep</small></p></div><div><span>🛡️</span><p><b>Secure Shopping</b><small>Shop with confidence</small></p></div><div><span>💝</span><p><b>Great Prices</b><small>Deals worth smiling for</small></p></div><div><span>💬</span><p><b>Friendly Support</b><small>Here when you need us</small></p></div></section>
      <section className="categorySection"><div className="sectionheading"><div><span className="kicker">FIND YOUR FAVOURITES</span><h2>Shop by category <span>✦</span></h2></div><p>A little something for everyone.</p></div><div className="categorytiles">{categories.slice(1).map(([c, emoji], i) => <button className={'tile tile' + i} key={c} onClick={() => { setCategory(c); document.querySelector('.products')?.scrollIntoView({ behavior: 'smooth' }) }}><span>{emoji}</span><b>{c}</b><small>Explore collection ↗</small></button>)}</div></section>
      <section className="products"><div className="sectionheading"><div><span className="kicker">HANDPICKED FOR YOU</span><h2>{category === 'All Products' ? 'Popular products' : category} <span>✦</span></h2></div><p>{filtered.length} products to explore</p></div><div className="productgrid">{filtered.map((p, i) => <article className="product" key={p.id} style={{ animationDelay: `${i * 45}ms` }}><div className={'productvisual ' + p.color}><span className="sale">-{Math.max(5, Math.round((1 - p.price / (p.oldPrice || p.price)) * 100))}%</span><button className="heart" onClick={() => toast('Added to favourites')} aria-label="Add to favourites"><Heart size={18} /></button>
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            className="product-photo"
          />
        ) : (
          <span className="productemoji">{p.emoji}</span>
        )}
        <span className="quickview">Ready to make you smile ✨</span></div><div className="productinfo"><small className="productcat">{p.category}</small><h3>{p.name}</h3><div className="rating"><Star size={14} fill="currentColor" /> {p.rating} <span>({Math.floor(p.rating * 23)} reviews)</span></div><div className="prices"><b>{money(p.price)}</b><del>{money(p.oldPrice)}</del></div><button className="addbtn" onClick={() => add(p)}><Plus size={17} /> Add to cart</button></div></article>)}</div>{filtered.length === 0 && <div className="empty">No products found. Try another search. 🔎</div>}</section>
      <section className="newsletter"><div><span className="kicker">A LITTLE JOY IN YOUR INBOX</span><h2>Good deals are better <em>shared.</em></h2><p>Stay in the loop for new arrivals and special offers.</p></div><form onSubmit={e => { e.preventDefault(); toast('Thanks for subscribing!'); e.currentTarget.reset() }}><input type="email" placeholder="Your email address" required /><button className="primary">Count me in →</button></form><span className="newsletterart">💌</span></section>
    </main>
    <footer><div className="footerbrand"><div className="brandmark">🛒</div><b>Amader <em>Bazar</em></b><p>Shop smart. Live better.<br />A little joy in every order.</p></div><div><b>Quick links</b><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button><button onClick={() => { setCategory('All Products'); document.querySelector('.products')?.scrollIntoView({ behavior: 'smooth' }) }}>All products</button><button onClick={() => setPanel('cart')}>Shopping cart</button></div><div><b>Customer care</b><span>Delivery information</span><span>Returns & refunds</span><span>Contact support</span></div><div><b>Made with care 💚</b><p>Colorful finds, fair prices,<br />and a friendlier way to shop.</p><small>Developed by <strong>Ariful Islam</strong></small></div><div className="copyright">© 2026 Amader Bazar. All rights reserved. <span>Made for happy shopping ✨</span></div></footer>
    {notice && <div className="toast"><span>✓</span>{notice}</div>}
    {panel && <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) setPanel('') }}><div className={'drawer ' + (['userLogin', 'adminLogin', 'register', 'productForm'].includes(panel) ? 'modal' : '')}>
      <div className="drawerhead"><div><span className="kicker">AMADER BAZAR</span><h2>{panel === 'cart' ? 'Your shopping cart' : panel === 'checkout' ? 'Secure checkout' : panel === 'admin' ? 'Admin dashboard' : panel === 'productForm' ? (editing ? 'Edit product' : 'Add a product') : panel === 'adminLogin' ? 'Admin login' : panel === 'register' ? 'Create your account' : panel === 'userLogin' ? 'Welcome back' : panel === 'orders' ? 'Your orders' : 'Menu'}</h2></div><button className="iconbtn" onClick={() => setPanel('')}><X /></button></div>
      {panel === 'cart' && <><div className="cartitems">{cart.map(p => <div className="cartitem" key={p.id}><div className={'miniemoji ' + p.color}>{p.emoji}</div><div className="cartdetails"><b>{p.name}</b><strong>{money(p.price)}</strong><div className="qty"><button onClick={() => changeQty(p.id, -1)}><Minus size={13} /></button><span>{p.qty}</span><button onClick={() => changeQty(p.id, 1)}><Plus size={13} /></button></div></div><button className="deletebtn" onClick={() => setCart(c => c.filter(x => x.id !== p.id))}><Trash2 size={16} /></button></div>)}{!cart.length && <div className="emptycart"><span>🛍️</span><h3>Your cart is taking a little nap</h3><p>Add something lovely to wake it up!</p><button className="primary" onClick={() => setPanel('')}>Explore products</button></div>}</div>{!!cart.length && <div className="cartbottom"><div><span>Subtotal</span><b>{money(total)}</b></div><small>Delivery calculated at checkout.</small><button className="primary full" onClick={() => { if (!user) { setPanel('userLogin'); return } setPanel('checkout') }}>Continue to checkout →</button></div>}</>}
      {(panel === 'userLogin' || panel === 'adminLogin' || panel === 'register') && <form className="authform" onSubmit={login}><div className="authicon">{panel === 'adminLogin' ? '🛡️' : panel === 'register' ? '🌈' : '🛍️'}</div><p>{panel === 'adminLogin' ? 'Sign in to manage your store.' : panel === 'register' ? 'Join our shopping community today!' : 'Your next favourite find is waiting.'}</p>{panel === 'register' && <label>Full name<input name="name" placeholder="Your full name" required /></label>}<label>Email address<input name="email" type="email" placeholder={panel === 'adminLogin' ? 'admin@amaderbazar.local' : 'you@example.com'} required /></label><label>Password<input name="password" type="password" placeholder="Enter password" required minLength="6" /></label>{panel === 'adminLogin' && <div className="demoNote">Demo only: admin@amaderbazar.local / Admin123! <br />Change credentials and secure the backend before deployment.</div>}<button className="primary full">{panel === 'adminLogin' ? 'Sign in as Admin' : panel === 'register' ? 'Create account' : 'Sign in'}</button>{panel !== 'adminLogin' && <small className="switchauth">{panel === 'register' ? 'Already have an account?' : 'New to Amader Bazar?'} <button type="button" onClick={() => setPanel(panel === 'register' ? 'userLogin' : 'register')}>{panel === 'register' ? 'Login' : 'Create account'}</button></small>}</form>}
      {panel === 'admin' && <div className="adminpanel"><div className="adminwelcome"><span>👋</span><div><b>Hello, Store Admin!</b><small>Manage your shop from here.</small></div></div><div className="stats"><div><small>Products</small><b>{products.length}</b></div><div><small>Orders</small><b>{orders.length}</b></div><div><small>Revenue</small><b>{money(orders.reduce((s, o) => s + o.total, 0))}</b></div></div><button className="primary full" onClick={() => { setEditing(null); setForm({ name: '', category: 'Electronics', price: '', oldPrice: '', stock: '10', desc: '' }); setPanel('productForm') }}><PackagePlus size={18} /> Add new product</button><h3 className="listtitle">Manage products</h3><div className="adminproducts">{products.map(p => <div key={p.id} className="adminproduct"><span>{p.emoji}</span><div><b>{p.name}</b><small>{money(p.price)} · Stock {p.stock}</small></div>
<button
  onClick={() => editProduct(p)}
  aria-label="Edit product"
>
  <Pencil size={16} />
</button>

<button
  className="deletebtn"
  onClick={() => handleDeleteProduct(p.id, p.name)}
  aria-label="Delete product"
>
  <Trash2 size={16} />
</button>

</div>)}</div><h3 className="listtitle">Recent orders</h3>{orders.length ? orders.map(o => <div className="orderrow" key={o.id}><span>#{String(o.id).slice(-5)} · {o.customer}</span><b>{money(o.total)}</b><small>{o.status}</small></div>) : <p className="muted">No orders yet.</p>}<button className="secondary full logout" onClick={() => { setUser(null); setPanel(''); toast('Signed out') }}><LogOut size={16} /> Log out</button></div>}
      {panel === 'productForm' && <form className="authform productform" onSubmit={saveProduct}>
        <label>
          Product picture
          <input
            type="file"
           accept=".jpg,.jpeg,.png,.webp,.gif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
          />
        </label>

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Product preview"
            style={{
              width: '150px',
              height: '120px',
              objectFit: 'contain',
              borderRadius: '10px',
              border: '1px solid #ddd'
            }}
          />
        )}
        <label>Product name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Wireless headphones" /></label><label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.slice(1).map(([c]) => <option key={c}>{c}</option>)}</select></label><div className="formrow"><label>Price (৳)<input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></label><label>Old price (৳)<input type="number" min="0" value={form.oldPrice} onChange={e => setForm({ ...form, oldPrice: e.target.value })} /></label></div><label>Stock quantity<input type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required /></label><label>Description<textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Describe your product" /></label><button className="primary full">{editing ? 'Save product changes' : 'Add product'}</button></form>}
      {panel === 'checkout' && <form className="authform" onSubmit={checkout}><div className="checkouttotal"><span>Order total</span><b>{money(total)}</b></div><label>Full name<input name="name" defaultValue={user?.name || ''} required /></label><label>Phone number<input name="phone" required placeholder="01XXXXXXXXX" pattern="[0-9+ -]{8,16}" /></label><label>Delivery address<textarea name="address" required placeholder="House, road, area, city" /></label><label>Payment method<select name="payment"><option>Cash on delivery</option><option>bKash (manual confirmation required)</option><option>Nagad (manual confirmation required)</option></select></label><button className="primary full">Place order · {money(total)}</button><small className="muted">Demo checkout. Payment is not collected online.</small></form>}
    </div></div>}
  </div>
}
