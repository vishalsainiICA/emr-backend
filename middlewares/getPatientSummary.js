import fs from "fs";
import FormData from "form-data";
import axios from "axios";

export const getPatientSummary = async (files = []) => {
    // console.log("getPatientSummary called");
    console.log("Total files received:", files.length);

    if (!files.length) {
        console.warn(" No files provided for summary");
        return null;
    }

    const formData = new FormData();

    files.forEach((file, index) => {
        // console.log(`📎 Attaching file [${index}]`, {
        //     name: file.originalname,
        //     path: file.path,
        //     type: file.mimetype,
        //     size: file.size
        // });

        if (!fs.existsSync(file.path)) {
            throw new Error("File missing on disk: " + file.path);
        }

        //SAME FIELD NAME "files" EVERY TIME
        formData.append(
            "files",
            fs.createReadStream(file.path),
            file.originalname
        );
    });

    console.log("Sending request to Disease RAG API...");

    const response = await axios.post(
        "https://disease-rag-api-k12s.onrender.com/summarise",
        formData,
        {
            headers: {
                Accept: "application/json"
                // Content-Type mat set karo
            },
            timeout: 60000,
            maxBodyLength: Infinity
        }
    );

    console.log("Summary API success:", response.status);
    return response.data;
};




