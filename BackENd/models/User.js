const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the user schema
const UserSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin", "technician"], default: "user" },
        profile_picture: { type: String },
        payment_methods: [
            {
                type: { type: String, enum: ["credit_card", "paypal", "bank_transfer"], default: "credit_card" },
                details: { type: String },
            },
        ],
        locations: [
            {
                name: { type: String, required: true },
                address: { type: String },
                lat: { type: Number, required: true },
                lng: { type: Number, required: true },
            },
        ],
        date_of_birth: { type: Date },
        marital_status: { type: String, enum: ["single", "married", "divorced"], default: "single" },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Hash password before saving the user
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Only hash password if it's modified
    this.password = await bcrypt.hash(this.password, 12);
    next(); // Proceed to save the user
});

module.exports = mongoose.model("User", UserSchema);
