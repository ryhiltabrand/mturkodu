var AWS = require("aws-sdk");
const algo = [
  "algorithms/C00-2139.pdf-Figure2.png",
  "algorithms/C02-1014.pdf-Figure1.png",
  "algorithms/C02-1144.pdf-Figure1.png",
  "algorithms/C02-1158.pdf-Figure1.png",
  "algorithms/C04-1020.pdf-Figure1.png",
  "algorithms/C04-1020.pdf-Figure3.png",
  "algorithms/C04-1024.pdf-Figure3.png",
  "algorithms/C04-1024.pdf-Figure4.png",
  "algorithms/Y18-2004.pdf-Figure2.png",
  "algorithms/Y18-1087.pdf-Figure4.png",
];
const arch = [
  "architecture diagram/1994.amta-1.18.pdf-Figure1.png",
  "architecture diagram/1994.amta-1.6.pdf-Figure1.png",
  "architecture diagram/2007.sigdial-1.41.pdf-Figure1.png",
  "architecture diagram/2016.jeptalnrecital-jep.38.pdf-Figure1.png",
  "architecture diagram/2016.lilt-13.3.pdf-Figure2.png",
  "architecture diagram/N15-1102.pdf-Figure1.png",
  "architecture diagram/O04-3006.pdf-Figure3.png",
  "architecture diagram/O06-3004.pdf-Figure1.png",
  "architecture diagram/O06-3004.pdf-Figure5.png",
  "architecture diagram/O01-2001.pdf-Figure1.png",
];
const graph = [
  "graph/2020.scil-1.11.pdf-Figure1.png",
  "graph/2020.scil-1.11.pdf-Figure5.png",
  "graph/2020.scil-1.11.pdf-Figure7.png",
  "graph/C00-1054.pdf-Figure5.png",
  "graph/C04-1022.pdf-Figure1.png",
  "graph/C04-1096.pdf-Figure4.png",
  "graph/D13-1130.pdf-Figure1.png",
  "graph/D19-3027.pdf-Figure16.png",
  "graph/D19-3027.pdf-Figure9.png",
  "graph/2020.scil-1.25.pdf-Figure6.png",
];

function CreateHit(arr, assignments, lifetime, duration, reward) {
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: "us-east-1",
    endpoint: "https://mturk-requester-sandbox.us-east-1.amazonaws.com/",
  });

  for (let i = 0; i < arr.length; i++) {
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: "us-east-1",
      endpoint: "https://mturk-requester-sandbox.us-east-1.amazonaws.com/",
    });
    const mTurkClient = new AWS.MTurk();
    var path = arr[i];
    var title = arr[i].split("/").pop();
    console.log(title);
    var desc = `Please check the figure(${title}) and answer the following questions`;
    console.log(desc);

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
                <h1>Example Question</h1>
                <img src="https://figures-odu-examples-6-27-2021.s3.amazonaws.com/${path}" alt="alternatetext"> 
                
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
                

                <label for= 'question3-4'> 3-4. Is this <a id = 'name'></a> labeled correctly?</label><br>
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
                <select name = "question3-4" id = "question3-4" required>
                <option disabled selected value>Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                </select>
                <br>
                <br>

                <label for= 'question5'> 5. What are the <b>explicit</b> meta-tags of this current content component </label><br>
                <input name = "question5" id = "question5" required></input>
                <br>
                <br>

                <label for= 'question6'> 6. What are the <b>implicit</b> meta-tags of this current content component </label><br>
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

    if (
      title === undefined ||
      desc === undefined ||
      assignments === undefined ||
      lifetime === undefined ||
      duration === undefined ||
      reward === undefined
    ) {
      console.log("You did not fill out all fields or confirm your selection");
    } else {
      var myHIT = {
        Title: title,
        Description: desc,
        MaxAssignments: assignments,
        LifetimeInSeconds: lifetime,
        AssignmentDurationInSeconds: duration,
        Reward: reward,
        Question: xml,
        // Add a qualification requirement that the Worker must be either in Canada or the US
      };
    }

    mTurkClient.createHIT(myHIT, function (err, data) {
      //console.log(myHIT)
      if (err) {
        console.log("hi");
        console.log(err.message);
      } else {
        console.log(data);
        // Save the HITId printed by data.HIT.HITId and use it in the RetrieveAndApproveResults.js code sample
        console.log(
          "HIT has been successfully published here: https://workersandbox.mturk.com/mturk/preview?groupId=" +
            data.HIT.HITTypeId +
            " with this HITId: " +
            data.HIT.HITId
        );
      }
    });
  }
}

CreateHit(arch, 15, 86400, 3600, "0.10");
