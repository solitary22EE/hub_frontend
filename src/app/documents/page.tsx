"use client";

/**
 * Documents page — /documents
 *
 * TODO:
 *  1. Fetch documents via GET /api/v1/documents
 *  2. Implement drag-and-drop or click-to-upload area
 *  3. Show upload progress
 *  4. List documents in a table with delete button
 */
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Document } from "@/types";
import { formatFileSize, formatDate } from "@/lib/utils";

export default function DocumentsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: () => api.get<Document[]>("/documents/").then((r) => r.data),
    // Poll every 3s while any document is still processing
    refetchInterval: (query) =>
      query.state.data?.some((d) => !d.processed) ? 3000 : false,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/documents/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } }).response?.data?.detail ??
        "Upload failed";
      setUploadError(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Documents</h1>

      {/* Upload zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 mb-6"
      >
        <p className="text-gray-500">
          {uploading ? "Uploading..." : "Click to upload a document"}
        </p>
        <p className="text-xs text-gray-400 mt-1">PDF, DOCX, TXT, PNG, JPG — max 50 MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {uploadError && <p className="text-red-500 text-sm mb-4">{uploadError}</p>}

      {/* Document list */}
      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : documents.length === 0 ? (
        <p className="text-gray-400 text-center">No documents yet. Upload one above.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Name</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Size</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b hover:bg-gray-50">
                <td className="py-2 font-medium">{doc.filename}</td>
                <td className="py-2 uppercase text-xs text-gray-500">{doc.file_type}</td>
                <td className="py-2">{formatFileSize(doc.file_size)}</td>
                <td className="py-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      doc.processed
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {doc.processed ? "Ready" : "Processing..."}
                  </span>
                </td>
                <td className="py-2 text-gray-400">{formatDate(doc.created_at)}</td>
                <td className="py-2">
                  <button
                    onClick={() => {
                      if (confirm("Delete this document?")) deleteMutation.mutate(doc.id);
                    }}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
