import React, { useState, useRef } from "react";
import AddressSearch from "../AddressSearch/AddressSearch";
import SlateEditor from "../SlateEditor/SlateEditor";
import Button from "../UI/Button";
import classes from "./AddModal.module.css";
import FileUploadPreview from "../FileUploadPreView/FileUploadPreview";
import TagInput from "../TagInput/TagInput";
import {fetchAddMyPlaces} from '@/src/lib/myPlaces/myPlacesApi';
import RadioInput from "../RadioInput/RadioInput";


const AddModal = ({ closeModalHandler }) => {
  const [address, setAddress] = useState();
  const titleRef = useRef();
  const [contents, setContents] = useState();
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [openFlag, setOpenFlag] = useState(1);
  
  //주소 입력 
  const chageAddressHandler = async (address) => {
    console.log(address)
    setAddress(address);
  }

  //컨텐츠 입력
  const chageContentsHandler = (content) => {
    setContents(content);
  }
  //파일 입력
  const chageFilesHandler = (files) => {
    setFiles(files);
  }
  //태그 입력
  const chageTagsHandler = (tags) => {
    setTags(tags)
  }

  const chageOpenFlagHandler = (flag) => {
    setOpenFlag(flag);
  }
  const addMyPlaceHandler = async (e) => {
    e.preventDefault();


    const title = titleRef.current.value;
    if(!address) {
      alert("주소 필수입력");
      return false;
    }

    if(!title){
      alert("타이틀 필수입력");
      return false;
    }


    const htmlContent = convertToHtml(contents);

    try {
      //등록진행
      const addMyplacesRes = await fetchAddMyPlaces(address, title, htmlContent, files, tags, openFlag);
      if(addMyplacesRes.success ){
        closeModalHandler(); // 실행
        window.location.reload();
      }
    }catch(error) {
      console.log(error)

      //throw new Error('등록 실패');
      alert(error)
      alert("알수 없는 이유로 등록이 실패했습니다.")
    }finally{
    }


  }



  const convertToHtml = (content) => {
    return content.map(item => {
      // 각 항목의 타입에 맞는 HTML을 생성
      switch (item.type) {
        case "paragraph":
          return `<p style="text-align: ${item.align || 'left'};">${item.children.map(child => convertTextStyles(child)).join('')}</p>`;
        case "heading-one":
          return `<h1>${item.children.map(child => convertTextStyles(child)).join('')}</h1>`;
        case "heading-two":
          return `<h2>${item.children.map(child => convertTextStyles(child)).join('')}</h2>`;
        case "numbered-list":
          return `<ol>${item.children.map(child => `<li>${child.children.map(subChild => convertTextStyles(subChild)).join('')}</li>`).join('')}</ol>`;
        case "bulleted-list":
          return `<ul>${item.children.map(child => `<li>${child.children.map(subChild => convertTextStyles(subChild)).join('')}</li>`).join('')}</ul>`;
        case "block-quote":
          return `<blockquote>${item.children.map(child => convertTextStyles(child)).join('')}</blockquote>`;
        default:
          return '';
      }
    }).join('');
  }
  
  const convertTextStyles = (child) => {
    let text = child.text;
  
    // 스타일을 추가하기 위한 래핑
    if (child.bold) {
      text = `<strong>${text}</strong>`;
    }
    if (child.italic) {
      text = `<em>${text}</em>`;
    }
    if (child.underline) {
      text = `<u>${text}</u>`;
    }
    if (child.code) {
      text = `<code>${text}</code>`;
    }
  
    return text;
  }



  return (
    <div>
      <div className={`${classes["modal-header"]}`}>
        <h3 className={`${classes["modal-tit"]}`}>나의 장소 등록하기</h3>
        <button
          className={`${classes["modal-close-btn"]}`}
          onClick={closeModalHandler}
        >
          <i className={`xi-close-min`}></i>
        </button>
      </div>
      <div className={`${classes["modal-body"]}`}>
        <div className={`${classes["modal-each-con"]}`}>
          <AddressSearch 
          address={address}
          chageAddressHandler={chageAddressHandler} />
        </div>

        <div className={`${classes["modal-each-con"]}`}>
          <input placeholder="제목을 입력하세요." 
            ref={titleRef}
          />
        </div>

        <div className={`${classes["modal-each-con"]}`}>
          <SlateEditor 
            chageContentsHandler= {chageContentsHandler}
          />
        </div>

        <div className={`${classes["modal-each-con"]}`}>
          <FileUploadPreview 
            files = {files}
            chageFilesHandler = {chageFilesHandler}
          />
        </div>


        <div className={`${classes["modal-each-con"]}`}>
          <TagInput tags={tags} chageTagsHandler={chageTagsHandler} />
        </div>

        <div className={`${classes["modal-each-con"]}`}>
          <RadioInput 
            option1 ={`공개`}
            description1={`다른 사용자에게 추천되거나 목록에 표시될 수 있습니다.`}
            option2 ={`비공개`}
            description2={`다른 사용자에게 표시되지 않습니다.`}
            openFlag = {openFlag}
            chageOpenFlagHandler = {chageOpenFlagHandler}
          />

        </div>
      </div>
      <div className={`${classes["modal-footer"]}`}>
        <Button title={`등록하기`} size={`big`} 
          onClick={addMyPlaceHandler}
        />
      </div>
    </div>
  );
};

export default AddModal;
