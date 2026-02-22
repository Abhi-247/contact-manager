"use server";

import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "src/app/_data/db.json");

function readDb() {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
}

function writeDb(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  try {
    const db = readDb();

    // Check if user already exists
    const existingUser = db.users.find((u: any) => u.email === email);
    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    // Create new user
    const newUser = {
      id: String(Date.now()),
      name,
      email,
      password, // In production, hash this!
    };

    db.users.push(newUser);
    writeDb(db);
    // Do not auto-login after registration; require explicit login
    return { success: true, userId: newUser.id };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Registration failed" };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const db = readDb();

    // Find user
    const user = db.users.find(
      (u: any) => u.email === email && u.password === password,
    );
    if (!user) {
      return { success: false, error: "Invalid credentials" };
    }

    // Set session cookie
    const headersList = await cookies();
    headersList.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Login failed" };
  }
}

export async function logoutUser() {
  try {
    const headersList = await cookies();
    headersList.delete("userId");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Logout failed" };
  }
}

export async function getCurrentUser() {
  try {
    const headersList = await cookies();
    const userId = headersList.get("userId")?.value;

    if (!userId) {
      return null;
    }

    const db = readDb();
    const user = db.users.find((u: any) => u.id === userId);
    return user || null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
