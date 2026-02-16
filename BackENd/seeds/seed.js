/**
 * Database Seed Script for BlueShield Services
 * Populates MongoDB with initial data: users, maintenance requests, messages, water alternative requests
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const MaintenanceRequest = require("../models/MaintenanceRequest");
const Message = require("../models/messageModel");
const WaterAlternativeRequest = require("../models/AlternativeWaterSupply");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/blueshield";

async function clearCollections() {
    console.log("Clearing existing collections...");
    await User.deleteMany({});
    await MaintenanceRequest.deleteMany({});
    await Message.deleteMany({});
    await WaterAlternativeRequest.deleteMany({});
    console.log("Collections cleared.");
}

async function seedUsers() {
    // Hash passwords manually (insertMany bypasses User pre-save hook)
    const hashPassword = async (plain) => await bcrypt.hash(plain, 12);
    const usersData = [
        {
            first_name: "Admin",
            last_name: "BlueShield",
            email: "admin@blueshield.com",
            phone: "+963911000001",
            password: "Admin@123",
            role: "admin",
            locations: [
                { name: "Main Office", address: "Damascus, Syria", lat: 33.5138, lng: 36.2765 },
            ],
            marital_status: "single",
        },
        {
            first_name: "Ahmed",
            last_name: "Technician",
            email: "technician1@blueshield.com",
            phone: "+963911000002",
            password: "Tech@123",
            role: "technician",
            locations: [
                { name: "Home", address: "Aleppo, Syria", lat: 36.2021, lng: 37.1343 },
            ],
            marital_status: "married",
        },
        {
            first_name: "Sara",
            last_name: "Technician",
            email: "technician2@blueshield.com",
            phone: "+963911000003",
            password: "Tech@123",
            role: "technician",
            locations: [
                { name: "Office", address: "Homs, Syria", lat: 34.7268, lng: 36.7235 },
            ],
            marital_status: "single",
        },
        {
            first_name: "Omar",
            last_name: "Customer",
            email: "user1@blueshield.com",
            phone: "+963911000010",
            password: "User@123",
            role: "user",
            locations: [
                { name: "Home", address: "Damascus Center", lat: 33.5138, lng: 36.2765 },
                { name: "Work", address: "Industrial Area", lat: 33.5200, lng: 36.2800 },
            ],
            payment_methods: [
                { type: "credit_card", details: "Visa ****1234" },
                { type: "bank_transfer", details: "Account ending 5678" },
            ],
            marital_status: "married",
        },
        {
            first_name: "Layla",
            last_name: "Customer",
            email: "user2@blueshield.com",
            phone: "+963911000011",
            password: "User@123",
            role: "user",
            locations: [
                { name: "Apartment", address: "Latakia, Syria", lat: 35.5311, lng: 35.7722 },
            ],
            payment_methods: [{ type: "credit_card", details: "Mastercard ****4567" }],
            marital_status: "single",
        },
        {
            first_name: "Youssef",
            last_name: "Customer",
            email: "user3@blueshield.com",
            phone: "+963911000012",
            password: "User@123",
            role: "user",
            locations: [
                { name: "House", address: "Tartus, Syria", lat: 34.8833, lng: 35.8833 },
            ],
            marital_status: "divorced",
        },
    ];

    const users = await Promise.all(
        usersData.map(async (u) => ({
            ...u,
            password: await hashPassword(u.password),
        }))
    );
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users.`);
    return createdUsers;
}

async function seedMaintenanceRequests(users) {
    const admin = users.find((u) => u.role === "admin");
    const tech1 = users.find((u) => u.email === "technician1@blueshield.com");
    const tech2 = users.find((u) => u.email === "technician2@blueshield.com");
    const user1 = users.find((u) => u.email === "user1@blueshield.com");
    const user2 = users.find((u) => u.email === "user2@blueshield.com");
    const user3 = users.find((u) => u.email === "user3@blueshield.com");

    const categories = [
        "Plumbing",
        "Electrical",
        "HVAC",
        "Water Supply",
        "General Maintenance",
        "Emergency Repair",
    ];

    const requests = [
        {
            user_id: user1._id,
            description: "Water leakage in bathroom. The pipe under the sink is dripping constantly.",
            category: categories[0],
            location: { lat: 33.5138, lng: 36.2765 },
            status: "resolved",
            technician_id: tech1._id,
            resolved_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
            user_id: user1._id,
            description: "Power outage in living room. Outlets not working.",
            category: categories[1],
            location: { lat: 33.5150, lng: 36.2770 },
            status: "in-progress",
            technician_id: tech1._id,
        },
        {
            user_id: user2._id,
            description: "AC unit not cooling properly in summer.",
            category: categories[2],
            location: { lat: 35.5311, lng: 35.7722 },
            status: "assigned",
            technician_id: tech2._id,
        },
        {
            user_id: user2._id,
            description: "Low water pressure in kitchen tap.",
            category: categories[3],
            location: { lat: 35.5320, lng: 35.7730 },
            status: "pending",
        },
        {
            user_id: user3._id,
            description: "Door lock damaged, needs replacement.",
            category: categories[4],
            location: { lat: 34.8833, lng: 35.8833 },
            status: "pending",
        },
        {
            user_id: user3._id,
            description: "Burst pipe in basement - urgent!",
            category: categories[5],
            location: { lat: 34.8840, lng: 35.8840 },
            status: "in-progress",
            technician_id: tech2._id,
        },
    ];

    const createdRequests = await MaintenanceRequest.insertMany(requests);
    console.log(`Created ${createdRequests.length} maintenance requests.`);
    return createdRequests;
}

async function seedMessages() {
    const messages = [
        {
            name: "John Smith",
            email: "john.smith@email.com",
            subject: "General Inquiry",
            message: "I would like to know more about your maintenance services and pricing.",
            isRead: true,
            isReplied: true,
            replyMessage: "Thank you for your interest. Our team will contact you soon with details.",
            adminNote: "Sent pricing brochure",
        },
        {
            name: "Maria Garcia",
            email: "maria.g@email.com",
            subject: "Emergency Service",
            message: "We have a severe water leak. Need urgent assistance.",
            isRead: true,
            isReplied: false,
        },
        {
            name: "David Wilson",
            email: "d.wilson@email.com",
            subject: "Partnership Opportunity",
            message: "We represent a construction company. Interested in long-term maintenance contracts.",
            isRead: false,
            isReplied: false,
        },
    ];

    const createdMessages = await Message.insertMany(messages);
    console.log(`Created ${createdMessages.length} messages.`);
    return createdMessages;
}

async function seedWaterAlternativeRequests(users) {
    const tech1 = users.find((u) => u.email === "technician1@blueshield.com");
    const tech2 = users.find((u) => u.email === "technician2@blueshield.com");
    const user1 = users.find((u) => u.email === "user1@blueshield.com");
    const user2 = users.find((u) => u.email === "user2@blueshield.com");

    const waterRequests = [
        {
            user: user1._id,
            description: "Need 500L water tank delivery due to supply cut.",
            location: { lat: 33.5138, lng: 36.2765 },
            paymentMethod: "electronic",
            status: "completed",
            technician: tech1._id,
        },
        {
            user: user1._id,
            description: "Regular monthly water delivery request.",
            location: { lat: 33.5150, lng: 36.2770 },
            paymentMethod: "cash_on_delivery",
            status: "in_progress",
            technician: tech1._id,
        },
        {
            user: user2._id,
            description: "Urgent water delivery - family of 5.",
            location: { lat: 35.5311, lng: 35.7722 },
            paymentMethod: "electronic",
            status: "assigned",
            technician: tech2._id,
        },
        {
            user: user2._id,
            description: "Tank capacity 1000L for residential building.",
            location: { lat: 35.5320, lng: 35.7730 },
            paymentMethod: "cash_on_delivery",
            status: "pending",
        },
    ];

    const created = await WaterAlternativeRequest.insertMany(waterRequests);
    console.log(`Created ${created.length} water alternative requests.`);
    return created;
}

async function runSeed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        await clearCollections();
        const users = await seedUsers();
        await seedMaintenanceRequests(users);
        await seedMessages();
        await seedWaterAlternativeRequests(users);

        console.log("\nSeed completed successfully.");
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed.");
        process.exit(0);
    }
}

runSeed();
