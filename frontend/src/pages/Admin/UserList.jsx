import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes, FaUser, FaEnvelope, FaCrown } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import { 
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import AdminMenu from "./AdminMenu";

const UserList = () => {
    const { data: users, refetch, isLoading, error } = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const [editableUserId, setEditableUserId] = useState(null);
    const [editableUsername, setEditableUsername] = useState('');
    const [editableUserEmail, setEditableUserEmail] = useState('');
    
    useEffect(() => {
        refetch();
    }, [refetch]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user account?')) {
            try {
                await deleteUser(id);
                toast.success("User deleted successfully");
                refetch();
            } catch (error) {
                console.log("Error in deleteHandler:", error);
                toast.error(error?.data?.message || error?.error || error?.message || "Something went wrong");
            }
        }
    };

    const toggleEdit = (id, username, email) => {
        setEditableUserId(id);
        setEditableUsername(username);
        setEditableUserEmail(email);
    }

    const cancelEdit = () => {
        setEditableUserId(null);
        setEditableUsername('');
        setEditableUserEmail('');
    }

    const updateHandler = async (id) => {
        try {
            await updateUser({
                userId: id,
                username: editableUsername,
                email: editableUserEmail
            });
            toast.success("User updated successfully");
            setEditableUserId(null);
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || error?.error || error?.message || "Something went wrong");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
                    <p className="text-gray-400">Manage all user accounts and permissions</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Admin Menu */}
                    <div className="lg:w-1/5">
                        <AdminMenu />
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-4/5">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader />
                            </div>
                        ) : error ? (
                            <Message variant='danger'>
                                {error?.data?.message || error?.error || error?.message || "Something went wrong"}
                            </Message>
                        ) : (
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
                                {/* Table Header */}
                                <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <FaUser className="text-pink-500 text-xl" />
                                            <h2 className="text-xl font-semibold text-white">
                                                Users ({users?.length || 0})
                                            </h2>
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            Total registered users
                                        </div>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-700/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                            {users?.map((user, index) => (
                                                <tr 
                                                    key={user._id} 
                                                    className={`hover:bg-gray-700/30 transition-colors duration-200 ${
                                                        index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/10'
                                                    }`}
                                                >
                                                    {/* Username Column */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {editableUserId === user._id ? (
                                                            <div className="flex items-center space-x-2">
                                                                <input 
                                                                    type="text" 
                                                                    value={editableUsername} 
                                                                    onChange={e => setEditableUsername(e.target.value)}
                                                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                                                    placeholder="Username"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                                                    <span className="text-white text-sm font-semibold">
                                                                        {user.username?.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <div className="text-white font-medium">
                                                                        {user.username}
                                                                    </div>
                                                                    <div className="text-xs text-gray-400">
                                                                        ID: {user._id.substring(0, 8)}...
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Email Column */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {editableUserId === user._id ? (
                                                            <div className="flex items-center space-x-2">
                                                                <input 
                                                                    type="email" 
                                                                    value={editableUserEmail} 
                                                                    onChange={e => setEditableUserEmail(e.target.value)}
                                                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                                                    placeholder="Email address"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center space-x-2">
                                                                <FaEnvelope className="text-gray-400" />
                                                                <span className="text-gray-300">{user.email}</span>
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Admin Role Column */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            {user.isAdmin ? (
                                                                <>
                                                                    <FaCrown className="text-yellow-500" />
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
                                                                        Admin
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaUser className="text-blue-400" />
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                                                                        User
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Actions Column */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            {editableUserId === user._id ? (
                                                                <>
                                                                    <button 
                                                                        onClick={() => updateHandler(user._id)}
                                                                        className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                                                                    >
                                                                        <FaCheck className="mr-1" />
                                                                        Save
                                                                    </button>
                                                                    <button 
                                                                        onClick={cancelEdit}
                                                                        className="inline-flex items-center px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                                                                    >
                                                                        <FaTimes className="mr-1" />
                                                                        Cancel
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button 
                                                                        onClick={() => toggleEdit(user._id, user.username, user.email)}
                                                                        className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                                                                    >
                                                                        <FaEdit className="mr-1" />
                                                                        Edit
                                                                    </button>
                                                                    {!user.isAdmin && (
                                                                        <button 
                                                                            onClick={() => deleteHandler(user._id)}
                                                                            className="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                                                                        >
                                                                            <FaTrash className="mr-1" />
                                                                            Delete
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Empty State */}
                                {(!users || users.length === 0) && (
                                    <div className="text-center py-12">
                                        <FaUser className="mx-auto text-4xl text-gray-500 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-400 mb-2">No users found</h3>
                                        <p className="text-gray-500">There are no registered users in the system.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 

export default UserList;