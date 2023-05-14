import { useState, React } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';

const CreditCardForm = () => {
  const [state, setState] = useState({
    pan: '',
    expiry: '',
    cvc: '',
    type: 'mastercard',
    name: '',
    focus: ''
  });
  const notifyError = () => toast.error('Card details invalid!', {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "light",
    });

    const notifySuccess = () => toast.success('Card details valid!', {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
      });

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    let formattedValue = value;

    // Add a '/' to the expiry date input, so users can read it more easily
    if (name === 'expiry') {
      if (value.length === 2 && state.expiry.length === 1) {
        formattedValue = value + '/';
      } else if (value.length === 2 && state.expiry.length === 3) {
        formattedValue = value.slice(0, 1);
      }
    }

    // Add spaces to the PAN input, so users can read it more easily
    if (name === 'pan') {
      if (state.type === 'american-express') {
        if (value.length === 4 && state.pan.length === 3) {
          formattedValue = value + ' ';
        }
        if (value.length === 11 && state.pan.length === 10) {
          formattedValue = value + ' ';
        }
      }
      else {
        if (value.length === 4 && state.pan.length === 3) {
          formattedValue = value + ' ';
        }
        if (value.length === 9 && state.pan.length === 8) {
          formattedValue = value + ' ';
        }
        if (value.length === 14 && state.pan.length === 13) {
          formattedValue = value + ' ';
        }
      }
    }

    setState((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    // Gather the data from state
    const { name, pan, expiry, cvc, type } = state;

    // Send the data to the server for validation
    const response = await fetch('http://localhost:9000/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, pan, expiry, cvc, type }),
    });

    // Await the response from the server
    const data = await response.json();

    // Check if the response was ok (200)
    if (response.ok) {
      // Release the validation errors
      // Since the response doesn't bring errors inside, it's gonna clean the errors on the interface
      notifySuccess();
      setState((prev) => ({ ...prev, errors: data.errors }));
    } else {
      //console.error('Validation failed:', data);
      notifyError();
      setState((prev) => ({ ...prev, errors: data.errors }));
    }
  }

  const handleCardTypeChange = (evt) => {
    /* This just handles the card type change visual */
    const { value } = evt.target;
    let issuer = '';

    if (value === 'mastercard') {
      issuer = 'mastercard';
    }

    if (value === 'american-express') {
      issuer = 'american-express';
    }

    if (value === 'visa') {
      issuer = 'visa';
    }

    setState((prev) => ({ ...prev, type: value, issuer: issuer }));
  }

  return (
    <div>
      <div className='text-center mt-5'>
        <h1>Enter your payment details</h1>
        <h4>Please input your information below</h4>
        {state.type === 'american-express' && (
          <span className="text-muted">* You're using American Express make sure your Card Number starts with 34 or 37 and your CVC has 4 digits.</span>
        )}
      </div>
      <div className="row mt-5 text-center">
        <div className="col-md-12">
          <Cards className=""
            number={state.pan}
            expiry={state.expiry}
            cvc={state.cvc}
            name={state.name}
            focused={state.focus}
            issuer={state.issuer == null ? 'mastercard' : state.issuer}
            preview={true} // enable card preview
            useAnimations={true} // enable animations
          />
        </div>
      </div>
      <div className='container mt-2'>
        <form onSubmit={handleSubmit}>
          <div className='row'>
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="pan">Name:</label>
                <input className="form-control"
                  id="name"
                  type="name"
                  name="name"
                  placeholder="e.g. David Coimbra"
                  value={state.name}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                required
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="pan">Card Number:</label>
                <input className="form-control"
                  id="pan"
                  type="pan"
                  name="pan"
                  placeholder="e.g. 5555 3412 4444 1115"
                  value={state.pan}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
                {state.errors && (
                  <span style={{ color: 'red' }}>{state.errors.cardNumber}</span>
                )}
              </div>
            </div>
            <div className="col-4">
              <div className="form-group">
                <label htmlFor="type">Card Type:</label>
                <select className="form-select" id="type" name="type" value={state.type} onChange={handleCardTypeChange} onFocus={handleInputFocus}>
                  <option defaultChecked value="mastercard">Mastercard</option>
                  <option value="visa">Visa</option>
                  <option value="american-express">American Express</option>
                </select>
                {state.errors && (
                  <span style={{ color: 'red' }}>{state.errors.cardType}</span>
                )}
              </div>
            </div>
            <div className="col-4">
              <div className="form-group">
                <label htmlFor="expiry">Expiration Date:</label>
                <input className="form-control"
                  id="expiry"
                  type="expiry"
                  name="expiry"
                  placeholder="e.g. 12/23 or 12/2023"
                  value={state.expiry}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
                {state.errors && (
                  <span style={{ color: 'red' }}>{state.errors.cardExpiryDate}</span>
                )}
              </div>
            </div>
            <div className="col-4">
              <div className="form-group">
                <label htmlFor="cvc">CVC:</label>
                <input className="form-control"
                  id="cvc"
                  type="cvc"
                  name="cvc"
                  placeholder="e.g. 737"
                  value={state.cvc}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
                {state.errors && (
                  <span style={{ color: 'red' }}>{state.errors.cardCvcCode} {state.errors.cardCvcCodeAmex}</span>
                )}
              </div>
            </div>
            <button className="mt-4 btn btn-primary" type="submit">Send</button>
          </div>
        </form >
      </div >
    </div>
  );

}

export default CreditCardForm;