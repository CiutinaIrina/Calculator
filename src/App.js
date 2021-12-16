import './App.css';
import React, { Component } from 'react';
let operations = ["+", "-", "*", "/"];
let numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
let numbers2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];


function inArray(element, array) {
  if (array.indexOf(element) >= 0) {
    return true;
  }
  else{
    return false;
  }
}

function inf(char) {
  if (char === "Infinity") {
    return 1;
  }
  else if (char === "-Infinity") {
    return -1;
  }
  else {
    return 0;
  }
}

function s(number) {
  return number.toString();
}
function n(string) {
  return Number(string);
} 




class App extends Component {

  

  constructor(prop){
    super(prop);
    this.state = {
      display: "0",
      previous: null,
      characters: [],
      number: 0,
      first: true,
      inputZero: false,
      error: false
    }
      this.equal = this.equal.bind(this);
      //this.solveArray = this.solveArray.bind(this);
      this.typing = this.typing.bind(this);
      this.back = this.back.bind(this);
      this.reset = this.reset.bind(this);
  }

  typing(symbol) {
    this.setState({ characters: this.state.characters + symbol })
    if (inArray(symbol, numbers)) {
      if (this.state.number == 0) {
        this.state.previous = symbol;
      }
      
      else {
        this.state.previous = this.state.previous+ symbol;
      }
    }
    else{
      this.state.previous = 0;
    }
    this.setState({ number: this.state.previous });
  }

  stringify(array) {
    let string = `${array[0]}`;
    for (let i = 1; i < array.length; i++){
      string+=array[i]
    }
    return string;
  }

  componentDidUpdate() {
    console.log(this.state.characters)
    this.checkSigns();
  }

  back() {
    if (this.state.characters === "undefined" || this.state.characters === "Infinity" || this.state.characters === "" || this.state.characters === "-Infinity" || this.state.characters === "Error") {
      this.setState({characters: []});
    }
    else {
      let array = [...this.state.characters];
      array.pop();
      let string;
      if (array.length == 0) {
        string = "";
      } else {
        string = this.stringify(array);
      }
      this.setState({ characters: string })
      this.setState({ number: n(string) })
      this.setState({ previous: array})
    }
  }

  reset() {
    this.setState({ characters: [] });
    this.setState({ number: 0 });
  }

