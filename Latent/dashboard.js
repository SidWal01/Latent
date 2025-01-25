// Elements
const chatSection = document.getElementById("chat-section");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

// Judges and their static details
const judges = [
  { name: "Samay", avatar: "samay.png", question: "Loading question...", roast: "Wow, what a reply! 😂" },
  { name: "Balraj", avatar: "balraj.png", question: "Can you do better than that?", roast: "Couldn’t agree more... Not!" },
  { name: "Maheep", avatar: "maheep.png", question: "What makes you stand out?", roast: "That’s an interesting perspective... NOT!" },
  { name: "Arpit", avatar: "arpit.png", question: "Why should we choose you?", roast: "Is that your final answer? 🙃" },
  { name: "Karan", avatar: "karan.png", question: "How do you handle criticism?", roast: "I’ll pretend I didn’t hear that." },
];

let currentJudge = 0; // Index for judges
let awaitingUserResponse = false; // Track whether we're waiting for a user response

// Fetch the question for each judge using the API
function fetchJudgeQuestion() {
  const judge = judges[currentJudge];
  
  // API request to get the question dynamically based on the introduction
  fetch('http://localhost:3000/ask-question', {  // This is a route we'll define in our server.js
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intro: "My name is Tejas Nangru, i love to play tennis"  // This should be dynamically provided based on the user's intro
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    // Update the judge's question dynamically with the API response
    judge.question = data.result || "Could not fetch question";  // Default in case API fails
    addMessage(judge.name, judge.question, judge.avatar);
    awaitingUserResponse = true; // Await user response
  })
  .catch(error => {
    console.error("Error fetching the question:", error);
    judge.question = "Error fetching question. Please try again later.";
    addMessage(judge.name, judge.question, judge.avatar);
    awaitingUserResponse = true; // Continue even if there's an error
  });
}

// Function to add a message to the chat
function addMessage(sender, text, avatar, isUser = false) {
  const message = document.createElement("div");
  message.classList.add("message", isUser ? "user-message" : "judge-message");

  const img = document.createElement("img");
  img.src = isUser ? "your-avatar.png" : avatar; // Use your avatar for user messages
  img.alt = `${sender}'s avatar`;
  img.className = "avatar";

  const cloud = document.createElement("div");
  cloud.className = "cloud";
  cloud.textContent = text;

  // Append elements based on who sent the message
  if (isUser) {
    message.appendChild(cloud); // Text first for user
    message.appendChild(img);  // Then avatar
  } else {
    message.appendChild(img);  // Avatar first for judge
    message.appendChild(cloud); // Then text
  }

  chatSection.appendChild(message);
  chatSection.scrollTop = chatSection.scrollHeight; // Auto-scroll to the bottom
}

// Function to handle the judge's roast after user's response
function roastJudgeResponse() {
  const judge = judges[currentJudge];
  addMessage(judge.name, judge.roast, judge.avatar);
  currentJudge = (currentJudge + 1) % judges.length; // Move to the next judge
  setTimeout(fetchJudgeQuestion, 1000); // Ask the next judge's question after a short delay
}

// Handle User Input
sendButton.addEventListener("click", () => {
  const userMessage = userInput.value.trim();
  if (!userMessage) {
    alert("Please type a message!");
    return;
  }

  // If we're awaiting the user's response
  if (awaitingUserResponse) {
    // Add the user's message
    addMessage("You", userMessage, "user.jpg", true);
    awaitingUserResponse = false; // Stop awaiting response

    // Add the judge's roast after a delay
    setTimeout(roastJudgeResponse, 1000);

    // Clear input field
    userInput.value = "";
  } else {
    alert("Wait for the judge's question!");
  }
});

// Start with the first judge's question
fetchJudgeQuestion();
