import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createAdminProduct, deactivateAdminProduct, fetchAdminOrders, fetchAdminProducts,
  updateAdminOrderStatus, updateAdminProduct,
} from '../api/adminApi.js'
import { useAuth } from '../features/auth/AuthContext.jsx'

const ORDER_STATUSES = ['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']
const emptyProduct = { name: '', category: 'Coffee', price: '', weight: '250g', roast: '', notes: '', tag: '', image: '' }

function AdminPage() {
  const { token, isAdmin, ready } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState(emptyProduct)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [productsResult, ordersResult] = await Promise.all([fetchAdminProducts(token), fetchAdminOrders(token)])
      setProducts(productsResult.products)
      setOrders(ordersResult.orders)
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!ready) return
    if (!isAdmin) { setLoading(false); return }
    load()
  }, [ready, isAdmin])

  async function handleCreate(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await createAdminProduct(token, { ...draft, price: Number(draft.price) })
      setDraft(emptyProduct)
      await load()
    } catch (createError) {
      setError(createError.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(product) {
    try {
      if (product.active) await deactivateAdminProduct(token, product.id)
      else await updateAdminProduct(token, product.id, { active: true })
      await load()
    } catch (toggleError) {
      setError(toggleError.message)
    }
  }

  async function changeStatus(order, status) {
    try {
      await updateAdminOrderStatus(token, order.id, status)
      await load()
    } catch (statusError) {
      setError(statusError.message)
    }
  }

  if (!ready) return <section className="admin-page"><p>Loading...</p></section>

  if (!isAdmin) {
    return (
      <section className="admin-page">
        <span className="kicker">Restricted</span>
        <h1>Admin access required</h1>
        <p>Sign in with an admin account to manage products and orders.</p>
        <button onClick={() => navigate('/')}>Back to store</button>
      </section>
    )
  }

  return (
    <section className="admin-page">
      <span className="kicker">Dashboard</span>
      <h1>Admin</h1>
      {error && <p className="admin-error" aria-live="polite">{error}</p>}
      {loading ? <p>Loading data...</p> : (
        <>
          <div className="admin-block">
            <h2>Add a product</h2>
            <form className="admin-product-form" onSubmit={handleCreate}>
              <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Name" required />
              <input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} placeholder="Category" />
              <input value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} type="number" min="1" placeholder="Price (₹)" required />
              <input value={draft.weight} onChange={(event) => setDraft({ ...draft, weight: event.target.value })} placeholder="Weight" />
              <input value={draft.roast} onChange={(event) => setDraft({ ...draft, roast: event.target.value })} placeholder="Roast / type" />
              <input value={draft.tag} onChange={(event) => setDraft({ ...draft, tag: event.target.value })} placeholder="Tag" />
              <input value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} placeholder="Notes" />
              <input value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} placeholder="Image URL" />
              <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add product'}</button>
            </form>
          </div>

          <div className="admin-block">
            <h2>Products ({products.length})</h2>
            <div className="admin-table">
              {products.map((product) => (
                <div className={product.active ? 'admin-row' : 'admin-row inactive'} key={product.id}>
                  <span>{product.name}</span>
                  <span>{product.category}</span>
                  <span>₹{product.price}</span>
                  <span>{product.active ? 'Active' : 'Hidden'}</span>
                  <button onClick={() => toggleActive(product)}>{product.active ? 'Hide' : 'Show'}</button>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-block">
            <h2>Orders ({orders.length})</h2>
            {orders.length === 0 ? <p>No orders yet.</p> : (
              <div className="admin-table">
                {orders.map((order) => (
                  <div className="admin-row" key={order.id}>
                    <span>#{order.id.slice(-6)}</span>
                    <span>₹{order.subtotal}</span>
                    <span>{order.items.length} item(s)</span>
                    <select value={order.status} onChange={(event) => changeStatus(order, event.target.value)}>
                      {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}

export default AdminPage
