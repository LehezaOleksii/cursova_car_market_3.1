import React, { useState, useEffect } from "react";
import "./CarDetails.css";

const EngineComponent = () => {
    const [brands, setBrands] = useState([]);
    const [editingBrand, setEditingBrand] = useState(null);
    const [editedBrandName, setEditedBrandName] = useState("");
    const jwtStr = localStorage.getItem("jwtToken");

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await fetch("http://localhost:8080/vehicles/brands/dtos", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + jwtStr,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setBrands(data);
                } else {
                    console.error("Failed to fetch brands");
                }
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        };

        fetchBrands();
    }, [jwtStr]);

    const handleEditBrand = (brand) => {
        if (editingBrand === brand.id) {
            setEditingBrand(null);
        } else {
            setEditingBrand(brand.id);
            setEditedBrandName(brand.name);
        }
    };

    const handleSaveBrand = async () => {
        try {
            const brandToUpdate = {
                id: editingBrand,
                name: editedBrandName,
            };

            const response = await fetch(
                `http://localhost:8080/vehicles/brands`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + jwtStr,
                    },
                    body: JSON.stringify(brandToUpdate),
                }
            );

            if (response.ok) {
                const updatedBrands = brands.map((brand) =>
                    brand.id === editingBrand ? { ...brand, name: editedBrandName } : brand
                );
                setBrands(updatedBrands);
                setEditingBrand(null);
            } else {
                console.error("Failed to update brand");
            }
        } catch (error) {
            console.error("Error updating brand:", error);
        }
    };

    const handleDeleteBrand = async (brand) => {
        try {
            const response = await fetch(
                `http://localhost:8080/vehicles/brands/${brand.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + jwtStr,
                    },
                }
            );

            if (response.ok) {
                const filteredBrands = brands.filter((b) => b.id !== brand.id);
                setBrands(filteredBrands);
            } else {
                console.error("Failed to delete brand");
            }
        } catch (error) {
            console.error("Error deleting brand:", error);
        }
    };

    return (
        <div className="car-details-container mt-4 bg-light">
            <h3>Available Brands</h3>
            <ul className="car-details-list">
                {brands.map((brand) => (
                    <li key={brand.id} className={editingBrand === brand.id ? 'editing' : ''}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="car-details-name">{brand.name}</span>
                            <div className="d-flex ml-auto">
                                <button
                                    className="car-details-button"
                                    onClick={() => handleEditBrand(brand)}
                                >
                                    {editingBrand === brand.id ? "Cancel" : "Edit"}
                                </button>
                                <button
                                    className="delete-button car-details-button"
                                    onClick={() => handleDeleteBrand(brand)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className={`edit-input-container ${editingBrand === brand.id ? 'active' : ''}`}>
                            <label><strong>Brand name</strong></label>
                            <input
                                type="text"
                                value={editedBrandName}
                                onChange={(e) => setEditedBrandName(e.target.value)}
                            />
                            <button className="car-details-button mt-2" onClick={handleSaveBrand}>
                                Save
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EngineComponent;
