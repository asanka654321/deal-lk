import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define upload directory
        const uploadDir = join(process.cwd(), "public", "uploads");

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (err) {
            // Directory might already exist
        }

        // Generate unique filename
        const uniqueName = `${Date.now()}-${uuidv4()}-${file.name.replace(/\s+/g, "_")}`;
        const path = join(uploadDir, uniqueName);

        // Save file
        await writeFile(path, buffer);

        // Return public URL
        const publicUrl = `/uploads/${uniqueName}`;
        return NextResponse.json({ url: publicUrl });

    } catch (error) {
        console.error("[UPLOAD_POST]", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
