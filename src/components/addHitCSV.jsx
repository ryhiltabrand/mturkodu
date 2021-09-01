/**
 * @file Handles the creation of hits from the web app
 * @author Ryan Hiltabrand <ryhiltabrand99@gmail.com>
 */

import React, { Component } from "react";
import AWS from "aws-sdk";
import Papa from "papaparse";

class AddHit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxAssignments: 0,
      lifeTimeInSeconds: 0,
      assignmentDurationInSeconds: 0,
      rewardInCents: 0.0,
      file: null,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }

  handleInputChange(event) {
    const target = event.target;
    let name = target.name;
    let value = target.value;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    alert(
      "you have inputed \n" +
        "Title: " +
        this.state.title +
        "\nDescription: " +
        this.state.description +
        "\nMax Assignments: " +
        this.state.maxAssignments +
        "\nLifetime In Seconds: " +
        this.state.lifeTimeInSeconds +
        "\nAssignment Duration In Seconds: " +
        this.state.assignmentDurationInSeconds +
        "\nReward: " +
        this.state.rewardInCents
    );

    this.queryParameter(this.fileInput.current.files[0]);
  };

  CreateHit(results) {
    for (let i = 0; results.length > i; i++) {
      let fileName = Object.values(results[i])[0];
      let caption = Object.values(results[i])[1];
      let inline_refrence = Object.values(results[i])[2];
      let path = Object.values(results[i])[4];
      
      var desc = `Please check the figure(${fileName}) and answer the following questions`;
      // Hit layout in xml form
      var xml = `<HTMLQuestion  xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2011-11-11/HTMLQuestion.xsd">
            <HTMLContent><![CDATA[
                <!DOCTYPE html>
            <html>
            <head>
                <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>
                <script type='text/javascript' src='https://s3.amazonaws.com/mturk-public/externalHIT_v1.js'></script>
            </head>
            <body>
                <form name='mturk_form' method='post' id='mturk_form' action='https://workersandbox.mturk.com/mturk/externalSubmit'>
                <input type='hidden' value='' name='assignmentId' id='assignmentId'/>
                <h1>Question for ${fileName} </h1>
                <b>Figure: </b>
                <img src="https://figures-odu-examples-8-27-2021.s3.amazonaws.com/${path}/${fileName}" alt="alternatetext">
                <p><b>Label: </b>${caption}</p>
                <p><b>InLine Refrences: </b>${inline_refrence}</p>

                
                <fieldset id= "div1" required>
                <label for= 'question1'> 1. Is this current content component a scientific figure or a table?</label><br>
                <select name = "question1" id = "question1" required>
                <option disabled selected value>Select an option</option>
                <option id="figure">Figure</option>
                <option id="table">Table</option>
                </select>
                <button onclick="myFunction()">confirm</button>
                <br>
                <br>
                
                
                <label for= 'question2'> 2. Is this current content component cropped correctly?</label><br>
                <select name = "question2" id = "question2" required>
                <option disabled selected value>Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                </select>
                <br>
                <br>
                

                <label for= 'question3'> 3. Is this <a id = 'name'></a> labeled correctly?</label><br>
                <script>
                    function myFunction(){
                        if (document.getElementById("figure").selected){
                            name = "figure";
                        } else if(document.getElementById("table").selected){
                            name = "table";
                        } else{
                            name = "[CONFIRM QUESTION 1]"
                        }
                        document.getElementById("name").innerHTML = name;
                }
                </script>
                <select name = "question3" id = "question3" required>
                <option disabled selected value>Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                </select>
                <br>
                <br>

                <label for= 'question4'> 4. What are the <b>explicit</b> meta-tags of this current content component </label><br>
                <input name = "question5" id = "question5" required></input>
                <br>
                <br>

                <label for= 'question5'> 5. What are the <b>implicit</b> meta-tags of this current content component </label><br>
                <input name = "question6" id = "question6" required></input>
                <br>
                <br>
                
                <p><input type='submit' id='submitButton' value='Submit' /></p></form>

                </fieldset>

                <script language='Javascript'>turkSetAssignmentID();</script>
            </body>
            </html>
            ]]>
            </HTMLContent>
                <FrameHeight>750</FrameHeight>
            </HTMLQuestion >`;

      AWS.config.update({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        region: "us-east-1",
        endpoint: "mturk-requester.us-east-1.amazonaws.com"
      });

      const mTurkClient = new AWS.MTurk();

      if (desc === undefined) {
        alert("You did not fill out all fields or confirm your selection");
      } else {
        var myHIT = {
          Title: fileName,
          Description: desc,
          MaxAssignments: this.state.maxAssignments,
          LifetimeInSeconds: this.state.lifeTimeInSeconds,
          AssignmentDurationInSeconds: this.state.assignmentDurationInSeconds,
          Reward: this.state.rewardInCents,
          Question: xml
          // Add a qualification requirement that the Worker must be either in Canada or the US
        };
        
      }
      mTurkClient.createHIT(myHIT, function (err, data) {
            if (err) {
                alert(err.message);
            } else {
                // Save the HITId printed by data.HIT.HITId and use it in the RetrieveAndApproveResults.js code sample
                console.log('HIT has been successfully published here: https://workersandbox.mturk.com/mturk/preview?groupId=' + data.HIT.HITTypeId + ' with this HITId: ' + data.HIT.HITId);
            }
          })
    }
  }

  resultSync = (results) => {
    this.CreateHit(results["data"]);
  };

  queryParameter = (file) => {
    let config = {
      header: true,
      complete: this.resultSync,
    };
    Papa.parse(file, config);
  };

  render() {
    return (
      <div className="HitAdder">
        <h1>Add a Hit</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Max Assignments: <br />
            <input
              name="maxAssignments"
              type="number"
              required
              checked={this.state.maxAssignments}
              onChange={this.handleInputChange}
            />
          </label>{" "}
          <br />
          <label>
            Lifetime In Seconds: <br />
            <input
              name="lifeTimeInSeconds"
              type="number"
              required
              checked={this.state.lifeTimeInSeconds}
              onChange={this.handleInputChange}
            />
          </label>{" "}
          <br />
          <label>
            Assignment Duration In Seconds: <br />
            <input
              name="assignmentDurationInSeconds"
              type="number"
              required
              checked={this.state.assignmentDurationInSeconds}
              onChange={this.handleInputChange}
            />
          </label>{" "}
          <br />
          <label>
            Reward In Cents(write 0.00 form): <br />
            <input
              name="rewardInCents"
              type="text"
              required
              checked={this.state.rewardInCents}
              onChange={this.handleInputChange}
            />
          </label>{" "}
          <br />
          <label>
            CSV file to upload <br />
            <input name="file" type="file" ref={this.fileInput} />
          </label>{" "}
          <br />
          <input type="submit" />
        </form>
      </div>
    );
  }
}
export default AddHit;