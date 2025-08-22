import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { addSimulatedRoundAPI, getSimulatedRoundAPI } from "../../utils/practiceApi";
import { mediaUrl } from "../../utils/URL";

const SimulatedRound = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [howToDoIt, setHowToDoIt] = useState("");
    const [scoring, setScoring] = useState("");
    const [video, setVideo] = useState(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("howToDoIt", howToDoIt);
        formData.append("scoring", scoring);
        formData.append("video", video);

        try {
            await addSimulatedRoundAPI(formData);
            Swal.fire("Success", "Practice item uploaded", "success");
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Something went wrong", "error");
        }
    };

    useEffect(() => {
        const fetchDefaultValues = async () => {
            try {
                const data = await getSimulatedRoundAPI();
                setTitle(data.title || "");
                setDescription(data.description || "");
                setHowToDoIt(data.howToDoIt || "");
                setScoring(data.scoring || "");

                if (data.video) {
                    setVideoPreviewUrl(mediaUrl() + data.video);
                }
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Could not load default values", "error");
            }
        };

        fetchDefaultValues();
    }, []);

    return (
        // <div style={{ display: "flex" }}>
        //     <Sidebar />
            <main className="app-content" >
                <h2 style={{
                    backgroundColor: "#003e89",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "4px",
                    marginBottom: "20px"
                }}>
                    Update Simulated Round
                </h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                        <label>Title</label>
                        <input
                            type="text"
                            required={true}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label>Description</label>
                        <ReactQuill value={description} onChange={setDescription} />
                    </div>

                  
                    <button
                        type="submit"
                        style={{
                            backgroundColor: "#ff4fb8",
                            color: "#fff",
                            padding: "10px 20px",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "4px",
                            margin: "20px 0"
                        }}
                    >
                        Upload Practice
                    </button>
                </form>
            </main>
        // </div>
    );
};

export default SimulatedRound;
