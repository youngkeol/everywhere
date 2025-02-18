import { useState, useRef } from "react";
import classes from "./TagInput.module.css";

export default function TagInput({ tags, chageTagsHandler }) {
  // useRef를 사용하여 input 값을 저장
  const inputRef = useRef("");

  const addTag = () => {
    const inputValue = inputRef.current.value.trim();
    if (inputValue && !tags.includes(inputValue)) {
      chageTagsHandler([...tags, inputValue]);
      // input 값 초기화
      inputRef.current.value = "";  // inputRef로 값을 초기화
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 폼 제출 방지
      addTag();
    }
  };

  const removeTag = (tag) => {
    chageTagsHandler(tags.filter((t) => t !== tag));
  };

  return (
    <div className={`${classes["tags-input-box"]}`}>
      {tags.map((tag, index) => (
        <div key={index} className={`${classes["tags-box"]}`}>
          {tag}
          <button onClick={() => removeTag(tag)}>
            <i className={`xi-close-min`}> </i>
          </button>
        </div>
      ))}
      {tags.length < 5 &&
      <div className={`${classes["input-box"]}`}>
        <input
          ref={inputRef}
          type="text"
          //value={inputRef.current}  // inputRef로 값 설정
          //onChange={(e) => inputRef.current = e.target.value}  // input 값 변경 시 inputRef 업데이트
          onKeyDown={handleKeyDown}
          placeholder="태그 입력(최대 10자)"
        />
        <button onClick={addTag}>
          <i className={`xi-plus-min`}> </i>
        </button>
      </div>
      }
    </div>
  );
}