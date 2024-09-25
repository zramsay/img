import { ImageRecord } from "../hooks/useImageStorage";

const ImageCard = ({ image, index }: { image: ImageRecord, index: number }) => (
  <div key={index} className="w-full">
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={image.url}
        alt={`Uploaded ${index}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{image.title || "Untitled"}</h3>
        <p className="text-gray-600">{image.description || "No description"}</p>
      </div>
    </div>
  </div>
);

export default ImageCard;
