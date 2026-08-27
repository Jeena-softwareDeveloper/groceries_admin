import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, X } from 'lucide-react';
import { api } from '../../api/client';
import axios from 'axios';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, folder = 'districtmart', className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g., 50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Upload directly to our backend server
      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update the state with the returned URL
      if (res.data.success) {
        onChange(res.data.data.url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.message || err.response?.data?.error?.message || 'Failed to upload image. Check server connection.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = () => {
    onChange('');
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {value ? (
        <div className="relative inline-block border border-slate-200 rounded-lg overflow-hidden group max-w-[200px]">
          {value.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <video src={value} className="max-w-[200px] max-h-[150px] object-cover block" controls muted />
          ) : (
            <img src={value} alt="Uploaded" className="max-w-[200px] max-h-[150px] object-cover block" />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={removeImage}
              className="bg-white text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors"
              title="Remove Image"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center text-slate-500">
              <Loader2 className="animate-spin mb-2" size={24} />
              <span className="text-sm font-medium">Uploading...</span>
            </div>
          ) : (
            <>
              <UploadCloud className="text-slate-400 mb-2" size={28} />
              <span className="text-sm font-medium text-slate-600">Click to upload image</span>
              <span className="text-xs text-slate-400 mt-1">Image or Video up to 50MB</span>
            </>
          )}
        </div>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/png, image/jpeg, image/webp, video/mp4, video/quicktime"  
        className="hidden" 
      />
      
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}


