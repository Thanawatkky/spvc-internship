import imageCompression from 'browser-image-compression';

/**
 * บีบอัดรูปภาพฝั่ง Client ก่อนส่งไปยัง Server
 * @param file - ไฟล์รูปภาพ
 * @param maxSizeMB - ขนาดสูงสุด (MB) ค่าเริ่มต้น 1MB
 * @param maxWidthOrHeight - ขนาดภาพสูงสุด (px) ค่าเริ่มต้น 1920px
 * @returns ไฟล์รูปภาพที่ถูกบีบอัดแล้ว
 */
export async function compressImage(
    file: File,
    maxSizeMB: number = 1,
    maxWidthOrHeight: number = 1920
): Promise<File> {
    // ถ้าไฟล์เล็กกว่า limit แล้ว ไม่ต้องบีบอัด
    if (file.size <= maxSizeMB * 1024 * 1024) {
        return file;
    }

    const options = {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker: true,
        fileType: file.type as string,
    };

    const compressedFile = await imageCompression(file, options);
    return compressedFile;
}
