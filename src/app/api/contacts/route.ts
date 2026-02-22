import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";

const dbPath = path.join(process.cwd(), "src/app/_data/db.json");

function readDb() {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
}

function writeDb(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

async function getUserId(request: NextRequest) {
  const headersList = await cookies();
  return headersList.get("userId")?.value;
}

// GET all contacts for a user
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = readDb();
    const userContacts = db.contacts.filter((c: any) => c.userId === userId);

    return NextResponse.json({
      success: true,
      data: userContacts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}

// POST new contact
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone = "" } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    const db = readDb();
    const newContact = {
      id: String(Date.now()),
      name,
      email,
      phone,
      userId,
    };

    db.contacts.push(newContact);
    writeDb(db);

    return NextResponse.json(
      {
        success: true,
        data: newContact,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 },
    );
  }
}
