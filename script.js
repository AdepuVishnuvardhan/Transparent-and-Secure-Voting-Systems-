const loginSection = document.getElementById("login-section");
const voteSection = document.getElementById("vote-section");
const resultsSection = document.getElementById("results-section");
const loginBtn = document.getElementById("login-btn");
const voteBtn = document.getElementById("vote-btn");
const viewVotePercentageBtn = document.getElementById("view-vote-percentage-btn");
const voterIdInput = document.getElementById("voter-id");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");
const candidatesList = document.getElementById("candidates-list");
const voteConfirmation = document.getElementById("vote-confirmation");
const resultsList = document.getElementById("results-list");
const voteChartCanvas = document.getElementById("vote-chart");
const logoutBtn = document.getElementById("logout-btn");
const backBtn = document.getElementById("back-btn");

let voterData = {
    isAuthenticated: false,
    candidates: ["Candidate A", "Candidate B", "Candidate C"],
    votes: {
        "Candidate A": 0,
        "Candidate B": 0,
        "Candidate C": 0
    }
};

// Check if data exists in localStorage
if (localStorage.getItem("voterData")) {
    voterData = JSON.parse(localStorage.getItem("voterData"));
    if (voterData.isAuthenticated) {
        loginSection.style.display = "none";
        voteSection.style.display = "block";
        loadCandidates();
        updateResults();
    }
}

// Handle Login
loginBtn.addEventListener("click", function() {
    const voterId = voterIdInput.value;
    const password = passwordInput.value;

    if (voterId === "123" && password === "password") {
        loginError.textContent = "";
        voterData.isAuthenticated = true;
        localStorage.setItem("voterData", JSON.stringify(voterData));  // Save to localStorage
        loginSection.style.display = "none";
        voteSection.style.display = "block";

        // Populate candidate list
        loadCandidates();
    } else {
        loginError.textContent = "Invalid Voter ID or Password";
    }
});

// Load Candidates
function loadCandidates() {
    candidatesList.innerHTML = '<option value="">Select a Candidate</option>';
    voterData.candidates.forEach((candidate, index) => {
        const option = document.createElement("option");
        option.value = candidate;
        option.textContent = candidate;
        candidatesList.appendChild(option);
    });
}

// Handle Vote Casting
voteBtn.addEventListener("click", function() {
    const selectedCandidate = candidatesList.value;

    if (selectedCandidate) {
        voterData.votes[selectedCandidate]++;
        voteConfirmation.textContent = `You have successfully voted for ${selectedCandidate}`;
        voteSection.style.display = "none";
        resultsSection.style.display = "block";

        // Save to localStorage
        localStorage.setItem("voterData", JSON.stringify(voterData));

        // Display the results
        updateResults();

        // Automatically logout after voting
        setTimeout(logout, 3000); // Logs out after 3 seconds
    } else {
        voteConfirmation.textContent = "Please select a candidate!";
    }
});

// Update Results
function updateResults() {
    resultsList.innerHTML = "";
    Object.entries(voterData.votes).forEach(([candidate, votes]) => {
        const resultItem = document.createElement("p");
        resultItem.textContent = `${candidate}: ${votes} votes`;
        resultsList.appendChild(resultItem);
    });
}

// View Voting Percentage
viewVotePercentageBtn.addEventListener("click", function() {
    const totalVotes = Object.values(voterData.votes).reduce((acc, val) => acc + val, 0);
    const percentages = Object.entries(voterData.votes).map(([candidate, votes]) => {
        return {
            candidate,
            percentage: totalVotes > 0 ? (votes / totalVotes) * 100 : 0
        };
    });

    const chartData = {
        labels: percentages.map(item => item.candidate),
        datasets: [{
            label: 'Voting Percentage',
            data: percentages.map(item => item.percentage),
            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1
        }]
    };

    const chartConfig = {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    new Chart(voteChartCanvas, chartConfig);
    document.getElementById("voting-percentage").style.display = "block";
});

// Logout Function
function logout() {
    voterData.isAuthenticated = false;
    localStorage.removeItem("voterData"); // Remove from localStorage
    loginSection.style.display = "block";
    voteSection.style.display = "none";
    resultsSection.style.display = "none";
    alert("You have been logged out successfully!");
}

// Back to Vote Section
backBtn.addEventListener("click", function() {
    resultsSection.style.display = "none";
    voteSection.style.display = "block";
});
