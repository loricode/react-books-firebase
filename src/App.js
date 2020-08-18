import React, { Component } from 'react';
import { firebaseConfig } from './database/firebase';
import * as firebase from "firebase/app" //npm i firebase
import 'firebase/firestore';

const db = firebase.initializeApp(firebaseConfig);

class App extends Component {
  constructor() {
  super()
  this.addBook = this.addBook.bind(this)
  this.state = { ListBook:[], name:'', edition:'', id:'', bandera:true }
}

componentDidMount() { this.getBooks() }

 async getBooks(){
  let list = [];  
  const response = await db.firestore().collection('books').get()
        response.forEach( document => {
        let id = document.id
        let name = document.data().name
        let edition = document.data().edition
        let obj = { id, name, edition }
        list.push(obj);
      })
      this.setState({ ListBook:list })
 }

async addBook(event){
    event.preventDefault()
    const { id, name, edition } = this.state
    const obj = { name, edition }
    if(this.bandera){
      await db.firestore().collection('books').add( obj )
      this.getBooks()
      this.setState({name:'',edition:''}) 
    }else{
      await db.firestore().collection('books').doc(id).update( obj )
      this.getBooks()
      this.setState({name:'',edition:'',id:'', bandera:true}) 
    }
    
 }


async deleteBook(book){
   if(window.confirm("Estas seguro Que quieres Eliminar")){
       await db.firestore().collection('books').doc(book.id).delete();
       this.getBooks()
    }
  }

async getBook(book){
  const res = await db.firestore().collection('books').doc(book.id).get();
  this.setState(
       { id:res.id, 
        name:res.data().name,
        edition:res.data().edition, 
        bandera:false })
}

 render(){
   
  return (
     <div className="container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
        <div className="container">
          <a className="navbar-brand" href="/">CRUD REACT JS Y FIREBASE</a>
       </div>
      </nav>
      <form className="card m-3 p-2" >
        <input placeholder="Name book" className="form-control mb-2"
               value={this.state.name}
               onChange={(e) => this.setState({name:e.target.value})}/>

        <input placeholder="edition book" className="form-control mb-2"
               value={this.state.edition}
               onChange={(e) => this.setState({edition:e.target.value})}/>

        <button className="btn btn-dark" onClick={this.addBook}>
               {this.bandera?'add book':'Edit Book'}</button>  
      </form>

       <ul className="list-group m-3">
           { this.state.ListBook.map(book => (
            <li className="list-group-item" key={book.id}>
            <p className="font-weight-bold"><span>Name: </span>{book.name}</p>
            <p className="font-weight-bold"><span>Edition: </span>{book.edition}</p>
           <div className="d-flex flex-row-reverse">
             <button className="btn btn-secondary ml-2" 
                onClick={this.deleteBook.bind(this,book)} >Delete</button> 
                <button className="btn btn-dark" 
                onClick={this.getBook.bind(this,book)} >Update</button>  
           </div>
          
          
           

            </li>
            )) }
       </ul>
     </div>
  );
 }
}

export default App;
