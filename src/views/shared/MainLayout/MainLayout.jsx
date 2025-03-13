import SideBar from "../../../components/SideBar/SideBar";
import { Outlet } from "react-router-dom";
import "./MainLayout.css";
import { useContext } from "react";
import { UserProvider } from "../../../context/UserContext";

function MainLayout({userType}) {

    return(
        <UserProvider>
            <div className="main-layout">
                <SideBar userType={userType}></SideBar>
                <Outlet></Outlet>
            </div>
        </UserProvider>
    )
}

export default MainLayout;



