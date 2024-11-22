import React, { useState, useEffect, useRef } from 'react';
import Airtable from 'airtable';
import './envibuy.css';

export default function Envibuy() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
  });
  const [isMobileValid, setIsMobileValid] = useState(false);
  const addressInputRef = useRef(null);

  useEffect(() => {
    const base = new Airtable({ apiKey:`pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061` })
      .base('appfQNmAs6vTN5iAn');
      
    base('selling')
      .select({ filterByFormula: `{prname} = 'environment'` })
      .all()
      .then(records => {
        const productsData = records.map(record => ({
          id: record.id,
          productid: record.fields.productid,
          image: record.fields.image[0]?.url,
          productName: record.fields.productname,
          price: record.fields.price,
          content: record.fields.content,
        }));
        setProducts(productsData);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (addressInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['geocode'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        setFormData(prevData => ({
          ...prevData,
          address: place.formatted_address || formData.address,
        }));
      });
    }
  }, []);

  const handleBuy = (product) => {
    const storedName = localStorage.getItem('name');
    const storedEmail = localStorage.getItem('email');

    if (!storedName || !storedEmail) {
      alert("Please sign in first.");
      window.location.href = "/sign-in";
      return;
    }

    setFormData({
      ...formData,
      name: storedName,
      email: storedEmail,
    });

    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleMobileChange = (e) => {
    const mobile = e.target.value;
    setIsMobileValid(/^\+91[6-9]\d{9}$/.test(mobile));
    setFormData({ ...formData, mobile });
  };

  const handleSubmit = () => {
    if (!isMobileValid) {
      alert("Please enter a valid mobile number.");
      return;
    }

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const base = new Airtable({ apiKey: `pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061` })
      .base('appfQNmAs6vTN5iAn');

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
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        alert('Order placed successfully.');
        setShowModal(false);
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
                <input type="text" name="name" value={formData.name} readOnly />
              </label>
              <br />
              <label>
                Email:
                <input type="email" name="email" value={formData.email} readOnly />
              </label>
              <br />
              <label>
                Mobile:
                <input
                  type="tel"
                  name="mobile"
                  placeholder="+91XXXXXXXXXX"
                  value={formData.mobile}
                  onChange={handleMobileChange}
                  required
                />
              </label>
              <br />
              <label>
                Address:
                <input 
                  type="text"
                  name="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </label>
              <br />
              <button type="button" onClick={handleSubmit} disabled={!isMobileValid}>
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
