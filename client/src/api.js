function currentUser(){
  const cmUser = localStorage.getItem("cm-user")
  if (!cmUser){
    return null;
  }
   return JSON.parse(cmUser);
}


function signup(name, username, password) {

    const body = {
        name: name,
        username: username,
        password: password
      }
      
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
    };
      
      return fetch('http://localhost:3001/signup', options)
        .then(res => {
            if (res.ok) {
                return res.json();
              } else {
                throw new Error("Signup Failed!!")
            }
        })
}

function login(username, password) {

    const body = {
        username: username,
        password: password
      }
      
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
    };
      
      return fetch('http://localhost:3001/login', options)
        .then(res => {
            if (res.ok) {
                return res.json();
              } else {
                throw new Error("Login Failed!!")
            }
        })
        .then(res => {
            const user = {
                username: username,
                token: res.token
            }
            localStorage.setItem("cm-user", JSON.stringify(user))
            return user
        })
}

function logout() {
    localStorage.removeItem("cm-user")
}


function fetchContacts(){
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser().token}`
    }
  };

    return fetch('http://localhost:3001/contacts',options).then(res => {
      if (res.ok) {
          return res.json();
        } else {
          throw new Error("failed fetching contacts")
      }
  })
}

function createContact (data) {
  const newContact = {
    name: data.name,
    emails: [],
    phone_numbers: [],
    addresses: []
  }

  if (data.email){
    newContact.emails.push(data.email)
  }

  if (data.phone){
    newContact.phone_numbers.push(data.phone)
  }

  if (data.city){
    newContact.addresses.push({
      city: data.city
    })
  }

  const options = {
    method: 'POST',
    body: JSON.stringify(newContact),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser().token}`
    }
  };

  return fetch('http://localhost:3001/contacts', options)
  .then(res => {
      if (res.ok) {
          return res.json();
        } else {
          throw new Error("Create Contact Failed!!")
      }
  })

}

function deleteContact(id){
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser().token}`
    }
  };

    return fetch(`http://localhost:3001/contacts/${id}`, options).then(res => {
      if (res.ok) {
          return res.json();
        } else {
          throw new Error("failed deleting contact")
      }
  })
}

module.exports = {
    currentUser: currentUser,
    signup:signup,
    login: login,
    logout: logout,
    fetchContacts: fetchContacts,
    createContact: createContact,
    deleteContact: deleteContact,
}