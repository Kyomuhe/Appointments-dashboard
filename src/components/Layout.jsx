import Header from "./Header"
import Sidebar from "./Sidemenu"
import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <div className="flex h-screen bg-[#0F1620]">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Layout