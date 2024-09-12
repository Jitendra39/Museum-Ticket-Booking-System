
let ExistingQeustionsAndResponses = [];
let temperaryQuestions = [];
let QuestionsClicked = "";
let listOfMuseums = [];
let typeOfQuestion = "";
let cityName = "";
let museumData = {};
let backendLink = "http://localhost:8000";

window.addEventListener("DOMContentLoaded", () => {
  const titleBtn = document.querySelector(".titleBtn");
  const dropBox = document.querySelector(".dropBox");

  titleBtn.addEventListener("click", function () {
    
    if (dropBox.style.display === "none" || dropBox.style.display === "") {
      dropBox.style.display = "block";
    } else {
      dropBox.style.display = "none";
    }
  });

  temperaryQuestions.push(
    "Book a Ticket",
    "Cancel Ticket",
    "Complaint Registration",
    "General Questions Answer",
    "Top 10 Museums in India"
  );
  initializeQuestions();
});

function initializeQuestions() {
  const Questions = document.querySelector(".Questions");
  Questions.innerHTML = ""; // Clear previous questions
  let ques = typeOfQuestion == "museums" ? listOfMuseums : temperaryQuestions;
  displayMuseumList(ques, Questions);
}

const displayMuseumList = (ques, Questions) => {
  if (typeOfQuestion !== "museums") {
    ques.forEach((question) => {
      const questionBox = document.createElement("div");
      questionBox.classList.add("message-box", "left", "Question");
      questionBox.innerHTML = `<p>${question}</p>`;
      Questions.appendChild(questionBox);

      questionBox.addEventListener("click", () =>
        handleQuestionClick(questionBox, Questions)
      );
    });
  } else {
    document.querySelector(".titleDropBox").style.display = "block";
    ques.forEach((museum) => {
      const dropBox = document.createElement("div");
      dropBox.classList.add("dropBox");
      const museumDetails = document.createElement("div");
      museumDetails.classList.add("museumDetails");

      const titleBtn = document.createElement("div");
      titleBtn.classList.add("titleBtn");

      const title = document.createElement("div");
      title.classList.add("title");
      title.innerHTML = `<p>${museum}</p>`;

      const btn = document.createElement("div");
      btn.classList.add("btn");
      btn.innerHTML = `<i class="ri-arrow-down-s-line"></i>`;

      titleBtn.appendChild(title);
      titleBtn.appendChild(btn);
      museumDetails.appendChild(titleBtn);
      titleBtn.addEventListener("click", () => {
        if (dropBox.style.display === "none" || dropBox.style.display === "") {
          getMuseamDetails(museum, dropBox, titleBtn, museumDetails);
        } else {
          dropBox.style.display = "none";
        }
      });

      document.querySelector(".titleDropBox").appendChild(museumDetails);
    });
  }
};

