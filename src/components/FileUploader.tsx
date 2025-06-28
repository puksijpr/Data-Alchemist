// src/components/FileUploader.tsx
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, CheckCircle } from "lucide-react";
import { parseFile } from "@/lib/parsers/fileParser";
import toast from "react-hot-toast";

interface FileUploaderProps {
  onFileUpload: (data: any[]) => void;
  fileType: "clients" | "workers" | "tasks";
  hasData: boolean;
}

export function FileUploader({
  onFileUpload,
  fileType,
  hasData,
}: FileUploaderProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        try {
          const data = await parseFile(acceptedFiles[0], fileType);
          onFileUpload(data);
          toast.success(`${fileType} data uploaded successfully!`);
        } catch (error) {
          toast.error(`Failed to parse ${fileType} file`);
        }
      }
    },
    [onFileUpload, fileType]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors duration-300
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }
        ${hasData ? "bg-green-50 border-green-300" : ""}`}
    >
      <input {...getInputProps()} />

      {hasData ? (
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
      ) : (
        <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition" />
      )}

      <p className="mt-3 text-base font-medium text-gray-700">
        {hasData ? (
          <span className="text-green-600 capitalize">
            {fileType} data loaded
          </span>
        ) : (
          <span className="capitalize">
            Drop <span className="font-semibold">{fileType}</span> file here
          </span>
        )}
      </p>

      <p className="text-xs text-gray-500 mt-1 italic">
        CSV or XLSX files only
      </p>
    </div>
  );
}
