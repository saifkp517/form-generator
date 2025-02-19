// Install dependencies: bun add express cors mongoose dotenv
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/formbuilder", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const FormSchema = new mongoose.Schema({
    formElements: { type: Array, required: true },
}, { timestamps: true });

const Form = mongoose.model("Form", FormSchema);

// Get latest form
app.get("/form", async (req, res) => {
    const latestForm = await Form.findOne().sort({ createdAt: -1 });
    res.json(latestForm ? latestForm.formElements : []);
});

// Save form
app.post("/form", async (req, res) => {
    await Form.create({ formElements: req.body.formElements });
    res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

