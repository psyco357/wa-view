"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "@/components/context/SidebarWidget";
// import { FaFile } from "react-icons/fa6";
import {
    FaHome,
    FaCalendarAlt,
    FaUserCircle,
    FaList,
    FaTable,
    FaRegFileAlt,
    FaChartPie,
    FaCube,
    FaPlug,
    FaChevronDown,
    FaEllipsisH
} from "react-icons/fa";
import { PiChatsCircleBold } from "react-icons/pi";
import { TbDatabaseImport } from "react-icons/tb";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
    {
        icon: <FaHome className="w-5 h-5" />,
        name: "Dashboard",
        path: "/dashboard",
    },
    {
        icon: <FaList className="w-5 h-5" />,
        name: "Daftar Kendaraan",
        path: "/daftar-kendaraan",
    },
    {
        icon: <TbDatabaseImport className="w-5 h-5" />,
        name: "Import Kendaraan",
        path: "/import-kendaraan",
    },
    {
        icon: <PiChatsCircleBold className="w-5 h-5" />,
        name: "Chat",
        path: "/chat",
    },


];

const othersItems: NavItem[] = [
    {
        icon: <FaRegFileAlt className="w-5 h-5" />,
        name: "Reports",
        path: "/reports",
    },

];

// Horizontal dots component
const HorizontaLDots = () => {
    return (
        <div className="flex gap-1">
            <FaEllipsisH className="w-4 h-4 text-gray-400" />
        </div>
    );
};

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const pathname = usePathname();

    const renderMenuItems = (
        navItems: NavItem[],
        menuType: "main" | "others"
    ) => (
        <ul className="flex flex-col gap-4">
            {navItems.map((nav, index) => (
                <li key={nav.name}>
                    {nav.subItems ? (
                        <button
                            onClick={() => handleSubmenuToggle(index, menuType)}
                            className={`menu-item group  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                                ? "menu-item-active"
                                : "menu-item-inactive"
                                } cursor-pointer ${!isExpanded && !isHovered
                                    ? "lg:justify-center"
                                    : "lg:justify-start"
                                }`}
                        >
                            <span
                                className={` ${openSubmenu?.type === menuType && openSubmenu?.index === index
                                    ? "menu-item-icon-active"
                                    : "menu-item-icon-inactive"
                                    }`}
                            >
                                {nav.icon}
                            </span>
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <span className={`menu-item-text`}>{nav.name}</span>
                            )}
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <FaChevronDown
                                    className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
                                        openSubmenu?.index === index
                                        ? "rotate-180 text-brand-500"
                                        : ""
                                        }`}
                                />
                            )}
                        </button>
                    ) : (
                        nav.path && (
                            <Link
                                href={nav.path}
                                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                                    }`}
                            >
                                <span
                                    className={`${isActive(nav.path)
                                        ? "menu-item-icon-active"
                                        : "menu-item-icon-inactive"
                                        }`}
                                >
                                    {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <span className={`menu-item-text`}>{nav.name}</span>
                                )}
                            </Link>
                        )
                    )}
                    {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                        <div
                            ref={(el) => {
                                subMenuRefs.current[`${menuType}-${index}`] = el;
                            }}
                            className="overflow-hidden transition-all duration-300"
                            style={{
                                height:
                                    openSubmenu?.type === menuType && openSubmenu?.index === index
                                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                                        : "0px",
                            }}
                        >
                            <ul className="mt-2 space-y-1 ml-9">
                                {nav.subItems.map((subItem) => (
                                    <li key={subItem.name}>
                                        <Link
                                            href={subItem.path}
                                            className={`menu-dropdown-item ${isActive(subItem.path)
                                                ? "menu-dropdown-item-active"
                                                : "menu-dropdown-item-inactive"
                                                }`}
                                        >
                                            {subItem.name}
                                            <span className="flex items-center gap-1 ml-auto">
                                                {subItem.new && (
                                                    <span
                                                        className={`ml-auto ${isActive(subItem.path)
                                                            ? "menu-dropdown-badge-active"
                                                            : "menu-dropdown-badge-inactive"
                                                            } menu-dropdown-badge `}
                                                    >
                                                        new
                                                    </span>
                                                )}
                                                {subItem.pro && (
                                                    <span
                                                        className={`ml-auto ${isActive(subItem.path)
                                                            ? "menu-dropdown-badge-active"
                                                            : "menu-dropdown-badge-inactive"
                                                            } menu-dropdown-badge `}
                                                    >
                                                        pro
                                                    </span>
                                                )}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );

    const [openSubmenu, setOpenSubmenu] = useState<{
        type: "main" | "others";
        index: number;
    } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
        {}
    );
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const isActive = useCallback((path: string) => path === pathname, [pathname]);

    useEffect(() => {
        // Check if the current path matches any submenu item
        let submenuMatched = false;
        ["main", "others"].forEach((menuType) => {
            const items = menuType === "main" ? navItems : othersItems;
            items.forEach((nav, index) => {
                if (nav.subItems) {
                    nav.subItems.forEach((subItem) => {
                        if (isActive(subItem.path)) {
                            setOpenSubmenu({
                                type: menuType as "main" | "others",
                                index,
                            });
                            submenuMatched = true;
                        }
                    });
                }
            });
        });

        // If no submenu item matches, close the open submenu
        if (!submenuMatched) {
            setOpenSubmenu(null);
        }
    }, [pathname, isActive]);

    useEffect(() => {
        // Set the height of the submenu items when the submenu is opened
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prevHeights) => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (
                prevOpenSubmenu &&
                prevOpenSubmenu.type === menuType &&
                prevOpenSubmenu.index === index
            ) {
                return null;
            }
            return { type: menuType, index };
        });
    };

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
                    ? "w-[290px]"
                    : isHovered
                        ? "w-[290px]"
                        : "w-[90px]"
                }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={` ${!isExpanded && !isHovered ? "justify-center py-4" : "hidden lg:flex lg:justify-start "
                    }`}
            >
                <Link href="/dashboard" className="flex items-center gap-2">
                    {isExpanded || isHovered || isMobileOpen ? (
                        <>
                            <Image
                                className="dark:hidden"
                                src="/images/ftf.jpg"
                                alt="Logo"
                                width={100}
                                height={40}
                            />
                            <Image
                                className="hidden dark:block"
                                src="/images/ftf-dark.jpg"
                                alt="Dark Logo"
                                width={100}
                                height={40}
                            />
                        </>
                    ) : (
                        <Image
                            src="/images/ftf.jpg"
                            alt="Kecil Logo"
                            width={32}
                            height={32}
                        />
                    )}
                </Link>
            </div>
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        <div className="mt-4">
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                                    ? "lg:justify-center"
                                    : "justify-start"
                                    }`}
                            >
                                {isExpanded || isHovered || isMobileOpen ? (
                                    "Menu"
                                ) : (
                                    <HorizontaLDots />
                                )}
                            </h2>
                            {renderMenuItems(navItems, "main")}
                        </div>

                        <div className="">
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                                    ? "lg:justify-center"
                                    : "justify-start"
                                    }`}
                            >
                                {isExpanded || isHovered || isMobileOpen ? (
                                    "Others"
                                ) : (
                                    <HorizontaLDots />
                                )}
                            </h2>
                            {renderMenuItems(othersItems, "others")}
                        </div>
                    </div>
                </nav>
                {isExpanded || isHovered || isMobileOpen ? '' : null}
            </div>
        </aside>
    );
};

export default AppSidebar;