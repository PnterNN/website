import React from "react";

const educationContent = [
  {
    year: "2015",
    degree: "HIGH SCHOOL",
    institute: "Kartal Final",
    details: ``,
  },
  {
    year: "will graduate in 2024",
    degree: "ASSOCIATE DEGREE",
    institute: "Istanbul Commerce University",
    details: `I am studying Computer Programming at Istanbul Commerce University`,
  },
/*  {
    year: "2009",
    degree: "BACHELOR DEGREE ",
    institute: "TUNIS HIGH SCHOOL",
    details: `Lorem ipsum dolor sit amet, tempor incididunt ut laboreconsectetur
        elit, sed do eiusmod tempor duntt`,
  },*/
];

const Education = () => {
  return (
    <ul>
      {educationContent.map((val, i) => (
        <li key={i}>
          <div className="icon">
            <i className="fa fa-briefcase"></i>
          </div>
          <span className="time open-sans-font text-uppercase">{val.year}</span>
          <h5 className="poppins-font text-uppercase">
            {val.degree}
            <span className="place open-sans-font">{val.institute}</span>
          </h5>
          <p className="open-sans-font">{val.details}</p>
        </li>
      ))}
    </ul>
  );
};

export default Education;
