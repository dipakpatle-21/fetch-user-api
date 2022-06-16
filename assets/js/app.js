let cl = console.log; //=> first class function


let baseURL = "http://localhost:3000/posts";
const userData = document.getElementById('userData');
const userForm = document.getElementById('userForm');
const myname = document.getElementById('myname');
const username = document.getElementById('username');
const email = document.getElementById('email')
const street = document.getElementById('street')
const suite = document.getElementById('suite')
const city = document.getElementById('city')
const zipcode = document.getElementById('zipcode')
const lattitude = document.getElementById('lattitude')
const longitude = document.getElementById('longitude')
const phone = document.getElementById('phone')
const website = document.getElementById('website')
const compName = document.getElementById('compName')
const compCP = document.getElementById('compCP')
const compBS = document.getElementById('compBS')
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');
let usersArray = [];

// ============== Generic Function ==================
function makeFetchAPICall(methodname, url, body){
    return new Promise((resolve, reject) =>{
        fetch(url,{
            method : methodname,
            body : body,
            headers : {
                "Content-type" : "application/json; charset=UTF-8",
                "Authorization" : "Bearar Token qwertyuqaz",
            }
        }).then(response => response.json())
          .then(res => resolve(res))
          .catch(cl);
    })
}

// ============== Get Method ==================

async function getUsersData(){
    try{
        let responseData = await makeFetchAPICall("GET", baseURL);
        usersArray = responseData;
        templating(usersArray);
    }catch(err){
        cl(err);
    }
}

getUsersData();

// ============== POST Method ==================

async function onPostHandler(eve){
    eve.preventDefault();
    let obj = {
        name : myname.value,
        username : username.value,
        email : email.value,
        address : {
            street : street.value,
            suite : suite.value,
            city : city.value,
            zipcode : zipcode.value,
            geo : {
                lat : lattitude.value,
                lng : longitude.value,
            },
        },
        phone : phone.value,
        website : website.value,
        company : {
            name : compName.value,
            catchPhrase : compCP.value,
            bs : compBS.value,
        }
    }
    cl(obj)
    usersArray.push(obj);
    cl(usersArray);
    templating(usersArray);
    userForm.reset();
    try{
        let responseData = await makeFetchAPICall("POST", baseURL, JSON.stringify(obj));
        cl(responseData);
    }catch(err){
        cl(err);
    }
}

// ================= PATCH with EDIT Method ==================

const onEditHandler = eve =>{
    let getID = +eve.dataset.id;
    cl(getID)
    localStorage.setItem("setID", getID);
    let findObj = usersArray.find(ele => ele.id === getID);
    cl(findObj);
    myname.value = findObj.name;
    username.value = findObj.username;
    email.value = findObj.email;
    street.value = findObj.address.street;
    suite.value = findObj.address.suite;
    city.value = findObj.address.city;
    zipcode.value = findObj.address.zipcode;
    lattitude.value = findObj.address.geo.lat;
    longitude.value = findObj.address.geo.lng;
    phone.value = findObj.phone;
    website.value = findObj.website;
    compName.value = findObj.company.name;
    compCP.value = findObj.company.catchPhrase;
    compBS.value = findObj.company.bs;
    toggleButtons();
}

const onUpdateHandler = eve =>{
    let updateID = localStorage.getItem("setID");
    let updateURL = `${baseURL}/${updateID}`;
    let updatedObj = {
        name : myname.value,
        username : username.value,
        email : email.value,
        address : {
            street : street.value,
            suite : suite.value,
            city : city.value,
            zipcode : zipcode.value,
            geo : {
                lat : lattitude.value,
                lng : longitude.value,
            },
        },
        phone : phone.value,
        website : website.value,
        company : {
            name : compName.value,
            catchPhrase : compCP.value,
            bs : compBS.value,
        },
    }
    usersArray.push(updatedObj);
    templating(usersArray);
    makeFetchAPICall("PATCH", updateURL, JSON.stringify(updatedObj));
    toggleButtons();
    userForm.reset();
}

// ============== DELETE Method ==================

const onDeleteHandler = eve =>{
    let getID = +eve.dataset.id;
    let deletedURL = `${baseURL}/${getID}`;
    let newUserArray = usersArray.filter(obj => obj.id != getID);
    cl(newUserArray);
    templating(newUserArray);
    makeFetchAPICall("DELETE", deletedURL);
}

// ============== Templating Function ==================

function templating(arr){
    let result = "";
    arr.forEach(user =>{
        result += `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td> 
                Street :${user.address.street},
                Suite :${user.address.suite},   
                City :${user.address.city},   
                Zipcode :${user.address.zipcode}   
            </td>
            <td>
                Lattitude :${user.address.geo.lat},
                Longitude :${user.address.geo.lng}
            </td>
            <td>${user.phone}</td>
            <td>${user.website}</td>
            <td>
                Name : ${user.company.name},
                CatchPhrase : ${user.company.catchPhrase},
                BS : ${user.company.bs},
            </td>
            <td>
                <button class="btn btn-success" data-id="${user.id}" onclick="onEditHandler(this)">Edit</button>
            </td>
			<td>
                <button class="btn btn-danger" data-id="${user.id}" onclick="onDeleteHandler(this)">Delete</button>
            </td>
        </tr>
        `
    });
    userData.innerHTML = result;
}

// ============== Repeated Code ==================

function toggleButtons(){
    submitBtn.classList.toggle("d-none");
    updateBtn.classList.toggle("d-none");
}

////////// Event Handlers //////////

userForm.addEventListener("submit", onPostHandler);
updateBtn.addEventListener("click", onUpdateHandler);

//=============================================================================



