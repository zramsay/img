import { useState, useEffect, useRef } from "react";
import { ImageRecord, useImageStorage } from "../hooks/useImageStorage";
import UploadPreviewModal from "../components/UploadPreviewModal";
import UploadButton from "../components/UploadButton";
import EmptyState from "../components/EmptyState";
import ImageCard from "../components/ImageCard";

const App = () => {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { storeImage, fetchImages, isLoading } = useImageStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      fetchImages().then(setImages);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setIsModalOpen(true);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
  };

  const uploadImage = async (title?: string, description?: string) => {
    if (selectedFile) {
      await storeImage(selectedFile, title, description);
      const updatedImages = await fetchImages();
      setImages(updatedImages);
      resetFormAndCloseModal();
    }
  };

  const resetFormAndCloseModal = () => {
    setSelectedFile(null);
    setIsModalOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Navigation Bar */}
      <div className="p-4 shadow-md fixed top-0 left-0 right-0 bg-white z-10">
        <h1 className="text-center text-xl font-bold">Image App</h1>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-5 overflow-y-auto mt-12 mb-8">
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {images.length === 0 ? (
            <EmptyState />
          ) : (
            images.map((image, index) => (
              <ImageCard key={index} image={image} index={index} />
            ))
          )}
        </div>
      </div>

      <UploadButton
        isLoading={isLoading}
        handleImageChange={handleImageChange}
        fileInputRef={fileInputRef}
      />

      <UploadPreviewModal
        isOpen={isModalOpen}
        onSubmit={uploadImage}
        onCancel={resetFormAndCloseModal}
        preview={preview}
      />
    </div>
  );
};

export default App;
