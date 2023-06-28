import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const PageBreadcrumb = ({ pageName }) => {
  return (
    <div>
      <Breadcrumb>
        <LinkContainer to="/">
          <Breadcrumb.Item > Home </Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active> {pageName} </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
};

export default PageBreadcrumb;