  equal() {
    let array = [];
    let string = this.state.characters;
    let l = string.length;
    let number = "";
    for (let i = 0; i < l; i++){
      if (inArray(string[i], numbers)) {
        number += string[i]
      }
      if (inArray(string[i], operations) || (string[i] === ".") || i === l-1) {
        number = n(number);
        array.push(number);
        number = "";
        if (!inArray(array[i], numbers)) {
          array.push(string[i]);
        }
      }
    }
    l = array.length;
    array.pop();
    l = array.length;
    if (!inArray(array[l-1], operations) && array[l-1]!==".") {
      while (inArray(".", array)) {
        let i = array.indexOf(".");
        let j = 1;
        while (array[i + 1] % 10 === 0) {
          array[i + 1] /= 10;
        }
        let num = array[i + 1];
        while (num > 1) {
          num /= 10;
          j *= 10;
        }
        let decimal = array[i + 1] / j;
        if (inArray(array[i - 1], operations)) {
          array[i] = 0 + decimal;
          array.splice(i, 1);

        }
        else {
          array[i - 1] += decimal;
          array.splice(i, 1);
          array.splice(i, 1);
        }
      }
      while (inArray("/", array) || inArray("*", array)) {
        let i = array.indexOf("/");
        let j = array.indexOf("*");
        if ((i < j && i >= 0) || (i >= 0 && j < 0)) {
          let result = array[i - 1] / array[i + 1];
          if (array[i + 1] === 0) {
            result = "Infinity"
          }
          
          if (array[i - 1] === "Infinity" && array[i + 1] !== "Infinity") {
            result = "Infinity"
          }
          if (array[i - 1] === "infinity" && array[i + 1] === "Infinity") {
            this.setState({ error: true });
          }
          array.splice(i, 1);
          array.splice(i, 1);
          array[i - 1] = result;
        }
        else if (j >= 0) {
          let result = array[j - 1] * array[j + 1];
          array.splice(j, 1);
          array.splice(j, 1);
          array[j - 1] = result;
        }
        console.log(array);
      }
      while (inArray("-", array)) {
        let i = array.indexOf("-");
        if (inf(array[i + 1] === 1)) {
          array[i + 1] = "-Infinity"
        }
        else if (inf(array[i + 1] === -1)) {
          array[i+1] = "Infinity"
        }
        else {
          array[i + 1] *= -1;
        }
        array[i] = "+";
      }
      let result = array[0];
      for (let i = 2; i < array.length; i += 2) {
        if (array[i] === "Infinity" && result === "Infinity") {
          result = "Infinity"
        }//cazul infinit si infinit
        else if (array[i] == "Infinity" && result != "Infinity" && result != "-Infinity") {
          
          result = "Infinity"
        }//cazul infinit si a
        else if (array[i] != "Infinity" && array[i] != "-Infinity" && result == "Infinity") {
          result = "Infinity"
        }//cazul a si infinit
        else if (array[i] == "-Infinity" && result == "-Infinity") {
          result = "Error";
          break;
        }//cazul -infinit si -infinit
        else if (array[i] == "-Infinity" && result != "Infinity" && result != "-Infinity") {
          result = "-Infinity"
          //alert(1)
        }//cazul -infinit si a
        else if (array[i] != "Infinity" && result == "-Infinity") {
          result = "-Infinity"
          //alert(2)
        }//cazul a si -infinit
        else if (array[i] == "-Infinity" && result == "Infinity") {
          result = "Error";
          break;
        }//cazul -infinit si infinit
        else if (array[i] == "Infinity" && result == "-Infinity") {
          result = "Error";
          break;
        }//cazul infinit si -infinit
        else if(result != "Infinity" && result != "-Infinity" && array[i] != "Infinity" && array[i] != "-Infinity"){
          result += array[i];
        }
      }
      if (this.state.error === true) {
        result = "Error";
      }
      else {
        this.setState({ characters: `${result}` })
        this.setState({ number: result })
        this.setState({previous: result})
      }
    }
    else {
      this.setState({ characters: `${this.stringify(array)}` })
    }
  }

  checkSigns() {
    let array = [...this.state.characters];
    let l = array.length;
    if ((inArray(array[l - 1], operations) && inArray(array[l - 2], operations)) || ((array[l-1] === ".") && (array[l-2] === "."))) {
      array[l - 2] = array[l - 1];
      array.pop();
      let string = this.stringify(array);
      this.setState({ characters: string})
    }
  }


  render() {
    return (
      <div>
        <div className="display">
          <p className="fade">{ this.state.number}</p>
          <p>{this.state.characters}</p>

        </div>
        <div className="df">
          <div>
            <div className="df">
              <div>
                <button className="button2X1" onClick={() => this.back()}>C</button>
                <div className="df">
                  <button className="button1X1" onClick={() => this.typing('1')}>1</button>
                  <button className="button1X1" onClick={() => this.typing('2')}>2</button>
                </div>
              </div>
              <div className="df">
                <div>
                  <div><button className="button1X1" onClick={() => this.reset()}>R</button></div>
                  <div><button className="button1X1" onClick={() => this.typing('3')}>3</button></div>
                </div>
                <button className="button1X2" onClick={() => this.typing('+')}>+</button>
              </div>
            </div>
            <div className="df">
              <button className="button1X1" onClick={() => this.typing('4')}>4</button>
              <button className="button1X1" onClick={() => this.typing('5')}>5</button>
              <button className="button1X1" onClick={() => this.typing('6')}>6</button>
              <button className="button1X1" onClick={() => this.typing('-')}>-</button>
            </div>
            <div className="df">
              <button className="button1X1" onClick={() => this.typing('7')}>7</button>
              <button className="button1X1" onClick={() => this.typing('8')}>8</button>
              <button className="button1X1" onClick={() => this.typing('9')}>9</button>
              <button className="button1X1" onClick={() => this.typing('*')}>*</button>
            </div>
            <div>
              <button className="button1X1" onClick={() => this.equal()}>=</button>
              <button className="button1X1" onClick={() => this.typing('0')}>0</button>
              <button className="button1X1" onClick={() => this.typing('.')}>.</button>
              <button className="button1X1" onClick={() => this.typing('/')}>/</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
