import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Slider, TextInput } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import { Instagram } from "lucide-react-native";
import axios from "axios";

export default function PDFToInstagram() {
  const [pdfFile, setPdfFile] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [watermark, setWatermark] = useState(null);
  const [watermarkPosition, setWatermarkPosition] = useState({ x: 10, y: 10 });
  const [watermarkSize, setWatermarkSize] = useState(50);
  const [filter, setFilter] = useState("none");
  
  const API_URL = "https://pdf-to-instagram.onrender.com"; // Replace with your Render API URL

  const pickPDF = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (result.type === "success") {
      setPdfFile(result.uri);
      uploadPDF(result.uri);
    }
  };

  const uploadPDF = async (pdfUri) => {
    try {
      let formData = new FormData();
      formData.append("pdf", {
        uri: pdfUri,
        name: "upload.pdf",
        type: "application/pdf",
      });

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImages(response.data.images);
    } catch (error) {
      console.error("Error uploading PDF", error);
    }
  };

  const pickWatermark = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.cancelled) {
      setWatermark(result.uri);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Upload PDF & Convert to Instagram Images</Text>
      <TouchableOpacity onPress={pickPDF} style={{ backgroundColor: "#007bff", padding: 10, borderRadius: 5, marginBottom: 10 }}>
        <Text style={{ color: "white", textAlign: "center" }}>Select PDF</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={pickWatermark} style={{ backgroundColor: "#28a745", padding: 10, borderRadius: 5, marginBottom: 10 }}>
        <Text style={{ color: "white", textAlign: "center" }}>Upload Watermark</Text>
      </TouchableOpacity>
      {images.length > 0 && (
        <View>
          {images.map((img, index) => (
            <View key={index} style={{ position: "relative", marginBottom: 20 }}>
              <Image
                source={{ uri: `${API_URL}${img}` }}
                style={{ width: "100%", height: 200, filter: filter }}
              />
              {watermark && (
                <Image
                  source={{ uri: watermark }}
                  style={{
                    position: "absolute",
                    left: `${watermarkPosition.x}%`,
                    top: `${watermarkPosition.y}%`,
                    width: watermarkSize,
                    height: watermarkSize,
                    opacity: 0.75,
                  }}
                />
              )}
              <TouchableOpacity onPress={() => {}} style={{ backgroundColor: "#007bff", padding: 10, borderRadius: 5, marginTop: 5 }}>
                <Text style={{ color: "white", textAlign: "center" }}>Share to Instagram</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
