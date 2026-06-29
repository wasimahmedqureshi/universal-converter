import { NextRequest, NextResponse } from "next/server";
import { updateJobStatus, saveToHistory } from "@/firebase/rtdb";
import { sanitizeFilename } from "@/utils/formats";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ConvertRequest {
  jobId: string;
  inputUrl: string;
  inputFormat: string;
  outputFormat: string;
  category: string;
  userId: string;
  originalName: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildConversionCommand(
  inputFormat: string,
  outputFormat: string,
  category: string,
  inputPath: string,
  outputPath: string
): string {
  // Document conversions via LibreOffice / Pandoc
  if (category === "document") {
    if (outputFormat === "pdf") {
      return `libreoffice --headless --convert-to pdf --outdir /tmp "${inputPath}"`;
    }
    if (inputFormat === "pdf" && outputFormat === "txt") {
      return `pdftotext "${inputPath}" "${outputPath}"`;
    }
    if (inputFormat === "pdf" && outputFormat === "html") {
      return `pdf2htmlEX "${inputPath}" "${outputPath}"`;
    }
    if (inputFormat === "md" && outputFormat === "html") {
      return `pandoc "${inputPath}" -o "${outputPath}"`;
    }
    return `pandoc "${inputPath}" -o "${outputPath}"`;
  }

  // Image conversions via ImageMagick
  if (category === "image") {
    if (inputFormat === "heic") {
      return `magick "${inputPath}" "${outputPath}"`;
    }
    if (outputFormat === "ico") {
      return `magick "${inputPath}" -resize 256x256 "${outputPath}"`;
    }
    return `magick "${inputPath}" "${outputPath}"`;
  }

  // Video conversions via FFmpeg
  if (category === "video") {
    if (outputFormat === "mp3") {
      return `ffmpeg -i "${inputPath}" -vn -acodec libmp3lame -q:a 2 "${outputPath}"`;
    }
    if (outputFormat === "gif") {
      return `ffmpeg -i "${inputPath}" -vf "fps=10,scale=480:-1" -loop 0 "${outputPath}"`;
    }
    return `ffmpeg -i "${inputPath}" -c:v libx264 -c:a aac "${outputPath}"`;
  }

  // Audio conversions via FFmpeg
  if (category === "audio") {
    return `ffmpeg -i "${inputPath}" "${outputPath}"`;
  }

  return `echo "No conversion command for ${inputFormat} -> ${outputFormat}"`;
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: ConvertRequest;

  try {
    body = (await req.json()) as ConvertRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { jobId, inputUrl, inputFormat, outputFormat, category, userId, originalName } = body;

  // Validate required fields
  if (!jobId || !inputUrl || !inputFormat || !outputFormat) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Validate formats (whitelist)
  const allowedFormats = [
    "pdf","docx","txt","html","xlsx","csv","pptx","md","epub",
    "png","jpg","webp","avif","svg","heic","gif","ico",
    "mp4","avi","mov","mkv","webm",
    "mp3","wav","aac","flac","ogg","m4a",
  ];

  if (!allowedFormats.includes(inputFormat) || !allowedFormats.includes(outputFormat)) {
    return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
  }

  try {
    // Mark as processing
    await updateJobStatus(jobId, { status: "processing", progress: 10 });

    // In production: download inputUrl → convert → upload output → get outputUrl
    // Here we simulate the conversion process and return the command for transparency.
    // Replace this section with actual FFmpeg/LibreOffice/Pandoc subprocess calls.

    const safeInput = sanitizeFilename(originalName ?? `input.${inputFormat}`);
    const safeOutput = safeInput.replace(/\.[^.]+$/, `.${outputFormat}`);
    const command = buildConversionCommand(
      inputFormat,
      outputFormat,
      category,
      `/tmp/${safeInput}`,
      `/tmp/${safeOutput}`
    );

    // Simulate progress
    await updateJobStatus(jobId, { progress: 50 });

    // TODO: Execute command with child_process.exec in a server environment
    // For Vercel deployment, use Railway/Render backend with FFmpeg installed
    // const { exec } = await import("child_process");
    // await new Promise((res, rej) => exec(command, (err) => err ? rej(err) : res(null)));

    // Simulate completion (replace with real outputUrl from Storage)
    const simulatedOutputUrl = inputUrl; // In production: upload converted file
    await updateJobStatus(jobId, { status: "completed", progress: 100, outputUrl: simulatedOutputUrl });

    // Save to user history
    if (userId && userId !== "guest") {
      await saveToHistory({
        userId,
        jobId,
        inputFile: originalName,
        inputFormat,
        outputFormat,
        outputUrl: simulatedOutputUrl,
        fileSize: 0,
        category,
        favourite: false,
      });
    }

    return NextResponse.json({
      success: true,
      jobId,
      outputUrl: simulatedOutputUrl,
      command, // Helpful for debugging / backend integration
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Conversion failed";
    await updateJobStatus(jobId, { status: "failed", errorMessage: msg });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
