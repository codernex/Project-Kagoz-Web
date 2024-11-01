import { UploadCloud } from "lucide-react"; // assuming you're using lucide-react for icons
import { useRef, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";

const FileUploadDropdown = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null | undefined>(
    null,
  );
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFile(files[0]); // Set the selected file
    }
  };

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

    const files = event.dataTransfer.files; // Get the dropped files
    if (files.length) {
      const file = files[0];

      if (file) {
        if (file.size > 1 * 1024 * 1024) {
          alert("File size exceeds the limit of 1 MB");
          return;
        }
        setSelectedFile(files[0]);
      }
      // Handle the file upload logic here, or trigger the input file field
    }
  };

  return (
    <div className="  mt-2 w-full rounded-[.8rem]">
      <div
        onClick={handleFileClick}
        className="bg-[#FAFAFA] rounded-[.8rem] h-[15rem] mt-2 flex flex-col justify-center items-center cursor-pointer"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <>
            <UploadCloud />
            <p className="text-muted mt-6">
              <span className="text-black font-semibold">Click to upload</span>{" "}
              or drag and drop
            </p>
            <p className="text-muted">PNG, JPG or GIF (400x400 px)</p>
          </>
        ) : (
          <div className="text-center">
            <p className="font-semibold">Selected File:</p>
            <p>{selectedFile.name}</p>
            {selectedFile.type.startsWith("image/") && (
              <Image
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="mt-4 max-h-[10rem] rounded-md"
                width={200}
                height={200}
              />
            )}
          </div>
        )}
        <Input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={handleFileChange} // Handle file selection
        />
      </div>
    </div>
  );
};

export default FileUploadDropdown;
