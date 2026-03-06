const supabase = window.supabase.createClient(
  "YOUR_SUPABASE_URL",
  "YOUR_PUBLIC_ANON_KEY"
);

// SIGN UP
async function signUp() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return alert(error.message);

  await supabase.from("profiles").insert([
    { id: data.user.id, full_name: name, role: role }
  ]);

  alert("Registered! Now login.");
}

// LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return alert(error.message);

  window.location.href = "dashboard.html";
}

// LOAD DASHBOARD
async function loadDashboard() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return window.location.href = "index.html";

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.user.id)
    .single();

  if (profile.role === "employer") {
    document.getElementById("employerSection").style.display = "block";
  }

  loadJobs();
}

// POST JOB
async function postJob() {
  const { data: user } = await supabase.auth.getUser();

  await supabase.from("jobs").insert([
    {
      title: document.getElementById("title").value,
      company: document.getElementById("company").value,
      location: document.getElementById("location").value,
      description: document.getElementById("description").value,
      created_by: user.user.id
    }
  ]);

  alert("Job Posted!");
  loadJobs();
}

// LOAD JOBS
async function loadJobs() {
  const { data } = await supabase.from("jobs").select("*");

  const container = document.getElementById("jobs");
  container.innerHTML = "";

  data.forEach(job => {
    container.innerHTML += `
      <div class="card">
        <h3>${job.title}</h3>
        <p>${job.company} - ${job.location}</p>
        <p>${job.description}</p>
      </div>
    `;
  });
}

// LOGOUT
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

if (window.location.pathname.includes("dashboard")) {
  loadDashboard();
}
