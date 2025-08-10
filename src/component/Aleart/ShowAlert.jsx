import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShowAlert = (message, type, onCloseCallback) => {
    if (!['success', 'error', 'info', 'warn'].includes(type)) {
        console.error(`Invalid toast type: ${type}`);
        return;
    }

    const toastOptions = {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
    };

    // Add onClose callback only for success messages if provided
    if (type === 'success' && onCloseCallback) {
        toastOptions.onClose = onCloseCallback;
    }

    toast[type](message, toastOptions);
};

export default ShowAlert;