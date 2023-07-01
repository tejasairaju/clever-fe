// client/src/App.js
import { useState, useEffect, SetStateAction } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // state variables
  const [contacts, setContacts] = useState<Array<any>>([]);
  const [currentContact, setCurrentContact] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [salutation, setSalutation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState("");

  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(1);
  const [limit] = useState<number>(5);

  // fetch all contacts from server
  useEffect(() => {
    retrieveContacts();
  }, [page]);

  // retrieve contacts from server with pagination
  const retrieveContacts = () => {
    axios
      .get(`http://localhost:8080/api/contacts?_page=${page}&_limit=${limit}`)
      .then((response) => {
        console.log(response.data)
        setContacts(response.data.contacts);
        setCount(response.data.count);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // handle change in input fields
  const onChangeSalutation = (e: any) => {
    setSalutation(e.target.value);
  };

  const onChangeFirstName = (e: any) => {
    setFirstName(e.target.value);
  };

  const onChangeLastName = (e: any) => {
    setLastName(e.target.value);
  };

  const onChangeDateOfBirth = (e:any) => {
    setDateOfBirth(e.target.value);
  };

  const onChangePhoneNumbers = (e: any) => {
    setPhoneNumbers(e.target.value);
  };

  const setActiveContact = (contact: any, index: number) => {
    setCurrentContact(contact);
    setCurrentIndex(index);
    setSalutation(contact.salutation);
    setFirstName(contact.first_name);
    setLastName(contact.last_name);
    setDateOfBirth(contact.date_of_birth);
    setPhoneNumbers(contact.phone_numbers);
  };

  const addContact = () => {
    const data = {
      salutation: salutation,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      phone_numbers: phoneNumbers,
    };
    axios
      .post("http://localhost:8080/api/contacts", data)
      .then((response) => {
        console.log(response.data);
        retrieveContacts();
        setCurrentContact(null);
        setCurrentIndex(-1);
        setSalutation("");
        setFirstName("");
        setLastName("");
        setDateOfBirth("");
        setPhoneNumbers("");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // handle click on update button
  const updateContact = () => {
    if (currentContact) {
      const data = {
        salutation: salutation,
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        phone_numbers: phoneNumbers,
      };
      axios
        .put(`http://localhost:8080/api/contacts/${currentContact.id}`, data)
        .then((_response) => {
          retrieveContacts();
          setCurrentContact(null);
          setCurrentIndex(-1);
          setSalutation("");
          setFirstName("");
          setLastName("");
          setDateOfBirth("");
          setPhoneNumbers("");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  // handle click on delete button
  const deleteContact = () => {
    if (currentContact) {
      axios
        .delete(`http://localhost:8080/api/contacts/${currentContact.id}`)
        .then((response) => {
          console.log(response.data);
          retrieveContacts();
          setCurrentContact(null);
          setCurrentIndex(-1);
          setSalutation("");
          setFirstName("");
          setLastName("");
          setDateOfBirth("");
          setPhoneNumbers("");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  // handle click on previous page button
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // handle click on next page button
  const nextPage = () => {
    if (page < Math.ceil(count / limit)) {
      setPage(page + 1);
    }
  };

  return (
    <div className="App">
      <div className="contact-list">
        <h4>Contact List</h4>
        <ul>
          {contacts &&
            contacts.map((contact, index) => (
              <li
                key={index}
                onClick={() => setActiveContact(contact, index)}
                className={index === currentIndex ? "active" : ""}
              >
                {contact.first_name} {contact.last_name}
              </li>
            ))}
        </ul>
        <div className="pagination">
          <button onClick={prevPage}>Prev</button>
          <span>{page}</span>
          <button onClick={nextPage}>Next</button>
        </div>
      </div>
      <div className="contact-details">
        <h4>Contact Details</h4>
        {currentContact ? (
          <div>
            <div>
              <label>Salutation</label>
              <input
                type="text"
                value={salutation}
                onChange={onChangeSalutation}
              />
            </div>
            <div>
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={onChangeFirstName}
              />
            </div>
            <div>
              <label>Last Name</label>
              <input type="text" value={lastName} onChange={onChangeLastName} />
            </div>
            <div>
              <label>Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={onChangeDateOfBirth}
              />
            </div>
            <div>
              <label>Phone Numbers</label>
              <input
                type="text"
                value={phoneNumbers}
                onChange={onChangePhoneNumbers}
              />
            </div>
            <div className="buttons">
              <button onClick={updateContact}>Update</button>
              <button onClick={deleteContact}>Delete</button>
            </div>
          </div>
        ) : (
          <p>Please select a contact or add a new one</p>
        )}
      </div>
      <div className="contact-form">
        <h4>Add Contact</h4>
        <div>
          <label>Salutation</label>
          <input type="text" value={salutation} onChange={onChangeSalutation} />
        </div>
        <div>
          <label>First Name</label>
          <input type="text" value={firstName} onChange={onChangeFirstName} />
        </div>
        <div>
          <label>Last Name</label>
          <input type="text" value={lastName} onChange={onChangeLastName} />
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={onChangeDateOfBirth}
          />
        </div>
        <div>
          <label>Phone Numbers</label>
          <input
            type="text"
            value={phoneNumbers}
            onChange={onChangePhoneNumbers}
          />
        </div>
        <div className="buttons">
          <button onClick={addContact}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default App;
