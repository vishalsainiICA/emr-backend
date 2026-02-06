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

    return await callSummaryApi(formData)
};

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const callSummaryApi = async (formData, timeoutMs = 15000, retries = 2) => {
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            console.log("attempt--", attempt);

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), timeoutMs);

            const response = await axios.post(
                "https://disease-rag-api-k12s.onrender.com/summarise",
                formData,
                {
                    headers: { Accept: "application/json" },
                    maxBodyLength: Infinity,
                    signal: controller.signal
                }
            );

            clearTimeout(timeout);
            return response.data;

        } catch (error) {
            console.error("Summary API error:", error.message);

            if (attempt <= retries) {
                await wait(500 * attempt);
            }
        }
    }
    return null;
};





