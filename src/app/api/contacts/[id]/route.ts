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

// GET single contact
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = readDb();
    const contact = db.contacts.find(
      (c: any) => c.id === id && c.userId === userId,
    );

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch contact" },
      { status: 500 },
    );
  }
}

// PUT update contact
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, phone = "" } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    const db = readDb();
    const contactIndex = db.contacts.findIndex(
      (c: any) => c.id === id && c.userId === userId,
    );

    if (contactIndex === -1) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    db.contacts[contactIndex] = {
      ...db.contacts[contactIndex],
      name,
      email,
      phone,
    };

    writeDb(db);

    return NextResponse.json({
      success: true,
      data: db.contacts[contactIndex],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 },
    );
  }
}

// DELETE contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = readDb();
    const contactIndex = db.contacts.findIndex(
      (c: any) => c.id === id && c.userId === userId,
    );

    if (contactIndex === -1) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    db.contacts.splice(contactIndex, 1);
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: "Contact deleted",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 },
    );
  }
}
