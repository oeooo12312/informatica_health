import SideBar from "../../../components/SideBar/SideBar";
import { Outlet } from "react-router-dom";
import "./MainLayout.css";

function MainLayout({userType}) {

    return(
        <div className="main-layout">
            <SideBar userType={userType}></SideBar>
            <Outlet></Outlet>
        </div>
    )
}

export default MainLayout;



