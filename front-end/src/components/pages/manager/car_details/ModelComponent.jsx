import React, { useState, useEffect } from "react";
import "./CarDetails.css";

const ModelComponent = () => {
    const [models, setModels] = useState([]);
    const [editingModel, setEditingModel] = useState(null);
    const [editedModel, setEditedModel] = useState({
        modelName: "",
        firstProductionYear: "",
        lastProductionYear: "",
        bodyTypeName: "",
        engines: [],
        vehicleBrandName: "",
    });
    const [showCreateModelMenu, setShowCreateModelMenu] = useState(false);
    const [availableEngines, setAvailableEngines] = useState([]);
    const [selectedEngineId, setSelectedEngineId] = useState(null);
    const [showAddEngineDropdown, setShowAddEngineDropdown] = useState(false);
    const [filterBrand, setFilterBrand] = useState("");
    const [errors, setErrors] = useState({});
    const jwtStr = localStorage.getItem("jwtToken");
    const [bodyTypes, setBodyTypes] = useState([]);
    const [brands, setBrands] = useState([]);

    const [newModel, setNewModel] = useState({
        modelName: "",
        firstProductionYear: "",
        lastProductionYear: "",
        bodyTypeName: "",
        engines: [],
        vehicleBrandName: "",
    });

    useEffect(() => {
        const fetchBodyTypes = async () => {
            try {
                const response = await fetch("http://localhost:8080/vehicles/body-types", {
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

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await fetch("http://localhost:8080/vehicles/brands", {
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
                    console.error("Failed to fetch body types");
                }
            } catch (error) {
                console.error("Error fetching body types:", error);
            }
        };

        fetchBrands();
    }, [jwtStr]);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await fetch("http://localhost:8080/vehicles/models/dtos", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + jwtStr,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setModels(data);
                } else {
                    console.error("Failed to fetch models");
                }
            } catch (error) {
                console.error("Error fetching models:", error);
            }
        };

        fetchModels();
    }, [jwtStr]);

    const validate = (model) => {
        const errors = {};

        if (!model.modelName || model.modelName.trim() === "") {
            errors.modelName = "Model name is required.";
        }
        if (!model.firstProductionYear) {
            errors.firstProductionYear = "First production year is required.";
        } else if (model.firstProductionYear > model.lastProductionYear) {
            errors.firstProductionYear = "First production year must be less than last production year.";
        }
        else if (model.firstProductionYear < 0) {
            errors.firstProductionYear = "First production year must be pozitive";
        }
        if (!model.lastProductionYear) {
            errors.lastProductionYear = "Last production year is required.";
        } else if (model.lastProductionYear > new Date().getFullYear()) {
            errors.lastProductionYear = "Last production year must not exceed the current year.";
        } else if (model.lastProductionYear < model.firstProductionYear) {
            errors.lastProductionYear = "Last production must be greather or equal to first production year";
        }
        else if (model.lastProductionYear < 0) {
            errors.firstProductionYear = "Last production year must be pozitive";
        }
        if (!model.bodyTypeName || model.bodyTypeName.trim() === "") {
            errors.bodyTypeName = "Body type is required.";
        }
        if (!model.vehicleBrandName || model.vehicleBrandName.trim() === "") {
            errors.vehicleBrandName = "Brand is required.";
        }

        return errors;
    };

    const groupedModels = models.reduce((groups, model) => {
        const brand = model.vehicleBrandName;
        if (!groups[brand]) groups[brand] = [];
        groups[brand].push(model);
        return groups;
    }, {});

    const filteredGroupedModels = Object.keys(groupedModels)
        .filter((brand) => filterBrand === "" || brand.toLowerCase().includes(filterBrand.toLowerCase()))
        .reduce((result, brand) => {
            result[brand] = groupedModels[brand];
            return result;
        }, {});

    const handleEditModel = (model) => {
        if (editingModel === model.id) {
            setEditingModel(null);
            setErrors({});
        } else {
            setEditingModel(model.id);
            setEditedModel({
                modelName: model.modelName,
                firstProductionYear: model.firstProductionYear,
                lastProductionYear: model.lastProductionYear,
                bodyTypeName: model.bodyTypeName,
                engines: model.engines,
                vehicleBrandName: model.vehicleBrandName,
            });
            setErrors(validate(model));
        }
    };

    const handleSaveModel = async () => {
        const validationErrors = validate(editedModel);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const modelToUpdate = {
                id: editingModel,
                modelName: editedModel.modelName,
                firstProductionYear: editedModel.firstProductionYear,
                lastProductionYear: editedModel.lastProductionYear,
                bodyTypeName: editedModel.bodyTypeName,
                engines: editedModel.engines,
                vehicleBrandName: editedModel.vehicleBrandName,
            };

            const response = await fetch(
                `http://localhost:8080/vehicles/models`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + jwtStr,
                    },
                    body: JSON.stringify(modelToUpdate),
                }
            );

            if (response.ok) {
                const updatedModels = models.map((model) =>
                    model.id === editingModel ? { ...model, ...editedModel } : model
                );
                setModels(updatedModels);
                setEditingModel(null);
                setErrors({});
            } else {
                console.error("Failed to update model");
            }
        } catch (error) {
            console.error("Error updating model:", error);
        }
    };

    const handleInputChange = (field, value) => {
        setEditedModel((prevModel) => {
            const updatedModel = { ...prevModel, [field]: value };
            setErrors(validate(updatedModel));
            return updatedModel;
        });
    };

    const handleDeleteModel = async (model) => {
        try {
            const response = await fetch(
                `http://localhost:8080/vehicles/models/${model.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + jwtStr,
                    },
                }
            );

            if (response.status === 204) {
                const filteredModels = models.filter((m) => m.id !== model.id);
                setModels(filteredModels);
            } else {
                console.error("Failed to delete model");
            }
        } catch (error) {
            console.error("Error deleting model:", error);
        }
    };

    const handleDeleteEngine = async (engineId, modelId) => {
        try {
            const response = await fetch(`http://localhost:8080/vehicles/models/${modelId}/engines/${engineId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + jwtStr,
                },
            });
            if (response.status === 204) {
                const updatedModels = models.map((model) =>
                    model.id === modelId
                        ? { ...model, engines: model.engines.filter((engine) => engine.id !== engineId) }
                        : model
                );
                setModels(updatedModels);
            } else {
                console.error("Failed to delete engine");
            }
        } catch (error) {
            console.error("Error deleting engine:", error);
        }
    };

    const handleAddEngine = async (modelId) => {
        if (!selectedEngineId) return;

        try {
            const response = await fetch(`http://localhost:8080/vehicles/models/${modelId}/engines`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + jwtStr,
                },
                body: JSON.stringify(selectedEngineId),
            });

            if (response.ok) {
                const updatedResponse = await fetch(`http://localhost:8080/vehicles/engines`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + jwtStr,
                    },
                });

                if (updatedResponse.ok) {
                    const updatedEngines = await updatedResponse.json();
                    const addedEngine = updatedEngines.find((engine) => engine.id === selectedEngineId);
                    const updatedModels = models.map((model) =>
                        model.id === modelId
                            ? { ...model, engines: [...model.engines, addedEngine] }
                            : model
                    );

                    setModels(updatedModels);
                    console.log("Engine added and data updated successfully");
                } else {
                    console.error("Failed to fetch updated engine data");
                }

                setSelectedEngineId(null);
            } else {
                console.error("Failed to add engine");
            }
        } catch (error) {
            console.error("Error adding engine:", error);
        }
    };

    const handleShowAddEngine = async () => {
        setShowAddEngineDropdown((prev) => !prev);
        try {
            const response = await fetch(`http://localhost:8080/vehicles/engines`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtStr}`,
                },
            });
            if (response.ok) {
                const engines = await response.json();
                setAvailableEngines(engines);
            }
        } catch (error) {
            console.error("Error fetching engines:", error);
        }
    };

    const validateNewModel = (model) => {
        const errors = {};

        if (!model.modelName || model.modelName.trim() === "") {
            errors.modelName = "Model name is required.";
        }
        if (!model.firstProductionYear) {
            errors.firstProductionYear = "First production year is required.";
        } else if (model.firstProductionYear > model.lastProductionYear) {
            errors.firstProductionYear = "First production year must be less than last production year.";
        }
        if (!model.lastProductionYear) {
            errors.lastProductionYear = "Last production year is required.";
        } else if (model.lastProductionYear > new Date().getFullYear()) {
            errors.lastProductionYear = "Last production year must not exceed the current year.";
        }
        if (!model.bodyTypeName || model.bodyTypeName.trim() === "") {
            errors.bodyTypeName = "Body type is required.";
        }
        if (!model.vehicleBrandName || model.vehicleBrandName.trim() === "") {
            errors.vehicleBrandName = "Brand is required.";
        }

        return errors;
    };

    const handleCreateModel = async () => {
        const validationErrors = validateNewModel(newModel);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/vehicles/models", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + jwtStr,
                },
                body: JSON.stringify(newModel),
            });

            if (response.ok) {
                const createdModel = await response.json();
                setModels((prevModels) => [...prevModels, createdModel]);
                setNewModel({
                    modelName: "",
                    firstProductionYear: "",
                    lastProductionYear: "",
                    bodyTypeName: "",
                    vehicleBrandName: "",
                });
                setShowCreateModelMenu(false);
            } else {
                console.error("Failed to create model");
            }
        } catch (error) {
            console.error("Error creating model:", error);
        }
    };

    const handleNewInputChange = (field, value) => {
        setNewModel((prevModel) => ({ ...prevModel, [field]: value }));
    };

    return (
        <div className="car-details-list mt-4 bg-light">
            <h3>Available Models</h3>
            <button
                className="car-details-button mb-3"
                onClick={() => setShowCreateModelMenu((prev) => !prev)}
            >
                {showCreateModelMenu ? "Hide Create Model Menu" : "Show Create Model Menu"}
            </button>
            {showCreateModelMenu && (
                <div className="create-model-menu">
                    <h4>Create New Model</h4>
                    <label><strong>Model Name</strong></label>
                    <input
                        className="form-control"
                        type="text"
                        value={newModel.modelName}
                        onChange={(e) =>
                            setNewModel({ ...newModel, modelName: e.target.value })
                        }
                    />
                    {errors.modelName && <p className="text-danger">{errors.modelName}</p>}

                    <label><strong>First Production Year</strong></label>
                    <input
                        className="form-control"
                        type="number"
                        value={newModel.firstProductionYear}
                        onChange={(e) =>
                            setNewModel({ ...newModel, firstProductionYear: e.target.value })
                        }
                    />
                    {errors.firstProductionYear && (
                        <p className="text-danger">{errors.firstProductionYear}</p>
                    )}

                    <label><strong>Last Production Year</strong></label>
                    <input
                        className="form-control"
                        type="number"
                        value={newModel.lastProductionYear}
                        onChange={(e) =>
                            setNewModel({ ...newModel, lastProductionYear: e.target.value })
                        }
                    />
                    {errors.lastProductionYear && (
                        <p className="text-danger">{errors.lastProductionYear}</p>
                    )}

                    <label><strong>Body Type</strong></label>
                    <select
                        className="form-select"
                        value={newModel.bodyTypeName}
                        onChange={(e) =>
                            setNewModel({ ...newModel, bodyTypeName: e.target.value })
                        }
                    >
                        <option value="">Select a Body Type</option>
                        {bodyTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    {errors.bodyTypeName && (
                        <p className="text-danger">{errors.bodyTypeName}</p>
                    )}

                    <label><strong>Brand</strong></label>
                    <select
                        className="form-select"
                        value={newModel.vehicleBrandName}
                        onChange={(e) =>
                            setNewModel({ ...newModel, vehicleBrandName: e.target.value })
                        }
                    >
                        <option value="">Select a Brand</option>
                        {brands.map((brand) => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                    {errors.vehicleBrandName && (
                        <p className="text-danger">{errors.vehicleBrandName}</p>
                    )}

                    <button
                        className="car-details-button mt-3"
                        onClick={handleCreateModel}
                    >
                        Create Model
                    </button>
                </div>
            )}
            <div className="car-details-elements">
                <label><strong>Filter by Brand</strong></label>
                <input
                    type="text"
                    placeholder="Enter brand name"
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                />
            </div>
            <div>
                {Object.keys(filteredGroupedModels).map((brand) => (
                    <div key={brand}>
                        <h4>{brand}</h4>
                        <ul className="car-details-elements">
                            {filteredGroupedModels[brand].map((model) => (
                                <li key={model.id} className={editingModel === model.id ? 'editing' : ''}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="car-details-name">{model.modelName}</span>
                                        <div className="d-flex ml-auto">
                                            <button
                                                className="car-details-button"
                                                onClick={() => handleEditModel(model)}
                                            >
                                                {editingModel === model.id ? "Cancel" : "Edit"}
                                            </button>
                                            <button
                                                className="delete-button car-details-button"
                                                onClick={() => handleDeleteModel(model)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    {editingModel === model.id && (
                                        <div className="edit-input-container active">
                                            <label><strong>Model Name</strong></label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={editedModel.modelName}
                                                onChange={(e) => handleInputChange("modelName", e.target.value)}
                                            />
                                            {errors.modelName && <p className="text-danger">{errors.modelName}</p>}
                                            <label><strong>First production year</strong></label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                value={editedModel.firstProductionYear}
                                                onChange={(e) => handleInputChange("firstProductionYear", e.target.value)}
                                            />
                                            {errors.firstProductionYear && <p className="text-danger">{errors.firstProductionYear}</p>}
                                            <label><strong>Last production year</strong></label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                value={editedModel.lastProductionYear}
                                                onChange={(e) => handleInputChange("lastProductionYear", e.target.value)}
                                            />
                                            {errors.lastProductionYear && <p className="text-danger">{errors.lastProductionYear}</p>}
                                            <label><strong>Body type</strong></label>
                                            <select
                                                className="form-select mt-2"
                                                value={editedModel.bodyTypeName}
                                                onChange={(e) => handleInputChange("bodyTypeName", e.target.value)}
                                            >
                                                <option value="">Select a Body Type</option>
                                                {bodyTypes.map((type) => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.bodyTypeName && <p className="text-danger">{errors.bodyTypeName}</p>}
                                            <label className="mt-2 mb-"><strong>Vehicle brand</strong></label>
                                            <select
                                                className="form-select mt-2"
                                                value={editedModel.vehicleBrandName}
                                                onChange={(e) => handleInputChange("vehicleBrandName", e.target.value)}
                                            >
                                                <option value="">Select a Brand</option>
                                                {brands.map((type) => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.vehicleBrandName && <p className="text-danger">{errors.vehicleBrandName}</p>}
                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <h5>Engine Details:</h5>
                                            </div>
                                            <div className="engine-container">
                                                {model.engines.length > 0 ? (
                                                    model.engines.map((engine) => (
                                                        <div key={engine.id} className="card engine-card">
                                                            <div className="card-body">
                                                                <h6 className="card-title">{engine.name}</h6>
                                                                <p className="card-text">
                                                                    <strong>Volume:</strong> {engine.volume} L<br />
                                                                    <strong>Horsepower:</strong> {engine.horsepower} HP
                                                                </p>
                                                                <button
                                                                    className="delete-button car-details-button"
                                                                    onClick={() => handleDeleteEngine(engine.id, model.id)}
                                                                >
                                                                    Delete Engine
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-muted">No engines available for this model.</p>
                                                )}
                                            </div>
                                            <button className="car-details-button mt-2" onClick={handleSaveModel}>
                                                Save Model
                                            </button>
                                            <button
                                                className="car-details-button"
                                                onClick={handleShowAddEngine}
                                            >
                                                {showAddEngineDropdown ? "Cancel" : "Add Engine"}
                                            </button>
                                            {showAddEngineDropdown && (
                                                <div className="mt-3">
                                                    <select
                                                        className="form-select"
                                                        value={selectedEngineId || ""}
                                                        onChange={(e) => setSelectedEngineId(Number(e.target.value))}
                                                    >
                                                        <option value="" disabled>
                                                            Select an engine
                                                        </option>
                                                        {availableEngines.map((engine) => (
                                                            <option key={engine.id} value={engine.id}>
                                                                {engine.name} - {engine.volume}L - {engine.horsepower} HP
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        className="car-details-button"
                                                        onClick={() => handleAddEngine(model.id)}
                                                    >
                                                        Add Engine
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModelComponent;
