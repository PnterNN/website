import React from "react";

const personalInfoContent = [
  { meta: "first name", metaInfo: "Kubilay" },
  { meta: "last name", metaInfo: "BALTAOĞLU" },
  { meta: "Age", metaInfo: "19 Years" },
  { meta: "Nationality", metaInfo: "Türkiye" },
  { meta: "Freelance", metaInfo: "Available" },
  { meta: "Address", metaInfo: "Türkiye İstanbul, Kartal" },
  { meta: "phone", metaInfo: "+90 505 061 75 99" },
  { meta: "Email", metaInfo: "kubilaybaltaoglu@gmail.com" },
  { meta: "Github", metaInfo: "PnterNN" },
  { meta: "langages", metaInfo: "Turkish, English" },
];

const PersonalInfo = () => {
  return (
    <ul className="about-list list-unstyled open-sans-font">
      {personalInfoContent.map((val, i) => (
        <li key={i}>
          <span className="title">{val.meta}: </span>
          <span className="value d-block d-sm-inline-block d-lg-block d-xl-inline-block">
            {val.metaInfo}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default PersonalInfo;
