import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { addUploadApproachAPI, getUploadApproachAPI } from "../../utils/practiceApi";
import { mediaUrl } from "../../utils/URL";

const Approach = () => {
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
            await addUploadApproachAPI(formData);
            Swal.fire("Success", "Practice item uploaded", "success");
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Something went wrong", "error");
        }
    };

    useEffect(() => {
        const fetchDefaultValues = async () => {
            try {
                const data = await getUploadApproachAPI();
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
                    Update Approach
                </h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            required={true}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label>Description</label>
                        <ReactQuill value={description} onChange={setDescription} />
                    </div>

                    

                    <div style={{ marginBottom: "20px" }}>
                        <label>Scoring</label>
                        <ReactQuill value={scoring} onChange={setScoring} />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label>Video</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setVideo(file);
                                if (file) {
                                    setVideoPreviewUrl(URL.createObjectURL(file));
                                }
                            }}
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>

                    {videoPreviewUrl && (
                        <div style={{ marginTop: "20px" , height: "300px",}}>
                            <label>Video Preview:</label>
                            <video
                                controls
                                src={videoPreviewUrl}
                                style={{
                                    width: "100%",
                                    maxWidth: "500px",
                                    maxHeight: "280px",
                                    borderRadius: "8px",
                                    marginTop: "10px",
                                    display: "block"
                                }}
                            />
                        </div>
                    )}

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

export default Approach;
