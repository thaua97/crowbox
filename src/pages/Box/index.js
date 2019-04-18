import React, { Component } from 'react'
import api from '../../services/api'
import io from '../../services/socket'
import { distanceInWords } from 'date-fns'
import pt from 'date-fns/locale/pt'
import Dropzone from 'react-dropzone'

 
import { MdInsertDriveFile } from 'react-icons/md'

import './styles.css';
import logo from '../../assets/Crowbox.svg'


export default class Box extends Component {
  state = { box: { } }

  async componentDidMount() {
    this.subscribeToNewFiles()

    const box = this.props.match.params.id
    const response = await api.get(`/boxes/${box}`)

    this.setState({ 
      box: response.data 
    })
  }

  subscribeToNewFiles = () => {
    const box = this.props.match.params.id
    
    io.emit('connectRoom', box)

    io.on('file', data => {
      this.setState({ 
        box: { 
          ...this.state.box, 
          files: [
            data, 
            ...this.state.box.files
          ]
        } 
      })
    })
    
  }


  handleUpload = (files) => {
    files.forEach(file => {
      const data = new FormData()
      const box = this.props.match.params.id

      data.append('file', file)

      api.post(`boxes/${box}/files`, data)
    });
  }
  
  render() {
    return (
      <div id="box-container">

        <header>
          <img src={logo} alt="" />
          <h1>{ this.state.box.title }</h1>
        </header>
        
        <Dropzone onDropAccepted={ this.handleUpload }>
          {( {getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()}/>
              <p> arraste aqui</p>
            </div>
          )}
        </Dropzone>

        <ul>
          { this.state.box.files && 
            this.state.box.files.map( file => (
            <li Key={file._id}>
              <a className="fileInfo" href={file.url} target="_BLANK">
                
                <MdInsertDriveFile size={24} color="#ff69b4" />
                
                <strong>{file.title}</strong>
              </a>
              <span>
                há{" "}
                {distanceInWords(file.createdAt, new Date(), {
                  locale: pt
                }) 
                }
              </span>
            </li>
          )) 
          }              
        </ul>
      </div>
    )
  }
}
