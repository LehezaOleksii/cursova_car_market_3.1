import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import SaledCars from "../../UI/client/dashboard/SaledCars";
import Header from "../../UI/client/Header";
import Footer from "../../UI/client/Footer";

const LikedCars = () => {
    const [cars, setCars] = useState([]);
    const jwtStr = localStorage.getItem('jwtToken');

    // Extract query parameters from the URL
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isLiked = searchParams.get('isLiked'); // Get the isLiked parameter

    useEffect(() => {
        const fetchData = async () => {
            const url = `http://localhost:8080/vehicles/params?isLiked=${isLiked}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    credentials: 'include',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwtStr
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCars(data.content);
            } else {
                console.error("Failed to fetch cars:", response.status);
            }
        };
        fetchData();
    }, [isLiked, jwtStr]); // Add isLiked as a dependency

    return (
        <div className="body">
            <Header />
            <div className="dashboard mt-5">
                <SaledCars cars={cars} />
            </div>
            <Footer />
        </div>
    );
};

export default LikedCars;
