const mongoose = require("mongoose");

// Define the schema for alternative water supply requests
const AlternativeWaterSupplySchema = new mongoose.Schema(
    {
        request_id: { type: mongoose.Schema.Types.ObjectId, ref: "MaintenanceRequest", required: true }, // Reference to the related maintenance request
        supplier: { type: String, required: true }, // Supplier providing the water
        quantity: { type: Number, required: true }, // Quantity of water supplied
        total_quantity: { type: Number, required: true }, // Total quantity needed
        delivery_date: { type: Date, required: true }, // Actual delivery date
        expected_delivery_date: { type: Date }, // Expected delivery date (optional)
        delivery_status: { type: String, enum: ["pending", "delivered", "delayed"], default: "pending" }, // Status of delivery (default: pending)
        cost: { type: Number }, // Cost of the water supply (optional)
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Export the AlternativeWaterSupply model
module.exports = mongoose.model("AlternativeWaterSupply", AlternativeWaterSupplySchema);
