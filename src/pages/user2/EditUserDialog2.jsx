import { X } from "lucide-react";
import { useState } from "react";
import init from "../../init";
import UserDialog from "./UserDialog";

const userUrl = `/${init.appName}/api/users/`;
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

const EditUserDialog2 = ({ user, roles, setUsers, setShowDialog, loading, setLoading, showNotification }) => {

     const handleUpdateUser = async (data) => {
        setLoading(true);
        try {
            const response = await fetch(`${userUrl}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    ...data,
                    roleId: parseInt(data.roleId)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user');
            }

            const updatedUser = await response.json();
            setUsers(prev =>
                prev.map(user =>
                    user.id === data.id ? updatedUser : user
                )
            );
            setShowDialog(false);
            showNotification('User updated successfully', 'success');
        } catch (error) {
            console.error('Error updating user:', error);
            showNotification(error.message || 'Failed to update user', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
               
                {/* Dialog Body */}
                <UserDialog title='Edit User' endtitle='Update User' roles={roles} formData={user} loading={loading} handleAddOrUpdate={handleUpdateUser} setShowDialog={setShowDialog} />
            </div>
        </div>
    )
}
export default EditUserDialog2;