import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SaledCars from "../../UI/client/dashboard/SaledCars";
import WrappedHeader from "../../WrappedHeader";
import WrappedFooter from "../../WrappedFooter";

const LikedCars = () => {
    const [cars, setCars] = useState([]);
    const jwtStr = localStorage.getItem('jwtToken');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isLiked = searchParams.get('isLiked');

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
    }, [isLiked, jwtStr]);

    return (
        <div className="body">
            <WrappedHeader />
            <div className="dashboard mt-5">
                <SaledCars cars={cars} />
            </div>
            <WrappedFooter />
        </div>
    );
};

export default LikedCars;
