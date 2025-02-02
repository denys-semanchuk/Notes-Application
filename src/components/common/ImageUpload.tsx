import React from 'react';
import 'styles/imageUpload.css'
interface ImageUploadProps {
  onBeforeUpload?: () => void;
  onImageUpload: (images: string[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, onBeforeUpload }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBeforeUpload?.();
    const files = Array.from(e.target.files || []);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload([reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        id="image-upload"
      />
      <label htmlFor="image-upload">
        📎 Add Images
      </label>
    </div>
  );
};