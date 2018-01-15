import React, { Component } from 'react';
import ActionCable from 'actioncable'
import logo from './logo.svg';
import './App.css';

const StayLow = {};
StayLow.cable = ActionCable.createConsumer('ws://localhost:8080/cable')

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { order: null, called: 0 };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Orders</h1>
        </header>
        <p className="App-intro">
          Called: {this.state.called}
        </p>
        <p className="App-intro">
          Newest Order Label: {this.state.order ? this.state.order.label : 'none'}
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
        setTimeout(() => this.perform('subscribed'), 1000);
        console.log('subscribed')
      },
      received: function (data) {
        this.updateOrderList(data.order);
      },
      updateOrderList: this.updateOrderList.bind(this)
    });
  }

  updateOrderList(order) {
    let parsed_order = JSON.parse(order);
    let newCalled = this.state.called + 1
    this.setState({ order: parsed_order, called: newCalled });
  }
}

export default App;
