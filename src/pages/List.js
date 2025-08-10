import React, { useCallback, useEffect, useMemo, useState } from "react";
import Table from "../component/VTable";
import { Link } from "react-router-dom";
import { Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers } from "../features/user/userSlice";
import ConfirmationModal from "../component/Aleart/ConfirmDialog";
import ShowAlert from "../component/Aleart/ShowAlert";
export default function List() {
    const dispatch = useDispatch();
    const { userList, loading, error } = useSelector((state) => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                await dispatch(getAllUsers()).unwrap();
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setInitialLoad(false);
            }
        };

        fetchUsers();

        // Cleanup function to reset initial load when component unmounts
        return () => {
            setInitialLoad(true);
        };
    }, [dispatch]);

    // Open confirmation modal
    const showDeleteConfirmation = useCallback((item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    }, []);

    // Handle actual deletion
    const handleConfirmDelete = useCallback(
        async (item) => {
            try {
                const response = await dispatch(deleteUser(item.key)).unwrap();
                console.log("Deleting item:", response.message);
                setIsModalOpen(false);
                ShowAlert(`${response.message}`, "success");
                // Refresh the user list after deletion
                dispatch(getAllUsers());
            } catch (err) {
                setIsModalOpen(false);
                ShowAlert(`Error: ${err}`, "error");
            }
        },
        [dispatch]
    );

    // Render delete action
    const renderDeleteAction = useCallback(
        (item) => (
            <div className="flex gap-1 text-center justify-center">
                <Link to="#">
                    <Trash2
                        onClick={() => showDeleteConfirmation(item)}
                        color="#ff0000"
                        size={16}
                    />
                </Link>
            </div>
        ),
        [showDeleteConfirmation]
    );

    // Memoized columns
    const columns = useMemo(
        () => [
            { title: "SrNo", dataIndex: "srno", key: "srno" },
            { title: "Name", dataIndex: "name", key: "name" },
            { title: "Email", dataIndex: "email", key: "email" },
            { title: "Phone No", dataIndex: "phoneno", key: "phoneno" },
            { title: "Gender", dataIndex: "gender", key: "gender" },
            {
                title: "Action",
                render: renderDeleteAction,
                key: "action",
                width: 90,
            },
        ],
        [renderDeleteAction]
    );

    // Memoized table data
    const tableData = useMemo(
        () =>
            (userList?.data || []).map((user, index) => ({
                key: user.id,
                srno: index + 1,
                name: user.name,
                email: user.email || "",
                phoneno: user.phoneNumber,
                gender: user.gender,
            })),
        [userList]
    );

    // Loading and error states
    if (initialLoad || loading.userList) {
        return <div className="text-center p-8">Loading users...</div>;
    }

    if (error.userList) {
        return <div className="text-red-500 p-8">Error: {error.userList}</div>;
    }

    return (
        <>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                item={selectedItem}
            />

            <div className="bg-white p-4 mb-2 rounded-lg dark:border-gray-700 mt-14">
                <div>
                    <h3 className="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white text-left dark:hover:text-white text-[1.125rem] font-semibold">
                        List
                    </h3>
                </div>
            </div>

            <div className="bg-white">
                <div className="p-4 rounded-lg dark:border-gray-700">
                    <div className="flex justify-end mb-3 p-2">
                        <Link
                            to="/Stepperform"
                            className="rounded-lg px-4 py-2 bg-green-700 text-green-100 hover:bg-green-800 duration-300"
                        >
                            Add
                        </Link>
                    </div>
                    <Table cols={columns} data={tableData} />
                </div>
            </div>
        </>
    );
}