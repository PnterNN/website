import React from "react";

const SocialShare = [
  {
    iconName: "fa fa-github", link: "https://github.com/PnterNN",
  },
  { iconName: "fa fa-twitter", link: "https://twitter.com/PntherNN" },
  {
    iconName: "fa fa-linkedin", link: "https://www.linkedin.com/in/kubilay-baltao%C4%9Flu-a16a40276/",
  },
  { iconName: "fa fa-medium", link: "https://medium.com/@kubilaybaltaoglu" },
];

const Social = () => {
  return (
    <ul className="social list-unstyled pt-1 mb-5">
      {SocialShare.map((val, i) => (
        <li key={i}>
          <a href={val.link} target="_blank" rel="noreferrer">
            <i className={val.iconName}></i>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Social;
