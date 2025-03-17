import React, { useState, useEffect } from "react";
import "./CarDetails.css";

const EngineComponent = () => {
    const [engines, setEngines] = useState([]);
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const [newEngine, setNewEngine] = useState({
        name: "",
        modelNames: [],
        volume: 0,
        horsepower: 0,
    });
    const [editingEngine, setEditingEngine] = useState(null);
    const [editedEngine, setEditedEngine] = useState({
        name: "",
        modelNames: [],
        volume: 0,
        horsepower: 0,
    });
    const jwtStr = localStorage.getItem("jwtToken");

    useEffect(() => {
        const fetchEngines = async () => {
            try {
                const response = await fetch("http://auto-market-backend:8080/vehicles/engines/dtos", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + jwtStr,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setEngines(data);
                } else {
                    console.error("Failed to fetch engines");
                }
            } catch (error) {
                console.error("Error fetching engines:", error);
            }
        };

        fetchEngines();
    }, [jwtStr]);

    const handleCreateEngine = async () => {
        try {
            const response = await fetch("http://auto-market-backend:8080/vehicles/engines", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + jwtStr,
                },
                body: JSON.stringify(newEngine),
            });

            if (response.ok) {
                const createdEngine = await response.json();
                setEngines((prev) => [...prev, createdEngine]);
                setNewEngine({ name: "", modelNames: [], volume: 0, horsepower: 0 });
                setShowCreateMenu(false);
            } else {
                console.error("Failed to create engine");
            }
        } catch (error) {
            console.error("Error creating engine:", error);
        }
    };

    const handleEditEngine = (engine) => {
        if (editingEngine === engine.id) {
            setEditingEngine(null);
        } else {
            setEditingEngine(engine.id);
            setEditedEngine({ ...engine });
        }
    };

    const handleInputChange = (field, value) => {
        setEditedEngine((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveEngine = async () => {
        try {
            const response = await fetch(`http://auto-market-backend:8080/vehicles/engines`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + jwtStr,
                },
                body: JSON.stringify(editedEngine),
            });

            if (response.ok) {
                const updatedEngines = engines.map((engine) =>
                    engine.id === editingEngine ? { ...editedEngine } : engine
                );
                setEngines(updatedEngines);
                setEditingEngine(null);
            } else {
                console.error("Failed to update engine");
            }
        } catch (error) {
            console.error("Error updating engine:", error);
        }
    };

    const handleDeleteEngine = async (engine) => {
        try {
            const response = await fetch(
                `http://auto-market-backend:8080/vehicles/engines/${engine.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + jwtStr,
                    },
                    body: JSON.stringify(engine.modelNames),
                }
            );
            if (response.ok) {
                const filteredEngines = engines.filter((e) => e.id !== engine.id);
                setEngines(filteredEngines);
            } else {
                console.error("Failed to delete engine");
            }
        } catch (error) {
            console.error("Error deleting engine:", error);
        }
    };

    return (
        <div className="car-details-list mt-4 bg-light br24 box-shadow-12 card">
            <h3>Engines</h3>
            <button
                className="car-details-button mb-3 br24 box-shadow-12"
                onClick={() => setShowCreateMenu(!showCreateMenu)}
            >
                {showCreateMenu ? "Hide Create Engine Menu" : "Show Create Engine Menu"}
            </button>
            {showCreateMenu && (
                <div className="create-engine-section">
                    <label><strong>Engine Name</strong></label>
                    <input
                        type="text"
                        placeholder="Engine Name"
                        value={newEngine.name}
                        onChange={(e) => setNewEngine((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    <label><strong>Volume (L)</strong></label>
                    <input
                        type="number"
                        placeholder="Volume"
                        value={newEngine.volume}
                        onChange={(e) => setNewEngine((prev) => ({ ...prev, volume: +e.target.value }))}
                    />
                    <label><strong>Horsepower (HP)</strong></label>
                    <input
                        type="number"
                        placeholder="Horsepower"
                        value={newEngine.horsepower}
                        onChange={(e) => setNewEngine((prev) => ({ ...prev, horsepower: +e.target.value }))}
                    />
                    <button className="car-details-button mt-3 mb-3 br24 box-shadow-12" onClick={handleCreateEngine}>
                        Create Engine
                    </button>
                </div>
            )}
            <ul className="car-details-elements">
                <h5>Engines</h5>
                {engines.map((engine) => (
                    <li key={engine.id} className={editingEngine === engine.id ? "editing" : ""}>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="car-details-name">
                                <h6>{engine.name} ({engine.volume}L, {engine.horsepower} HP)</h6>
                            </span>
                            <div className="d-flex ml-auto">
                                <button
                                    className="car-details-button br24 box-shadow-12" style={{ width: "75px", marginRight: "15px" }}
                                    onClick={() => handleEditEngine(engine)}
                                >
                                    {editingEngine === engine.id ? "Cancel" : "Edit"}
                                </button>
                                <button
                                    className="delete-button car-details-button br24 box-shadow-12" style={{ width: "75px" }}
                                    onClick={() => handleDeleteEngine(engine)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <ul className="car-details-elements">
                            <strong>Models:</strong>
                            {engine.modelNames.length > 0 ? (
                                engine.modelNames.map((modelName, index) => (
                                    <li key={index} className="model-name">
                                        {modelName}
                                    </li>
                                ))
                            ) : (
                                <li>No models available</li>
                            )}
                        </ul>

                        {editingEngine === engine.id && (
                            <div className="edit-input-container active">
                                <label><strong>Engine Name</strong></label>
                                <input
                                    type="text"
                                    value={editedEngine.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    className="form-control"
                                />
                                <label><strong>Volume (L)</strong></label>
                                <input
                                    type="number"
                                    value={editedEngine.volume}
                                    onChange={(e) => handleInputChange("volume", e.target.value)}
                                    className="form-control"
                                />
                                <label><strong>Horsepower (HP)</strong></label>
                                <input
                                    type="number"
                                    value={editedEngine.horsepower}
                                    onChange={(e) => handleInputChange("horsepower", e.target.value)}
                                    className="form-control"
                                />
                                <button className="car-details-button mt-3 br24 box-shadow-12" onClick={handleSaveEngine} style={{ width: "75px" }}>
                                    Save
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EngineComponent;
