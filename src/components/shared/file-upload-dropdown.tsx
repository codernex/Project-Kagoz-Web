import { UploadCloud, X } from "lucide-react"; // Assuming you're using lucide-react for icons
import { useCallback, useRef, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";

interface IFileUploadProps {
  placeholder?: string;
  multiple?: boolean;
  previewEnabled?: boolean;
  selectedFiles: File[],
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>
}

const FileUploadDropdown: React.FC<IFileUploadProps> = ({
  placeholder = "PNG, JPG or GIF (400x400 px)",
  multiple = false,
  previewEnabled = true,
  selectedFiles = [],
  setSelectedFiles = (files) => { } // New prop to enable or disable previews
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      
      const files = event.target.files;
      if (files) {
        const fileArray = Array.from(files);
        setSelectedFiles((prevFiles) => [...prevFiles, ...fileArray]);
      }
    },
    [setSelectedFiles]
  );

  const handleFileClick = () => {
    fileRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent the default behavior (open file in browser)
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false); // Reset dragging state when the file leaves the drop area
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent the default behavior
    setDragging(false); // Reset dragging state

    const files = event.dataTransfer.files;
    if (files.length) {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter((file) => file.size <= 1 * 1024 * 1024); // Only files <= 1MB
      if (validFiles.length < fileArray.length) {
        alert("Some files were not uploaded because they exceed the 1MB limit.");
      }
      setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  return (
    <div className="mt-2 w-full rounded-[.8rem]">
      <div
        onClick={handleFileClick}
        className={`bg-[#FAFAFA] rounded-[.8rem] h-[15rem] mt-2 flex flex-col justify-center items-center cursor-pointer ${dragging ? "border border-dashed border-blue-500" : ""
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewEnabled && selectedFiles.length > 0 ? (
          <div className="text-center">
            <p className="font-semibold">Selected Files:</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  {file.type.startsWith("image/") && (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      className="max-h-[10rem] rounded-md"
                      width={100}
                      height={100}
                    />
                  )}
                  <button
                    className="absolute p-1 bg-white rounded-full shadow-md opacity-0 top-1 right-1 group-hover:opacity-100"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                  <p className="mt-2 text-xs text-muted">{file.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <UploadCloud />
            <p className="mt-6 text-muted">
              <span className="font-semibold text-black">Click to upload</span>{" "}
              or drag and drop
            </p>
            <p className="text-muted">{placeholder}</p>
          </>
        )}
        <Input
          multiple={multiple}
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default FileUploadDropdown;
