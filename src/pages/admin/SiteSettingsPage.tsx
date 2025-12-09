import { useState, useEffect } from 'react'
import api from '../../api/client'
import { Save, Globe, Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react'

interface SiteSettings {
    brand: {
        name: string
        description: string
    }
    socials: {
        facebook: string
        twitter: string
        instagram: string
    }
    contact: {
        address: string
        phone: string
        email: string
    }
}

export default function SiteSettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>({
        brand: { name: '', description: '' },
        socials: { facebook: '', twitter: '', instagram: '' },
        contact: { address: '', phone: '', email: '' }
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings')
            setSettings(res.data.data)
        } catch (error) {
            console.error('Failed to fetch settings:', error)
            setMessage({ type: 'error', text: 'Failed to load settings' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setMessage(null)

        try {
            await api.put('/settings', settings)
            setMessage({ type: 'success', text: 'Settings updated successfully' })
        } catch (error) {
            console.error('Failed to update settings:', error)
            setMessage({ type: 'error', text: 'Failed to update settings' })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <div className="p-8">Loading...</div>

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Brand Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        Brand Information
                    </h2>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                            <input
                                type="text"
                                value={settings.brand.name}
                                onChange={e => setSettings({ ...settings, brand: { ...settings.brand, name: e.target.value } })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={settings.brand.description}
                                onChange={e => setSettings({ ...settings, brand: { ...settings.brand, description: e.target.value } })}
                                rows={3}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        Contact Information
                    </h2>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" /> Address
                            </label>
                            <input
                                type="text"
                                value={settings.contact.address}
                                onChange={e => setSettings({ ...settings, contact: { ...settings.contact, address: e.target.value } })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" /> Phone
                                </label>
                                <input
                                    type="text"
                                    value={settings.contact.phone}
                                    onChange={e => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" /> Email
                                </label>
                                <input
                                    type="text"
                                    value={settings.contact.email}
                                    onChange={e => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Facebook className="w-5 h-5 text-blue-600" />
                        Social Media Links
                    </h2>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Facebook className="w-4 h-4 text-gray-400" /> Facebook URL
                            </label>
                            <input
                                type="text"
                                value={settings.socials.facebook}
                                onChange={e => setSettings({ ...settings, socials: { ...settings.socials, facebook: e.target.value } })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Twitter className="w-4 h-4 text-gray-400" /> Twitter URL
                            </label>
                            <input
                                type="text"
                                value={settings.socials.twitter}
                                onChange={e => setSettings({ ...settings, socials: { ...settings.socials, twitter: e.target.value } })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Instagram className="w-4 h-4 text-gray-400" /> Instagram URL
                            </label>
                            <input
                                type="text"
                                value={settings.socials.instagram}
                                onChange={e => setSettings({ ...settings, socials: { ...settings.socials, instagram: e.target.value } })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}
