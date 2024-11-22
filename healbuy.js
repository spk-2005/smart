import React, { useState, useEffect } from 'react';
import Airtable from 'airtable';
import './envibuy.css';

export default function Healbuy() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
  });

  useEffect(() => {
    // Airtable API setup
    const base = new Airtable({ apiKey: 'pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061' }).base('appfQNmAs6vTN5iAn');
    
    // Fetch records where prname is "environment"
    base('selling')
      .select({
        filterByFormula: `{prname} = 'environment'`,
      })
      .all() // Fetch all records instead of just the first page
      .then(records => {
        console.log(`Number of records fetched: ${records.length}`); // Log the number of records

        const productsData = records.map(record => ({
          id: record.id,
          productid: record.fields.productid,
          image: record.fields.image[0]?.url, // Assuming 'image' is an array
          productName: record.fields.productname,
          price: record.fields.price,
          content: record.fields.content,
        }));

        setProducts(productsData); // Set the fetched records to state
      })
      .catch(err => {
        console.error(err); // Log any error
      });
  }, []);
  
  const handleBuy = (product) => {
    // Get name and email from localStorage
    const storedName = localStorage.getItem('name');
    const storedEmail = localStorage.getItem('email');

    // Pre-fill formData with stored values
    setFormData({
      ...formData,
      name: storedName || '',
      email: storedEmail || '',
    });

    // Get the user's current location
    getUserLocation();

    // Check if mobile and address exist in orders table
    const base = new Airtable({ apiKey: 'pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061' }).base('appfQNmAs6vTN5iAn');
    
    if (storedName && storedEmail) {
      base('orders').select({
        filterByFormula: `{name} = '${storedName}'`,
      }).firstPage((err, records) => {
        if (err) {
          console.error(err);
          return;
        }

        if (records.length > 0) {
          const userRecord = records[0].fields;
          if (!userRecord.mobile || !userRecord.address) {
            // If mobile or address is missing, ask for them
            setSelectedProduct(product);
            setShowModal(true);
          } else {
            // All data exists, place the order
            alert('User has all necessary details. Proceeding with order.');
            placeOrder(product, userRecord);
          }
        } else {
          // If user doesn't exist, ask for mobile and address
          setSelectedProduct(product);
          setShowModal(true);
        }
      });
    } else {
      // If no name or email in localStorage, ask for all details
      setSelectedProduct(product);
      setShowModal(true);
    }
  };

  // Function to get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Use Google Maps Geocoding API to convert latitude/longitude to address
          getAddressFromCoords(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location: ', error);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Function to fetch address from coordinates
  const getAddressFromCoords = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    const latLng = { lat: lat, lng: lng };

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          const address = results[0].formatted_address;
          // Pre-fill the address field
          setFormData((prevData) => ({
            ...prevData,
            address: address,
          }));
        } else {
          alert('No results found');
        }
      } else {
        alert('Geocoder failed due to: ' + status);
      }
    });
  };
  const handleSubmit = () => {
    const currentDate = new Date().toLocaleDateString(); // Format: MM/DD/YYYY
    const currentTime = new Date().toLocaleTimeString(); // Format: HH:MM:SS AM/PM
    const base = new Airtable({ apiKey: 'your_airtable_api_key' }).base('appfQNmAs6vTN5iAn');
  
    base('orders').create(
      {
        name: formData.name,
        email: formData.email,
        mobilenumber: formData.mobile,
        address: formData.address,
        productname: selectedProduct.productName,
        productid: selectedProduct.productid,
        date: currentDate,
        time: currentTime,
      },
      (err, record) => {
        if (err) {
          console.error(err);
          return;
        }
        alert('Order placed successfully.');
  
        // After placing the order, send an SMS
        sendSms(formData.mobile, selectedProduct.productName);
  
        setShowModal(false);
      }
    );
  };
  
  const sendSms = (mobile, productName) => {
    fetch('http://localhost:3000/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobile, productName }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('SMS sent successfully');
        } else {
          console.error('Failed to send SMS');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const placeOrder = (product, userRecord) => {
    const base = new Airtable({ apiKey: 'pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061' }).base('appfQNmAs6vTN5iAn');
    base('orders').create(
      {
        name: userRecord.name,
        email: userRecord.email,
        mobilenumber: userRecord.mobile,
        address: userRecord.address,
        productname: product.productName,
        productid: product.productid,
      },
      (err, record) => {
        if (err) {
          console.error(err);
          return;
        }
        alert('Order successfully placed.');
      }
    );
  };

  return (
    <>
      <section id="enbuy">
        <div>
          {products.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {products.map((product) => (
                <li key={product.id} style={{ marginBottom: '20px' }}>
                  <img src={product.image} alt={product.productName} style={{ width: '200px', height: 'auto' }} />
                  <p>{product.productName}</p>
                  <p>{product.price}/-</p>
                  <p>{product.content}</p>
                  <button id="buyb" onClick={() => handleBuy(product)}>
                    Buy Now
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading products...</p>
          )}
        </div>
      </section>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Enter Your Details</h3>
            <form>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={formData.name !== ''}
                />
              </label>
              <br />
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={formData.email !== ''}
                />
              </label>
              <br />
              <label>
                Mobile:
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <br />
              <label>
                Address:
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </label>
              <br />
              <button type="button" onClick={handleSubmit}>
                Submit
              </button>
              <button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
