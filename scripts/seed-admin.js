#!/usr/bin/env node
/**
 * Seed default admin account for SkillSync
 * Usage: node scripts/seed-admin.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@skillsync.dev";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123456";
const ADMIN_NAME = process.env.ADMIN_NAME || "SkillSync Admin";

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = mongoose.connection.collection("users");

  const existing = await users.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role !== "admin") {
      await users.updateOne({ email: ADMIN_EMAIL }, { $set: { role: "admin" } });
      console.log(`Updated ${ADMIN_EMAIL} to admin role`);
    } else {
      console.log(`Admin already exists: ${ADMIN_EMAIL}`);
    }
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await users.insertOne({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("Admin account created:");
  console.log(`  Email: ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
