"use client";
import React, { useState, useRef, useEffect } from "react";
import classes from "./FileUploadPreview.module.css";

const FileUploadPreview = ({ files, chageFilesHandler }) => {
  //const [files, setFiles] = useState([]); // 파일 상태 (배열로 저장)
  const [filePreviews, setFilePreviews] = useState([]); // 미리보기 상태

  useEffect(() => {
    setFilePreviews(
      files.map((file) =>
        file.type.startsWith("image") ? URL.createObjectURL(file) : null
      )
    );
  }, [files]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault(); // 기본 동작 방지
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // 기본 동작 방지
  };

  // 파일 추가 함수
  const addFiles = (newFiles) => {
    const imageFiles = newFiles.filter(
      (file) =>
        file.type.startsWith("image") &&
        file.name.split(".").pop().toLowerCase() !== "psd"
    );

    if (imageFiles.length === 0) {
      alert("허용된 이미지 파일만 업로드할 수 있습니다. (JPEG, PNG, GIF 형식)");
      return;
    }

    if (newFiles.length + files.length > 3) {
      alert("최대 3개까지 파일을 업로드할 수 있습니다.");
      return;
    }

    const updatedFiles = [...files, ...newFiles];
    chageFilesHandler(updatedFiles);

    const newPreviews = newFiles.map((file) =>
      file.type.startsWith("image") ? URL.createObjectURL(file) : null
    );
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (preview) => {
    const indexToRemove = filePreviews.indexOf(preview);
    if (indexToRemove === -1) return;

    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    chageFilesHandler(updatedFiles);

    const updatedPreviews = filePreviews.filter(
      (_, index) => index !== indexToRemove
    );
    setFilePreviews(updatedPreviews);
  };

  // const handleUpload = async () => {
  //   if (files.length === 0) return;

  //   const formData = new FormData();
  //   files.forEach((file) => {
  //     formData.append("files", file);
  //   });

  //   try {
  //     const response = await fetch("/api/upload", {
  //       method: "POST",
  //       body: formData,
  //     });
  //     if (response.ok) {
  //       alert("파일 업로드 성공");
  //     } else {
  //       alert("파일 업로드 실패");
  //     }
  //   } catch (error) {
  //     alert("에러 발생: " + error.message);
  //   }
  // };

  return (
    <div className={`${classes["file-upload-box"]}`}>
      {/* 미리보기 이미지 출력 */}
      {filePreviews.length > 0 && (
        <div className={`${classes["file-preview-box"]}`}>
          {filePreviews.map((preview, index) =>
            preview ? (
              <div
                key={index}
                className={`${classes["file-preview-img"]}`}
                onClick={() => removeFile(preview)}
              >
                <i className={`xi-close-thin`}> </i>
                <img src={preview} alt={`미리보기 ${index + 1}`} />
              </div>
            ) : null
          )}
        </div>
      )}

      {files.length < 3 && (
        <div
          className={`${classes["file-upload-input-box"]}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            multiple
            accept="image/jpeg, image/png, image/gif" // 이미지 파일만 선택하도록 제한
            onChange={handleFileChange}
            disabled={files.length >= 3}
            id="fileInput"
          />
          <label htmlFor="fileInput" style={{ cursor: "pointer" }} className="">
            <i className={`xi-plus`} />
            <span>(최대 3개까지 등록 가능)</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default FileUploadPreview;
