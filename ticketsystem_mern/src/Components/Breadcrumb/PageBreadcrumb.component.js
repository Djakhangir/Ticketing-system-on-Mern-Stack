import React from "react";
import {Breadcrumb} from "react-bootstrap";

const PageBreadcrumb = ({ pageName }) => {
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/"> Home </Breadcrumb.Item>
        <Breadcrumb.Item active> {pageName} </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
};

export default PageBreadcrumb;