async function getMuseamDetails(museum, dropBox, titleBtn, museumDetails) {
  let museumContent = "";
  if (museumDetails[museum]) {
    museumContent = museumDetails[museum];
    displayMuseumContent(dropBox, titleBtn, museumDetails, museumContent);
  } else {
    fetch(`${backendLink}/api/museumInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city: cityName, museums: museum }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (!museumDetails[museum]) {
          museumDetails[museum] = [];
        }
        museumDetails[museum].push(...data.geminiInfo);
        console.log(museumDetails);
        const museumContent = museumDetails[museum];
        displayMuseumContent(dropBox, titleBtn, museumDetails, museumContent);
      });
  }
}

const displayMuseumContent = (
  dropBox,
  titleBtn,
  museumDetails,
  museumContent
) => {
  museumContent?.forEach((content) => {
    dropBox.innerHTML = `
      <div class="dropBoxContent">
        <div class="content">
          <div class="contentTitle">Address</div>
          <div class="contentText">${content.address}</div>
        </div>
        <div class="content">
          <div class="contentTitle">Phone</div>
          <div class="contentText">${content.contactNumber}</div>
        </div>
        <div class="content">
          <div class="contentTitle">Open</div>
          <div class="contentText">${content.openingTime} AM - ${content.closingTime} PM</div>
        </div>
        <div class="content">
          <div class="contentTitle">Entry Fee</div>
          <div class="contentText">${content.price}</div>
        </div>
        <div class="content">
  <button class="button type1" onclick="handleBookTicketClick(${JSON.stringify(content).replace(/"/g, '&quot;')})">
            Book Ticket
          </button>
        </div>
      </div>
    `;

    // Append the title button and dropBox to museumDetails
    museumDetails.appendChild(titleBtn);
    museumDetails.appendChild(dropBox);
  });

  // Append museumDetails to the titleDropBox container
  document.querySelector(".titleDropBox").appendChild(museumDetails);

  // Make the dropBox visible
  dropBox.style.display = "block";
};





const handleBookTicketClick = async (content) => {
  console.log(content);
  console.log(content.name);
  let Members = [];
  let totalMembersCount = 0;

  // Hide the museum details
  document.querySelector(".titleDropBox").style.display = "none";

  // Handle the question click
  typeOfQuestion = 'booking';
  handleQuestionClick(content.name);
  displayLocation('Enter Your name');
  const userName = await takeUserInput();
  handleQuestionClick(userName);
  displayLocation('Enter Date');
  const date = await takeUserInput('date');
  handleQuestionClick(date);
  displayLocation('Enter Member Count');
  totalMembersCount = await takeUserInput('number');
 
  handleQuestionClick(`${totalMembersCount} Members`);

  for (let i = 0; i < totalMembersCount; i++) {
    displayLocation(`Enter name for Member ${i + 1}`);
    let memberName = await takeUserInput();
    // Members.push(`Member ${i + 1}: ${memberName}`);
    Members.push({name : memberName});
    handleQuestionClick(memberName);
   
  }

  displayLocation('Enter Your Email');
  const userEmail = await takeUserInput();
  console.log('user info', userName, userEmail, totalMembersCount, Members);
const members =Members.map(member => member.name).join(',')
  // Send a POST request to the backend to book a ticket
  const queryParams = new URLSearchParams({
    content,
    city: cityName,
    name: userName,
    email: userEmail,
    openingTime: content.openingTime,
    closingTime: content.closingTime,
    price: content.price,
    addreess: content.address,
    members: members, // Convert array of objects to comma-separated string of names
    date,
  }).toString();
  
  // Construct the URL with the query parameters
  const url = `${backendLink}/ticket?${queryParams}`;
  
  // Send a GET request with the constructed URL
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => response.text()) // Expect HTML response
  .then(html => {
    // Handle the HTML response
    document.open();
    document.write(html);
    document.close();
  })
  .catch(error => {
    console.error("Error:", error);
  });
};

function handleQuestionClick(questionBox, Questions) {
  let questionText;
  const opponentResponse = document.querySelector(".opponentResponse");
if(typeOfQuestion === 'booking'){
   questionText = questionBox;
}else{
 questionText = questionBox.querySelector("p").textContent;
  Questions.innerHTML = "";
}
 
  
  const rightsidebox = document.createElement("div");
  rightsidebox.classList.add("rightSideResponse");
  const clickedQuestionBox = document.createElement("div");
  clickedQuestionBox.classList.add("message-box", "right");
  clickedQuestionBox.innerHTML = `<p>${questionText}</p>`;
  rightsidebox.appendChild(clickedQuestionBox);
  opponentResponse.appendChild(rightsidebox);

  QuestionsClicked = questionText;
  handleQuestionChange();
}

async function handleQuestionChange() {
  // if(typeOfQuestion === 'museums'){
  //   fetchMuseumDetails(QuestionsClicked);
  // } else
  if (QuestionsClicked === "Book a Ticket") {
    BookTicket();
  } else if (QuestionsClicked === "Current Location") {
    getUserCurrentLocation()
      .then((location) => {
        console.log(
          `City: ${location.city}, State: ${location.state}, State District: ${location.state_district}`
        );
        displayLocation(location);
        cityName = location.city;
        getMuseumNames(location.city);
      })
      .catch((error) => console.error("Error:", error));
  } else if (QuestionsClicked === "Enter Location" ) {
    const location = await await takeUserInput();
    console.log(location);
    displayLocation(location);
    cityName = location;
    getMuseumNames(location);
  

  }
}

function takeUserInput(type) {
  const footer = document.querySelector(".footer");
  const messageInput = document.querySelector(".message-input");
  footer.style.visibility = "visible";
  messageInput.type = type === 'date' ? 'date' : 'text';
  return new Promise((resolve) => {
    messageInput.addEventListener("keypress", function handler(e) {
      if (e.key === "Enter") {
        const input = messageInput.value;
        footer.style.visibility = "hidden";
        messageInput.value = "";
        messageInput.removeEventListener("keypress", handler); // Remove the event listener after resolving
        if (type === 'number') {
          resolve(Number(input)); // Convert input to number if type is 'number'
        } else {
          resolve(input);
        }
      }
    });
  });
}


function BookTicket() {
  const footer = document.querySelector(".footer");
  const inputBox = document.querySelector(".message-input");
  temperaryQuestions = ["Current Location", "Enter Location"];
  initializeQuestions();
}

async function getMuseumNames(city) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/museumName/${city}`
    );
    const data = await response.json();
    console.log(data);
    listOfMuseums = data.museums
      .filter((museum) => museum.name.trim() !== "" 
      && museum.name.trim() !== "MUSEUM" && museum.name.trim() !== "Museum" && !museum.name.trim().includes("Zoo") && !museum.name.trim().includes("zoo") && !museum.name.trim().includes("ZOO"))
      .map((museum) => museum.name);
    typeOfQuestion = "museums";
    initializeQuestions();
  } catch (error) {
    console.error("Error:", error);
  }
}

function getUserCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(latitude, longitude);

          reverseGeocode(latitude, longitude)
            .then((location) => resolve(location))
            .catch((error) => reject(error));
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(error);
        },
        {
          enableHighAccuracy: true, // Request high accuracy
          timeout: 5000, // Set a timeout
          maximumAge: 0, // Do not use cached location
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

function reverseGeocode(latitude, longitude) {
  return fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  )
    .then((response) => response.json())
    .then((data) => {
      const address = data.address;
      const city = address.city || address.town || address.village || "";
      const state = address.state || "";
      const state_district = address.state_district || "";
      return { city, state, state_district };
    });
}

function displayLocation(location) {
  const opponentResponse = document.querySelector(".opponentResponse");
  const locationInfo = document.createElement("div");
  locationInfo.classList.add("message-box", "left");
  if(typeOfQuestion === 'booking'){
    locationInfo.innerHTML = `<p>${location} </p>`;
    opponentResponse.appendChild(locationInfo);
  }else
    if (location.city) {
    locationInfo.innerHTML = `<p>City: ${location.city}, State: ${location.state}, State District: ${location.state_district}</p>`;
    opponentResponse.appendChild(locationInfo);
  } else {
    locationInfo.innerHTML = `<p>${location} city</p>`;
    opponentResponse.appendChild(locationInfo);
  }
}
