'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type User = { id: number; email: string; name: string; isAgent: boolean }
type Package = { id: number; name: string; description: string; services: any[] }
type Invoice = { id: number; invoiceNumber: string; status: string; amount: number; customerId: number; dueDate: string }

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<User | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const meRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const me = await meRes.json()
        setUserData(me)

        if (me.isAgent) {
          const pkgRes = await fetch('/api/packages', {
            headers: { Authorization: `Bearer ${token}` }
          })
          const pkgs = await pkgRes.json()
          setPackages(pkgs)

          const invRes = await fetch('/api/invoices', {
            headers: { Authorization: `Bearer ${token}` }
          })
          const invs = await invRes.json()
          setInvoices(invs)
        } else {
          const invRes = await fetch('/api/invoices?filterBy=received', {
            headers: { Authorization: `Bearer ${token}` }
          })
          const invs = await invRes.json()
          setInvoices(invs)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!userData) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Travel Booking Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{userData.name} {userData.isAgent && <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Agent</span>}</span>
            <button
              onClick={() => {
                localStorage.removeItem('token')
                router.push('/login')
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {userData.isAgent ? (
          <AgentDashboard packages={packages} invoices={invoices} />
        ) : (
          <CustomerDashboard invoices={invoices} />
        )}
      </div>
    </div>
  )
}

function AgentDashboard({ packages, invoices }: { packages: Package[]; invoices: Invoice[] }) {
  const [tab, setTab] = useState('packages')
  const [showCreatePackage, setShowCreatePackage] = useState(false)
  const [packageName, setPackageName] = useState('')
  const [packageDesc, setPackageDesc] = useState('')
  const token = localStorage.getItem('token') || ''

  const handleCreatePackage = async () => {
    try {
      await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: packageName,
          description: packageDesc,
          serviceIds: []
        })
      })
      window.location.reload()
    } catch (error) {
      console.error('Failed to create package:', error)
    }
  }

  return (
    <div>
      <div className="mb-6 border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setTab('packages')}
            className={`px-4 py-2 font-semibold ${tab === 'packages' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Travel Packages ({packages.length})
          </button>
          <button
            onClick={() => setTab('invoices')}
            className={`px-4 py-2 font-semibold ${tab === 'invoices' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Invoices ({invoices.length})
          </button>
        </div>
      </div>

      {tab === 'packages' && (
        <div>
          <button
            onClick={() => setShowCreatePackage(!showCreatePackage)}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Create Package
          </button>

          {showCreatePackage && (
            <div className="mb-6 bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">New Travel Package</h3>
              <input
                type="text"
                placeholder="Package name"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="w-full mb-3 p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={packageDesc}
                onChange={(e) => setPackageDesc(e.target.value)}
                className="w-full mb-3 p-2 border rounded"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreatePackage}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreatePackage(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold text-lg">{pkg.name}</h3>
                <p className="text-gray-600 text-sm">{pkg.description}</p>
                <p className="mt-2 text-sm text-gray-500">{pkg.services.length} services included</p>
              </div>
            ))}
            {packages.length === 0 && !showCreatePackage && (
              <p className="text-gray-500">No packages yet. Create one to get started!</p>
            )}
          </div>
        </div>
      )}

      {tab === 'invoices' && (
        <div>
          <div className="grid gap-4">
            {invoices.map((inv) => (
              <div key={inv.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{inv.invoiceNumber}</h3>
                  <p className="text-sm text-gray-600">Amount: ${inv.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${inv.status === 'paid' ? 'bg-green-100 text-green-800' : inv.status === 'sent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {inv.status}
                </span>
              </div>
            ))}
            {invoices.length === 0 && (
              <p className="text-gray-500">No invoices yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function CustomerDashboard({ invoices }: { invoices: Invoice[] }) {
  const router = useRouter()
  const token = localStorage.getItem('token') || ''

  const handlePayInvoice = async (invoiceId: number) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({})
      })
      const data = await res.json()
      if (data.orderId) {
        // Redirect to PayPal checkout
        window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${data.orderId}`
      }
    } catch (error) {
      console.error('Failed to initiate payment:', error)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Your Invoices</h2>
      <div className="grid gap-4">
        {invoices.map((inv) => (
          <div key={inv.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{inv.invoiceNumber}</h3>
                <p className="text-sm text-gray-600">Amount: ${inv.amount.toFixed(2)}</p>
              </div>
              <span className={`px-3 py-1 rounded text-sm font-semibold ${inv.status === 'paid' ? 'bg-green-100 text-green-800' : inv.status === 'sent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                {inv.status}
              </span>
            </div>
            {inv.status !== 'paid' && (
              <button
                onClick={() => handlePayInvoice(inv.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Pay Now
              </button>
            )}
          </div>
        ))}
        {invoices.length === 0 && (
          <p className="text-gray-500">No invoices. Check back soon!</p>
        )}
      </div>
    </div>
  )
}