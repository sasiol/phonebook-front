import React from 'react';
import axios from 'axios'

const Viewing = ({ persons, deletePerson }) => {
  return (
    <><h2>Numerot</h2><ul>
      {(persons.map(person => <Person key={person.name} person={person} deletePerson={deletePerson} />))}
    </ul></>
  )
}

const Adding = ({ addPerson, handleNameChange, handleNumeroChange, newName, newNumero }) => {
  return (
    <form onSubmit={addPerson}>
    <div>
      nimi: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
         numero: <input  value={newNumero} onChange={handleNumeroChange} />
    </div>
    <div>
      <button type="submit">lisää</button>
    </div>
  </form>
  )
}

const Person = ({ person, deletePerson}) => {
  return (
    <p>{person.name} {person.numero} <button onClick={(event)=>{deletePerson(event, person.id)}}> poista</button>  </p>
  )
}
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: '',
      newNumero: ''
    }
  }
  componentDidMount() {
    console.log('did mount')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        this.setState({ persons: response.data })
      })
  }
  deletePerson=(event, id)=>{
    event.preventDefault()
    console.log(id)
    
  axios.delete(`http://localhost:3001/persons/${id}`)
  .then(response=>{
    console.log(response.data)
    const persons = this.state.persons.filter((element)=> element.id !== id)
    
    this.setState({
      persons: persons
      })
  })}
  addPerson = (event) => {
    event.preventDefault()
  
    const personObject = {
      name: this.state.newName,
      numero:this.state.newNumero
    }
 
    console.log(this.state.persons.some(person=> person.name===personObject.name))
    if(( this.state.persons.some(person=> person.name===personObject.name))===false){
      axios.post('http://localhost:3001/persons', personObject)
      .then(response => {
        const persons = this.state.persons.concat(response.data)
    
        this.setState({
          persons: persons,
          newName: '',
          newNumero:''
        })
       
      })
    }else{ alert("Error:Nimi on jo listassa")}
  }
  handleNameChange = (event) => {
      
    console.log(event.target.value)
    this.setState({ newName: event.target.value })
  }
  handleNumeroChange = (event) => {
      
    console.log(event.target.value)
    this.setState({newNumero: event.target.value})
  }

  
  render() {
    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <Adding addPerson={this.addPerson}  handleNameChange={this.handleNameChange}
        handleNumeroChange={this.handleNumeroChange} newName={this.state.newName} newNumero={this.state.newNumero}/>
       <Viewing persons={this.state.persons} deletePerson={this.deletePerson} />
      </div>
    )
  }
}

export default App
