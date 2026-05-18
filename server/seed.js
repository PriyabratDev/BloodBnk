/**
 * seed.js — Populate MongoDB with initial data for the BloodBank system.
 *
 * Run: node seed.js
 *
 * Creates:
 *  - 1 admin user (admin@bloodbank.com / admin123)
 *  - 1 staff user (staff@bloodbank.com / staff123)
 *  - 8 inventory items (one per blood group)
 *  - 15 donors
 *  - 40 blood requests (mix of pending, fulfilled, rejected)
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Donor = require("./models/Donor");
const Inventory = require("./models/Inventory");
const BloodRequest = require("./models/BloodRequest");

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad"];

const HOSPITALS = [
  "City General Hospital",
  "St. Mary's Medical Center",
  "Apollo Hospital",
  "Fortis Healthcare",
  "AIIMS",
  "Max Super Speciality",
  "Medanta",
  "Ruby Hall Clinic",
];

const FIRST_NAMES = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun",
  "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
  "Ananya", "Diya", "Priya", "Riya", "Sneha",
];

const LAST_NAMES = [
  "Sharma", "Verma", "Patel", "Kumar", "Singh",
  "Reddy", "Gupta", "Mehta", "Nair", "Joshi",
];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysBack) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d;
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // ----- Clear existing data -----
  await User.deleteMany({});
  await Donor.deleteMany({});
  await Inventory.deleteMany({});
  await BloodRequest.deleteMany({});
  console.log("Cleared existing data");

  // ----- Users -----
  const adminPass = await bcrypt.hash("admin123", 10);
  const staffPass = await bcrypt.hash("staff123", 10);
  const userPass = await bcrypt.hash("user123", 10);

  await User.create([
    { name: "Admin User", email: "admin@bloodbank.com", password: adminPass, role: "admin" },
    { name: "Staff Member", email: "staff@bloodbank.com", password: staffPass, role: "staff" },
    { name: "Regular User", email: "user@bloodbank.com", password: userPass, role: "user" },
  ]);
  console.log("Created 3 users (admin / staff / user)");

  // ----- Inventory -----
  const inventoryData = BLOOD_GROUPS.map((bg) => ({
    bloodGroup: bg,
    units: randInt(5, 80),
    lowStockThreshold: 10,
    lastUpdated: new Date(),
  }));
  await Inventory.insertMany(inventoryData);
  console.log("Created 8 inventory items");

  // ----- Donors -----
  const donors = [];
  for (let i = 0; i < 15; i++) {
    const name = `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`;
    donors.push({
      name,
      age: randInt(18, 55),
      bloodGroup: rand(BLOOD_GROUPS),
      phone: `98${randInt(10000000, 99999999)}`,
      email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
      city: rand(CITIES),
      lastDonated: randomDate(180),
      isEligible: Math.random() > 0.2,
    });
  }
  await Donor.insertMany(donors);
  console.log("Created 15 donors");

  // ----- Blood Requests (40 requests over past 60 days) -----
  const requests = [];
  const statuses = ["pending", "fulfilled", "fulfilled", "fulfilled", "rejected"];
  for (let i = 0; i < 40; i++) {
    requests.push({
      patientName: `${rand(FIRST_NAMES)} ${rand(LAST_NAMES)}`,
      bloodGroup: rand(BLOOD_GROUPS),
      units: randInt(1, 6),
      hospital: rand(HOSPITALS),
      contactNumber: `97${randInt(10000000, 99999999)}`,
      urgency: rand(["low", "medium", "medium", "high"]),
      status: rand(statuses),
      requestedAt: randomDate(60),
    });
  }
  await BloodRequest.insertMany(requests);
  console.log("Created 40 blood requests");

  console.log("\n✅ Seed complete!");
  console.log("   Admin login:  admin@bloodbank.com / admin123");
  console.log("   Staff login:  staff@bloodbank.com / staff123");
  console.log("   User login:   user@bloodbank.com  / user123");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
