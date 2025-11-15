import { useState } from "react";
import init from "../../init";
import UserDialog from "./UserDialog";

const createUserUrl = `/${init.appName}/api/users/`;
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

const AddPatientDialog = ({ roles, setUsers, setShowDialog, loading, setLoading, showNotification }) => {
    const [formData, setFormData] = useState({
        username: '',
        displayName: '',
        email: '',
        roleId: 1,
        isActive: true
    });

    // Handle add user
    const handleAddUser = async (userData) => {
        // if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch(createUserUrl, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({
                    ...userData,
                    roleId: parseInt(userData.roleId)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create user');
            }

            const newUser = await response.json();
            setUsers(prev => [newUser, ...prev]);
            setShowDialog(false);
            showNotification('User created successfully', 'success');
        } catch (error) {
            console.error('Error adding user:', error);
            showNotification(error.message || 'Failed to create user', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
               
                {/* Dialog Body */}
                <UserDialog title='Add New User' endtitle='Add User' roles={roles} formData={formData} loading={loading} handleAddOrUpdate={handleAddUser} setShowDialog={setShowDialog} />
            </div>
        </div>
    )
}
export default AddPatientDialog;