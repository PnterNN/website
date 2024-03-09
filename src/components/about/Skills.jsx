import React from "react";

const skillsContent = [
  { skillClass: "p80", skillPercent: "80", skillName: "JAVA" },
  { skillClass: "p75", skillPercent: "75", skillName: "REDIS" },
  { skillClass: "p80", skillPercent: "80", skillName: "SQL" },
  { skillClass: "p70", skillPercent: "70", skillName: "C#" },
  { skillClass: "p45", skillPercent: "45", skillName: "C++" },
  { skillClass: "p50", skillPercent: "50", skillName: "HTML CSS JS" },
  { skillClass: "p65", skillPercent: "65", skillName: "PYTHON" },
  { skillClass: "p60", skillPercent: "60", skillName: "DOCKER" },
];

const Skills = () => {
  return (
    <>
      {skillsContent.map((val, i) => (
        <div className="col-6 col-md-3 mb-3 mb-sm-5" key={i}>
          <div className={`c100 ${val.skillClass}`}>
            <span>{val.skillPercent}%</span>
            <div className="slice">
              <div className="bar"></div>
              <div className="fill"></div>
            </div>
          </div>
          <h6 className="text-uppercase open-sans-font text-center mt-2 mt-sm-4">
            {val.skillName}
          </h6>
        </div>
      ))}
    </>
  );
};

export default Skills;
