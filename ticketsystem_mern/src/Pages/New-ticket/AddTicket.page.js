import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import PageBreadcrumb from "../../Components/Breadcrumb/PageBreadcrumb.component";
import AddNewTicketForm from "../../Components/AddNewTicketForm/AddNewTicketForm.component";
import { shortText } from "../../Utils/Validation";

const initialData = {
  subject: "",
  issuedate: "",
  details: "",
};
const initialErrorData = {
  subject: false,
  issuedate: false,
  details: false,
};

const AddTicket = () => {
  const [formData, setformData] = useState(initialData);
  const [formErrorData, setformErrorData] = useState(initialErrorData);

  useEffect(() => {}, [formData, formErrorData]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setformData({
      ...formData,
      [name]: value,
    });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setformErrorData(initialErrorData)
    const isSubjectValid = await shortText(formData.subject);
    setformErrorData({
      ...initialErrorData,
      subject: !isSubjectValid,
    });
    console.log("Form is recieved", formData);
  };

  return (
    <Container>
      <Row>
        <Col>
          <PageBreadcrumb pageName="New Ticket" />
        </Col>
      </Row>
      <Row>
        <Col>
          <AddNewTicketForm
            handleOnSubmit={handleOnSubmit}
            handleOnChange={handleOnChange}
            formData={formData}
            formErrorData={formErrorData}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AddTicket;
