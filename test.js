
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const OCR_API_KEY = "YOUR_API_KEY"; // 🔑 Replace with your OCR.Space API key

// Function to extract text from a given image
async function extractTextFromImage(imagePath) {
    try {
        const formData = new FormData();
        formData.append("apikey", "K87595561088957");
        formData.append("language", "eng");
        formData.append("file", fs.createReadStream(imagePath));

        const response = await axios.post("https://api.ocr.space/Parse/Image", formData, {
            headers: formData.getHeaders(),
            maxBodyLength: Infinity,
            timeout: 1000 * 60 * 5, // 5 minutes
        });

        const data = response.data;

        if (data?.ParsedResults?.length > 0) {
            let text = data.ParsedResults[0].ParsedText || "";
            // Clean the extracted text
            text = text
                .replace(/'/g, "`")
                .replace(/\n/g, "; ")
                .replace(/\r/g, "")
                .replace(/\t/g, " ");
            return text;
        } else {
            console.error("❌ No text found:", data);
            return null;
        }
    } catch (error) {
        console.error("❌ OCR Error:", error.message);
        return null;
    }
}

// Main function
async function runOCR() {
    const frontPath = "./front.jpeg"; // 🔹 Replace with your Aadhaar front image
    const backPath = "./back.jpeg";   // 🔹 Replace with your Aadhaar back image

    console.log("📤 Uploading Aadhaar front image...");
    const frontText = await extractTextFromImage(frontPath);

    console.log("📤 Uploading Aadhaar back image...");
    const backText = await extractTextFromImage(backPath);

    console.log("\n✅ OCR RESULTS");
    console.log("📄 Front Text:\n", frontText);
    console.log("\n📄 Back Text:\n", backText);
}

runOCR();
