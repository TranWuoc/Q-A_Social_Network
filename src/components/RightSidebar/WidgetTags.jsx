import React from "react";
import "./RightSidebar.css";
import "./WidgetTags.css";
const WidgetTags = () => {


  return (
    
    <div className="cardWidgeTags">
      <span className="title">All tags</span>
      <div className="card__tags">
        <ul >
          <li className="tag__name">JS</li>
          <li className="tag__name">wordpress</li>
          <li className="tag__name">uiverse</li>
          <li className="tag__name">Css</li>
          <li className="tag__name">html</li>
          <li className="tag__name">go</li>
          <li className="tag__name">java</li>
          <li className="tag__name">ux/ui</li>
          <li className="tag__name">figma</li>
        </ul>
      </div>
    </div>
  );
};

export default WidgetTags;
