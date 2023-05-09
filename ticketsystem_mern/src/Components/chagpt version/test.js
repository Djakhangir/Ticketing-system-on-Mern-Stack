// This code creates a React component for the building management app. 
// It defines the issue types in an array and uses two useState hooks to keep track of the selected issue, 
// the issue description, and the uploaded media. 
// It also provides event handlers for the dropdown menu, textarea, and file input to update the corresponding state variables 
// when the user interacts with them. Finally, the handleSubmit function sends the selected issue, description, 
// and media to the server for processing when the user clicks the submit button.

import React, { useState } from "react";

const issueTypes = ["Plumbing", "Electrical", "Carpentry", "Painting"];

const BuildingManagementApp = () => {
    const [selectedIssue, setSelectedIssue] = useState("");
    const [issueDescription, setIssueDescription] = useState("");
    const [media, setMedia] = useState(null);

    const handleIssueSelection = event => {
        setSelectedIssue(event.target.value);
    };

    const handleIssueDescription = event => {
        setIssueDescription(event.target.value);
    };

    const handleMediaUpload = event => {
        setMedia(event.target.files[0]);
    };

    const handleSubmit = () => {
        // Send the selected issue, description, and media to the server for processing
        console.log("Selected issue: ", selectedIssue);
        console.log("Issue description: ", issueDescription);
        console.log("Uploaded media: ", media);
    };

    return ( <
            div >
            <
            h2 > Building Management App < /h2> <
            select value = { selectedIssue }
            onChange = { handleIssueSelection } >
            <
            option value = "" > Select an issue type < /option> {
            issueTypes.map(issue => ( <
                option key = { issue }
                value = { issue } > { issue } <
                /option>
            ))
        } <
        /select> <
    br / >
        <
        br / >
        <
        textarea placeholder = "Enter a description of the issue"
    value = { issueDescription }
    onChange = { handleIssueDescription }
    /> <
    br / >
        <
        br / >
        <
        input type = "file"
    onChange = { handleMediaUpload }
    /> <
    br / >
        <
        br / >
        <
        button onClick = { handleSubmit } > Submit < /button> < /
        div >
);
};

export default BuildingManagementApp;


// import React, { useState } from "react";

// const users = [
//   {
//     username: "user1",
//     password: "password1",
//     userType: "Type1"
//   },
//   {
//     username: "user2",
//     password: "password2",
//     userType: "Type2"
//   }
// ];

// const LoginPage