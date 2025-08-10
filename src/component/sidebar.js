import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { menuItems } from "../data/sidebarData";


export default function Sidebar({ isOpen, closeSidebar }) {
    const [userRole, setUserRole] = useState(null);
    const [filteredMenuItems, setFilteredMenuItems] = useState([]);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("userInfo");
        const userInfo = JSON.parse(storedUser);
        if (userInfo) {
            setUserRole(userInfo.role);
        }
    }, []);

    useEffect(() => {
        if (userRole) {
            const filtered = menuItems.filter((item) =>
                item.roles.includes(userRole)
            );
            setFilteredMenuItems(filtered);
        }
    }, [userRole]);

    return (
        <aside
            className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-[#250f4f] border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700
        ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
            aria-label="Sidebar"
        >
            <div className="h-full px-3 pb-4 overflow-y-auto bg-[#250f4f] dark:bg-gray-800">
                <ul className="space-y-2 font-medium">
                    {filteredMenuItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                to={item.path}
                                onClick={closeSidebar} // auto close on mobile after click
                                className="flex items-center p-2 text-gray-200 rounded-lg hover:text-gray-50 hover:bg-[#432b73] group"
                            >
                                {item.icon}
                                <span className="ms-3">{item.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}