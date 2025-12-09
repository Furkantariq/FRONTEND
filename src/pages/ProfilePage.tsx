import { useState, useEffect } from 'react'
import api from '../api/client'
import { useAuth } from '../auth/useAuth'
import { User, Mail, Phone, Shield, CheckCircle } from 'lucide-react'

// Declare global phoneEmailListener for Phone.email SDK
declare global {
  interface Window {
    phoneEmailListener?: (response: any) => void
  }
}

export default function ProfilePage() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  })
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const phoneEmailClientId = import.meta.env.VITE_PHONE_EMAIL_CLIENT_ID

  // Load Phone.email SDK
  useEffect(() => {
    if (!phoneEmailClientId) {
      console.warn('VITE_PHONE_EMAIL_CLIENT_ID not configured')
      return
    }

    // Define the callback function for Phone.email
    window.phoneEmailListener = async (response: any) => {
      try {
        console.log('Phone verification successful:', response)

        // Phone.email SDK returns an object with user_json_url
        const userJsonUrl = typeof response === 'string' ? response : response.user_json_url

        // Call backend to verify and update user
        const res = await api.post('/auth/verify-phone', {
          userJsonUrl
        })

        console.log('Verification response:', res.data)

        // Update local user state with response from backend
        const updatedUser = res.data.user
        const currentAuth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')!) : null
        login(currentAuth?.token || '', currentAuth?.refreshToken || '', updatedUser)

        // Update form state
        setForm(prev => ({ ...prev, phone: updatedUser.phone || '' }))

        setMessage('Phone number verified successfully!')
      } catch (err: any) {
        console.error('Phone verification error:', err)
        setMessage(err?.response?.data?.message || 'Phone verification failed')
      }
    }

    // Load Phone.email SDK script
    const script = document.createElement('script')
    script.src = 'https://www.phone.email/sign_in_button_v1.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      delete window.phoneEmailListener
    }
  }, [phoneEmailClientId, login])

  // Fetch fresh user data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile')
        const freshUser = res.data.user

        // Update auth context
        const currentAuth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')!) : null
        login(currentAuth?.token || '', currentAuth?.refreshToken || '', freshUser)

        // Update form
        setForm(prev => ({
          ...prev,
          firstName: freshUser.firstName || '',
          lastName: freshUser.lastName || '',
          phone: freshUser.phone || ''
        }))
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      }
    }

    fetchProfile()
  }, [])

  const onSave = async () => {
    setIsLoading(true)
    setMessage(null)
    try {
      const res = await api.put('/auth/profile', {
        firstName: form.firstName,
        lastName: form.lastName
        // Phone is not sent here as it's handled via verification
      })
      setMessage('Profile updated successfully!')
      login(localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')!).token : '', localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')!).refreshToken : '', res.data.user)
    } catch (e) {
      setMessage('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="container-default py-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex items-center gap-4">
              {user.profilePicture && !imageError ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white shadow-lg flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                <p className="text-blue-100 text-sm mt-1">{user.email}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin'
                  ? 'bg-yellow-400 text-yellow-900'
                  : 'bg-green-400 text-green-900'
                  }`}>
                  {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                </span>
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium text-center">
                  {user.authProvider === 'google' ? '🔗 Google' : '🔐 Local'}
                </span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Account Information
            </h3>

            <div className="space-y-5">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  Email Address
                </label>
                <input
                  value={user.email}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              {/* Phone with Verification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Phone Number
                  </div>
                  {user.isPhoneVerified ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      Unverified
                    </span>
                  )}
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    value={form.phone}
                    disabled
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500 cursor-not-allowed"
                    placeholder="No phone number linked"
                    type="tel"
                  />
                  {phoneEmailClientId && (
                    <div
                      className="pe_signin_button"
                      data-client-id={phoneEmailClientId}
                      style={{ display: 'inline-block' }}
                    ></div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {phoneEmailClientId
                    ? 'Click the button to verify/change your phone number'
                    : 'Phone verification not configured'}
                </p>
              </div>

              {/* Account Details */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Account Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Account Status: <span className="font-medium text-green-600">Active</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span>Member Since: <span className="font-medium text-gray-900">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={onSave}
                disabled={isLoading}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              {message && (
                <span className={`text-sm font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
