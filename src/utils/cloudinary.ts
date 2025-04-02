// src/utils/cloudinary.ts

const CLOUDINARY_CLOUD_NAME = "dfemzf18y"; // Replace with your Cloudinary cloud name

/**
 * Generates the full Cloudinary image URL from a public ID.
 * @param publicId - The public ID of the image stored in Cloudinary.
 * @param options - Optional transformations (e.g., width, height).
 * @returns The full URL of the image.
 */
export const getCloudinaryUrl = (publicId?: string, options?: { width?: number; height?: number }): string => {
    if (!publicId) return ""; // Handle missing public ID gracefully

    let transformations = "";

    // Apply optional transformations
    if (options) {
        const { width, height } = options;
        if (width || height) {
            transformations = `w_${width || ""},h_${height || ""},c_fill/`;
        }
    }

    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}${publicId}`;
};
