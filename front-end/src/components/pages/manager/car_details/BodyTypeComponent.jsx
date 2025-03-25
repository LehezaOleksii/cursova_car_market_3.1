import React, { useState, useEffect } from "react";
import "./CarDetails.css";

const BodyTypeComponent = () => {
    const [bodyTypes, setBodyTypes] = useState([]);
    const [editingBodyTypes, setEditingBodyTypes] = useState(null);
    const [editedBodyTypes, setEditedBodyTypes] = useState("");
    const [newBodyTypeName, setNewBodyTypeName] = useState("");
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const jwtStr = localStorage.getItem("jwtToken");

    useEffect(() => {
        const fetchBodyTypes = async () => {
            try {
                const response = await fetch("/vehicles/body-types/dtos", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + jwtStr,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setBodyTypes(data);
                } else {
                    console.error("Failed to fetch body types");
                }
            } catch (error) {
                console.error("Error fetching body types:", error);
            }
        };

        fetchBodyTypes();
    }, [jwtStr]);

    const handleEditBodyType = (bodyTypes) => {
        if (editingBodyTypes === bodyTypes.id) {
            setEditingBodyTypes(null);
        } else {
            setEditingBodyTypes(bodyTypes.id);
            setEditedBodyTypes(bodyTypes.name);
        }
    };

    const handleSaveBodyType = async () => {
        try {
            const bodyTypeToUpdate = {
                id: editingBodyTypes,
                name: editedBodyTypes,
            };

            const response = await fetch(
                `/vehicles/body-types`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + jwtStr,
                    },
                    body: JSON.stringify(bodyTypeToUpdate),
                }
            );

            if (response.ok) {
                const updatedBodyTypes = bodyTypes.map((bodyTypes) =>
                    bodyTypes.id === editingBodyTypes ? { ...bodyTypes, name: editedBodyTypes } : bodyTypes
                );
                setBodyTypes(updatedBodyTypes);
                setEditingBodyTypes(null);
            } else {
                console.error("Failed to update body types");
            }
        } catch (error) {
            console.error("Error updating body types:", error);
        }
    };

    const handleDeleteBodyTypes = async (brand) => {
        try {
            const response = await fetch(
                `/vehicles/body-types/${brand.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + jwtStr,
                    },
                }
            );
            if (response.ok) {
                const filteredBrands = bodyTypes.filter((b) => b.id !== brand.id);
                setBodyTypes(filteredBrands);
            } else {
                console.error("Failed to delete brand");
            }
        } catch (error) {
            console.error("Error deleting brand:", error);
        }
    };

    const handleCreateBrand = async () => {
        if (!newBodyTypeName) return;

        const newBrand = {
            name: newBodyTypeName,
        };
        try {
            const response = await fetch("/vehicles/body-types", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + jwtStr,
                },
                body: JSON.stringify(newBrand),
            });

            if (response.ok) {
                const createdBrand = await response.json();
                setBodyTypes([...bodyTypes, createdBrand]);
                setNewBodyTypeName("");
                setShowCreateMenu(false);
            } else {
                console.error("Failed to create body-type");
            }
        } catch (error) {
            console.error("Error creating body-type:", error);
        }
    };

    return (
        <div className="car-details-list mt-4 bg-light br24 box-shadow-12 card">
            <h3>Body types</h3>
            <button
                className="car-details-button mb-3 br24 box-shadow-12"
                onClick={() => setShowCreateMenu(!showCreateMenu)}
            >
                {showCreateMenu ? "Hide Create body type menu" : "Show Create body type menu"}
            </button>
            {showCreateMenu && (
                <div className="create-brand-section">
                    <input
                        type="text"
                        placeholder="New body type name"
                        value={newBodyTypeName}
                        onChange={(e) => setNewBodyTypeName(e.target.value)}
                    />
                    <button className="car-details-button mt-3 mb-3 br24 box-shadow-12" onClick={handleCreateBrand}>
                        Create Body type
                    </button>
                </div>
            )}
            <ul className="car-details-elements">
                {bodyTypes.map((brand) => (
                    <li key={brand.id} className={editingBodyTypes === brand.id ? 'editing' : ''}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="car-details-name">{brand.name}</span>
                            <div className="d-flex ml-auto">
                                <button
                                    className="car-details-button br24 box-shadow-12" style={{ width: "75px", marginRight: "15px" }}
                                    onClick={() => handleEditBodyType(brand)}
                                >
                                    {editingBodyTypes === brand.id ? "Cancel" : "Edit"}
                                </button>
                                <button
                                    className="delete-button car-details-button br24 box-shadow-12" style={{ width: "75px" }}
                                    onClick={() => handleDeleteBodyTypes(brand)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className={`edit-input-container ${editingBodyTypes === brand.id ? 'active' : ''}`}>
                            <label><strong>Body type name</strong></label>
                            <input
                                type="text"
                                value={editedBodyTypes}
                                onChange={(e) => setEditedBodyTypes(e.target.value)}
                            />
                            <button className="car-details-button mt-2 br24 box-shadow-12" onClick={handleSaveBodyType} style={{ width: "75px" }}>
                                Save
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BodyTypeComponent;
