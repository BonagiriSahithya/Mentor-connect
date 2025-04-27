const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
    filename: { type: String, required: true },
    filepath: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("File", FileSchema);

