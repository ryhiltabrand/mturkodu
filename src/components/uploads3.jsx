import React, { Component } from "react";
import S3 from "react-aws-s3";


class S3upload extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    //const s3 = new S3upload();
    event.preventDefault();
    this.upload(this.fileInput.current.files[0]);
  };
    

  upload = (file) => {
    console.log(file.name);
    let fileName = file.name;

    
    const config = {
      bucketName: "figures-odu-examples-6-27-2021",
      region: "us-east-1",
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    };
    //console.log(config)
    const ReactS3Client = new S3(config);

    ReactS3Client.uploadFile(file, fileName)
      .then(data => console.log(data))
      .catch(err => console.error(err)); 
  }
  render() {
    return (
      <div className="upload">
        
        <form onSubmit={this.handleSubmit}>
          <label>
            Images to upload <br />
            <input name="file" type="file" ref={this.fileInput} />
          </label>{" "}
          <br />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default S3upload;
