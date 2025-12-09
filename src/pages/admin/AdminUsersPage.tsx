import { useState } from 'react'
import { useAdminUsers, useUpdateUser } from '../../api/admin'
import Loading from '../../components/Loading'

export default function AdminUsersPage() {
  const [filters, setFilters] = useState<{ role?: string; isActive?: boolean; page?: number; limit?: number }>({})
  const { data, isLoading, error } = useAdminUsers(filters)
  const updateUser = useUpdateUser()

  if (isLoading) return <Loading />
  if (error) return <div className="container-default py-10">Failed to load users.</div>

  const handleRoleUpdate = async (userId: string, role: string) => {
    try {
      await updateUser.mutateAsync({ userId, userData: { role } })
    } catch (error) {
      console.error('Failed to update user role:', error)
    }
  }

  const handleStatusUpdate = async (userId: string, isActive: boolean) => {
    try {
      await updateUser.mutateAsync({ userId, userData: { isActive } })
    } catch (error) {
      console.error('Failed to update user status:', error)
    }
  }

  return (
    <div className="container-default py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">User Management</h2>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          value={filters.role || ''}
          onChange={(e) => setFilters({ ...filters, role: e.target.value || undefined })}
          className="border rounded px-3 py-2"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={filters.isActive === undefined ? '' : filters.isActive.toString()}
          onChange={(e) => setFilters({ 
            ...filters, 
            isActive: e.target.value === '' ? undefined : e.target.value === 'true' 
          })}
          className="border rounded px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {data?.users?.map((user: any) => (
          <div key={user._id} className="border rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <h3 className="font-medium mb-2">User Info</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>{user.firstName} {user.lastName}</div>
                  <div>{user.email}</div>
                  {user.phone && <div>{user.phone}</div>}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Account Details</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Role: {user.role}</div>
                  <div>Provider: {user.authProvider || 'local'}</div>
                  <div>Joined: {new Date(user.createdAt).toDateString()}</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <div className="space-y-2">
                  <div className={`text-sm px-2 py-1 rounded inline-block ${
                    user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Actions</h3>
                <div className="space-y-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                    className="text-xs border rounded px-2 py-1 w-full"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  
                  <button
                    onClick={() => handleStatusUpdate(user._id, !user.isActive)}
                    className={`text-xs px-2 py-1 rounded w-full ${
                      user.isActive 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
            disabled={!data.pagination.hasPrevPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {data.pagination.currentPage} of {data.pagination.totalPages}
          </span>
          <button
            onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
            disabled={!data.pagination.hasNextPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
