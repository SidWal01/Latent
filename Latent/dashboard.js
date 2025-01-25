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

  fetch('http://localhost:3000/ask-question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intro: "My name is Tejas Nangru, I love to play tennis", // Update with dynamic intro if needed
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      judge.question = data.result || "Could not fetch question"; // Default if API fails
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

// Add a message to the chat
function addMessage(sender, text, avatar, isUser = false) {
  const message = document.createElement("div");
  message.classList.add("message", isUser ? "user-message" : "judge-message");

  const img = document.createElement("img");
  img.src = isUser ? "your-avatar.png" : avatar;
  img.alt = `${sender}'s avatar`;
  img.className = "avatar";

  const cloud = document.createElement("div");
  cloud.className = "cloud";
  cloud.textContent = text;

  if (isUser) {
    message.appendChild(cloud);
    message.appendChild(img);
  } else {
    message.appendChild(img);
    message.appendChild(cloud);
  }

  chatSection.appendChild(message);
  chatSection.scrollTop = chatSection.scrollHeight;
}

// Fetch roast for the user's answer
function fetchJudgeRoast(userAnswer) {
  const judge = judges[currentJudge];

  fetch('http://localhost:3000/get-roast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ans: userAnswer,
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      judge.roast = data.result || "Couldn't fetch roast. Try again later.";
      addMessage(judge.name, judge.roast, judge.avatar);
      currentJudge = (currentJudge + 1) % judges.length; // Move to next judge
      setTimeout(fetchJudgeQuestion, 1000); // Fetch next question
    })
    .catch(error => {
      console.error("Error fetching the roast:", error);
      judge.roast = "Error generating roast. Please try again later.";
      addMessage(judge.name, judge.roast, judge.avatar);
      currentJudge = (currentJudge + 1) % judges.length; // Move to next judge
      setTimeout(fetchJudgeQuestion, 1000); // Fetch next question
    });
}

// Handle user input
sendButton.addEventListener("click", () => {
  const userMessage = userInput.value.trim();
  if (!userMessage) {
    alert("Please type a message!");
    return;
  }

  if (awaitingUserResponse) {
    addMessage("You", userMessage, "user.jpg", true);
    awaitingUserResponse = false; // Stop awaiting response
    fetchJudgeRoast(userMessage); // Fetch the roast
    userInput.value = ""; // Clear input
  } else {
    alert("Wait for the judge's question!");
  }
});

// Start with the first judge's question
fetchJudgeQuestion();