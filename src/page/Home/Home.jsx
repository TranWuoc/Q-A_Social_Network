import React from "react";
import "../../App.css"
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar"
import HomeMainbar from "../../components/HomeMainbar/HomeMainbar"

const Home= ()=>{

    return (
        <div className="home-container-1">
           <LeftSidebar />
           <div className="home-container-2">
                <HomeMainbar />
           </div>
        </div>
    )
}

export default Home;
