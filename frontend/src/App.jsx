import { useEffect, useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

const Home = () => (
  <PageWrapper>
    <div className="page page-renter">
      <h1 className="brand">SMARTLINK AUTO</h1>
      <p className="subtitle">A transparent, distributed car rental platform.</p>
      <div className="hero-card">
        <div className="hero-text">
          <h2>Book your next ride in a few clicks</h2>
          <p>Search by city, dates, and vehicle type. Experience a seamless, trusted rental flow.</p>
        </div>
        <div className="hero-actions">
          <button className="primary-btn">Start searching</button>
          <button className="ghost-btn">Learn more</button>
        </div>
      </div>
    </div>
  </PageWrapper>
)

const PartnerDashboard = () => {
  const [partnerForm, setPartnerForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  })
  const [partnerIdOverride, setPartnerIdOverride] = useState('')
  const [createdPartner, setCreatedPartner] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
    licensePlate: '',
    basePricePerDay: '',
    location: '',
  })
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const effectivePartnerId = partnerIdOverride || createdPartner?.id || ''

  useEffect(() => {
    if (!effectivePartnerId) return

    setLoadingVehicles(true)
    setError('')
    fetch(`${API_BASE_URL}/partners/${effectivePartnerId}/vehicles`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || 'Failed to load vehicles')
        }
        return res.json()
      })
      .then((data) => {
        setVehicles(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => setLoadingVehicles(false))
  }, [effectivePartnerId])

  const handlePartnerChange = (e) => {
    const { name, value } = e.target
    setPartnerForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreatePartner = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch(`${API_BASE_URL}/partners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partnerForm),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to create partner')
      }
      const data = await res.json()
      setCreatedPartner(data)
      setMessage('Partner created successfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleVehicleChange = (e) => {
    const { name, value } = e.target
    setVehicleForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateVehicle = async (e) => {
    e.preventDefault()
    if (!effectivePartnerId) {
      setError('Please create or specify a partner first')
      return
    }

    setSubmitting(true)
    setError('')
    setMessage('')
    const payload = {
      ...vehicleForm,
      year: Number(vehicleForm.year),
      basePricePerDay: Number(vehicleForm.basePricePerDay),
    }
    try {
      const res = await fetch(`${API_BASE_URL}/partners/${effectivePartnerId}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to create vehicle')
      }
      const created = await res.json()
      setVehicles((prev) => [...prev, created])
      setMessage('Vehicle added successfully')
      setVehicleForm({
        make: '',
        model: '',
        year: '',
        vin: '',
        licensePlate: '',
        basePricePerDay: '',
        location: '',
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageWrapper>
      <div className="page page-partner">
        <h2>Partner dashboard</h2>
        <p>Onboard vehicles, manage availability, and track your earnings.</p>

        <div className="grid grid-2">
          <div className="card-soft">
            <h3>Create partner</h3>
            <form className="form-grid" onSubmit={handleCreatePartner}>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={partnerForm.email}
                onChange={handlePartnerChange}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={partnerForm.password}
                onChange={handlePartnerChange}
              />
              <input
                name="firstName"
                placeholder="First name"
                value={partnerForm.firstName}
                onChange={handlePartnerChange}
              />
              <input
                name="lastName"
                placeholder="Last name"
                value={partnerForm.lastName}
                onChange={handlePartnerChange}
              />
              <input
                name="phoneNumber"
                placeholder="Phone number"
                value={partnerForm.phoneNumber}
                onChange={handlePartnerChange}
              />
              <button className="primary-btn" type="submit" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Create partner'}
              </button>
            </form>
            {createdPartner && (
              <p className="hint">Created partner ID: {createdPartner.id}</p>
            )}
            <div className="hint">
              <label>
                Use partner ID:
                <input
                  value={partnerIdOverride}
                  onChange={(e) => setPartnerIdOverride(e.target.value)}
                  placeholder="Override partner ID"
                />
              </label>
            </div>
          </div>

          <div className="card-soft">
            <h3>Add vehicle</h3>
            <form className="form-grid" onSubmit={handleCreateVehicle}>
              <input
                name="make"
                placeholder="Make"
                value={vehicleForm.make}
                onChange={handleVehicleChange}
              />
              <input
                name="model"
                placeholder="Model"
                value={vehicleForm.model}
                onChange={handleVehicleChange}
              />
              <input
                name="year"
                placeholder="Year"
                value={vehicleForm.year}
                onChange={handleVehicleChange}
              />
              <input
                name="vin"
                placeholder="VIN"
                value={vehicleForm.vin}
                onChange={handleVehicleChange}
              />
              <input
                name="licensePlate"
                placeholder="License plate"
                value={vehicleForm.licensePlate}
                onChange={handleVehicleChange}
              />
              <input
                name="basePricePerDay"
                placeholder="Base price / day"
                value={vehicleForm.basePricePerDay}
                onChange={handleVehicleChange}
              />
              <input
                name="location"
                placeholder="Location (city)"
                value={vehicleForm.location}
                onChange={handleVehicleChange}
              />
              <button className="primary-btn" type="submit" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Add vehicle'}
              </button>
            </form>
          </div>
        </div>

        {(message || error) && (
          <p className={error ? 'status status-error' : 'status status-ok'}>
            {error || message}
          </p>
        )}

        <div className="card-soft" style={{ marginTop: '1.5rem' }}>
          <h3>Vehicles for partner</h3>
          {!effectivePartnerId && <p className="hint">Create a partner or enter an existing partner ID.</p>}
          {effectivePartnerId && (
            <p className="hint">Showing vehicles for partner ID: {effectivePartnerId}</p>
          )}
          {loadingVehicles ? (
            <p>Loading vehicles…</p>
          ) : vehicles.length === 0 ? (
            <p>No vehicles yet.</p>
          ) : (
            <ul className="vehicle-list">
              {vehicles.map((v) => (
                <li key={v.id} className="vehicle-item">
                  <div className="vehicle-main">
                    <strong>
                      {v.make} {v.model}
                    </strong>{' '}
                    ({v.year})
                  </div>
                  <div className="vehicle-meta">
                    <span>{v.licensePlate}</span>
                    <span>{v.location}</span>
                    <span>{Number(v.basePricePerDay)} / day</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

const AdminPanel = () => {
  const [overview, setOverview] = useState(null)
  const [pendingPartners, setPendingPartners] = useState([])
  const [pendingVehicles, setPendingVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [adminMessage, setAdminMessage] = useState('')
  const [adminError, setAdminError] = useState('')

  const refreshData = async () => {
    setLoading(true)
    setAdminError('')
    try {
      const [overviewRes, partnersRes, vehiclesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/overview`),
        fetch(`${API_BASE_URL}/admin/partners/pending`),
        fetch(`${API_BASE_URL}/admin/vehicles/pending`),
      ])

      if (!overviewRes.ok || !partnersRes.ok || !vehiclesRes.ok) {
        throw new Error('Failed to load admin data')
      }

      const [overviewData, partnersData, vehiclesData] = await Promise.all([
        overviewRes.json(),
        partnersRes.json(),
        vehiclesRes.json(),
      ])

      setOverview(overviewData)
      setPendingPartners(Array.isArray(partnersData) ? partnersData : [])
      setPendingVehicles(Array.isArray(vehiclesData) ? vehiclesData : [])
    } catch (err) {
      setAdminError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  const handlePartnerVerification = async (id, status) => {
    setAdminError('')
    setAdminMessage('')
    try {
      const res = await fetch(`${API_BASE_URL}/admin/partners/${id}/verification`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to update partner')
      }
      setPendingPartners((prev) => prev.filter((p) => p.id !== id))
      setAdminMessage('Partner updated')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  const handleVehicleStatus = async (id, status) => {
    setAdminError('')
    setAdminMessage('')
    try {
      const res = await fetch(`${API_BASE_URL}/admin/vehicles/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to update vehicle')
      }
      setPendingVehicles((prev) => prev.filter((v) => v.id !== id))
      setAdminMessage('Vehicle updated')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  return (
    <PageWrapper>
      <div className="page page-admin">
        <h2>Admin panel</h2>
        <p>Approve partners and vehicles, monitor bookings, and manage disputes.</p>

        {overview && (
          <div className="grid grid-3 admin-overview">
            <div className="card-soft">
              <h3>Users</h3>
              <p className="metric">{overview.totalUsers}</p>
              <p className="hint">Total users</p>
            </div>
            <div className="card-soft">
              <h3>Vehicles</h3>
              <p className="metric">{overview.totalVehicles}</p>
              <p className="hint">{overview.activeVehicles} active</p>
            </div>
            <div className="card-soft">
              <h3>Pending</h3>
              <p className="hint">Renters: {overview.pendingRenters}</p>
              <p className="hint">Partners: {overview.pendingPartners}</p>
              <p className="hint">Vehicles: {overview.pendingVehicles}</p>
            </div>
          </div>
        )}

        {loading && <p>Loading admin data…</p>}
        {(adminMessage || adminError) && (
          <p className={adminError ? 'status status-error' : 'status status-ok'}>
            {adminError || adminMessage}
          </p>
        )}

        <div className="grid grid-2 admin-queues">
          <div className="card-soft">
            <div className="admin-section-header">
              <h3>Pending partners</h3>
              <button className="ghost-btn ghost-btn-sm" type="button" onClick={refreshData}>
                Refresh
              </button>
            </div>
            {pendingPartners.length === 0 ? (
              <p className="hint">No pending partners.</p>
            ) : (
              <ul className="admin-list">
                {pendingPartners.map((p) => (
                  <li key={p.id} className="admin-item">
                    <div className="admin-main">
                      <strong>{p.email}</strong>
                      <span className="admin-sub">
                        {p.firstName} {p.lastName} · {p.phoneNumber}
                      </span>
                    </div>
                    <div className="admin-actions">
                      <button
                        className="ghost-btn ghost-btn-sm"
                        type="button"
                        onClick={() => handlePartnerVerification(p.id, 'REJECTED')}
                      >
                        Reject
                      </button>
                      <button
                        className="primary-btn primary-btn-sm"
                        type="button"
                        onClick={() => handlePartnerVerification(p.id, 'VERIFIED')}
                      >
                        Approve
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card-soft">
            <div className="admin-section-header">
              <h3>Pending vehicles</h3>
              <button className="ghost-btn ghost-btn-sm" type="button" onClick={refreshData}>
                Refresh
              </button>
            </div>
            {pendingVehicles.length === 0 ? (
              <p className="hint">No pending vehicles.</p>
            ) : (
              <ul className="admin-list">
                {pendingVehicles.map((v) => (
                  <li key={v.id} className="admin-item">
                    <div className="admin-main">
                      <strong>
                        {v.make} {v.model}
                      </strong>{' '}
                      ({v.year})
                      <span className="admin-sub">
                        Plate {v.licensePlate} · Partner {v.partner?.email}
                      </span>
                    </div>
                    <div className="admin-actions">
                      <button
                        className="ghost-btn ghost-btn-sm"
                        type="button"
                        onClick={() => handleVehicleStatus(v.id, 'INACTIVE')}
                      >
                        Reject
                      </button>
                      <button
                        className="primary-btn primary-btn-sm"
                        type="button"
                        onClick={() => handleVehicleStatus(v.id, 'ACTIVE')}
                      >
                        Approve
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo-mark">SA</div>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Renter
          </NavLink>
          <NavLink to="/partner" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Partner
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Admin
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/partner" element={<PartnerDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
