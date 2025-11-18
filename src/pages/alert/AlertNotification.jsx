import { AlertTriangle, CheckCircle } from "lucide-react";

const AlertNotification = ({notification}) => {
    return (
        <div
                        className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg text-white transition-all duration-300 ${notification.type === 'success'
                                ? 'bg-green-500'
                                : notification.type === 'error'
                                    ? 'bg-red-500'
                                    : 'bg-blue-500'
                            }`}
                    >
                        {notification.type === 'success' && <CheckCircle size={20} />}
                        {notification.type === 'error' && <AlertTriangle size={20} />}
                        <span className="font-medium">{notification.message}</span>
                    </div>
    )
};
export default AlertNotification;