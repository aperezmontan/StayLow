import React, { Component } from 'react';
import ActionCable from 'actioncable'
import logo from './logo.svg';
import './App.css';

const StayLow = {};
StayLow.cable = ActionCable.createConsumer('ws://localhost:8080/cable')

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { order: null };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Orders</h1>
        </header>
        <p className="App-intro">
          { this.state.orders }
        </p>
      </div>
    );
  }

  componentDidMount() {
    this.setupSubscription();
  }

  setupSubscription() {
    StayLow.orders = StayLow.cable.subscriptions.create("OrderChannel", {
      connected: function () {
        console.log('connected')
      },
      received: function (data) {
        this.updateOrderList(data.order);
      },
      updateOrderList: this.updateOrderList.bind(this)
    });
  }

  updateOrderList(order) {
    let parsed_order = JSON.parse(order);
    this.setState({ order: parsed_order });
  }
}

export default App;
