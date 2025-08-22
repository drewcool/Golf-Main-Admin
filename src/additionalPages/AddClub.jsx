import React, { useState } from "react";
import Swal from "sweetalert2";
import { AddClubApi } from "../utils/uploadApi";

const AddClub = () => {
    const [clubForm, setClubForm] = useState({
        name: "",
        code: "",
        type: "",
        brand: "",
        loft: "",
        description: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClubForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {code, name, type, brand, loft, description } = clubForm;

        if (!code || !name || !type || !brand || !loft || !description) {
            Swal.fire("Missing Fields", "Please fill in all fields.", "warning");
            return;
        }

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to add this club?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Add",
        });

        if (!result.isConfirmed) return;

        try {
            const payload = {
                name,
                code,
                type,
                brand,
                loft: Number(loft),
                description,
            };

            const res = await AddClubApi(payload);

            if (res && res.status) {
                await Swal.fire("Success", res.message || "Club added successfully!", "success");

                // Reset form
                setClubForm({
                    name: "",
                    type: "",
                    code: "",
                    brand: "",
                    loft: "",
                    description: ""
                });
            } else {
                throw new Error(res?.message || "Unexpected response");
            }
        } catch (err) {
            console.error("Club submission error:", err);
            Swal.fire("Error", err?.message || "Something went wrong", "error");
        }
    };

    return (
        <main className="app-content">
            <div className="app-title tile p-3">
                <h1><span className="mr-4 fw-bold">Add Club</span></h1>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="tile">
                        <div
                            className="case-status d-flex justify-content-center"
                            style={{ backgroundColor: "#00489d", color: "#fff", height: "50px" }}
                        >
                            <h4 className="mt-2">Add New Club</h4>
                        </div>
                        <div className="tile-body p-3">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={clubForm.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="code"
                                        value={clubForm.code}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Type</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="type"
                                        value={clubForm.type}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Brand</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="brand"
                                        value={clubForm.brand}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Loft (°)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="loft"
                                        value={clubForm.loft}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        value={clubForm.description}
                                        onChange={handleChange}
                                        rows="4"
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary">Add Club</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AddClub;
