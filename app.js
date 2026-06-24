const STORAGE_KEY = "spma-state-v1";

const roleConfig = {
  superadmin: {
    label: "Super Admin",
    short: "SA",
    brand: "LoopSync",
    tagline: "Service promotion command center",
    authTitle: "Welcome back",
    authSubtitle: "Log in to your account",
    loginButton: "Log in",
    portal: "superadmin",
    nav: [
      ["dashboard", "Dashboard", "D"],
      ["promotions", "Promotions", "P"],
      ["admins", "Admins", "A"],
      ["distributors", "Distributors", "R"],
      ["services", "Services", "S"],
      ["reports", "Reports", "E"]
    ]
  },
  admin: {
    label: "Admin",
    short: "AD",
    brand: "SupplyLoop",
    tagline: "Prime Bridge Academy Distribution Monitoring",
    authTitle: "Access Portal",
    authSubtitle: "Sign in to your distribution account",
    loginButton: "Sign In",
    portal: "admin",
    nav: [
      ["dashboard", "Dashboard", "D"],
      ["promotions", "Promotions", "P"],
      ["assignments", "Assignments", "A"],
      ["distributors", "Distributors", "R"],
      ["reports", "Reports", "E"]
    ]
  },
  distributer: {
    label: "Distributer",
    short: "DI",
    brand: "SupplyLoop",
    tagline: "Prime Bridge Academy Field Fulfillment",
    authTitle: "Distribution Portal",
    authSubtitle: "Track assigned promotion delivery",
    loginButton: "Sign In",
    portal: "distributer",
    nav: [
      ["dashboard", "Dashboard", "D"],
      ["assignments", "My Assignments", "A"],
      ["submissions", "Submissions", "S"],
      ["profile", "Profile", "P"]
    ]
  }
};

const seedState = {
  session: { role: "superadmin", email: "superadmin@pba.local" },
  activeTab: "all",
  search: "",
  promotions: [
    {
      id: "PR-2401",
      title: "Back-to-School Service Bundle",
      service: "Admissions",
      region: "Addis Ababa",
      admin: "Marta Bekele",
      distributor: "East Route Team",
      budget: 42000,
      target: 1300,
      reached: 980,
      status: "Active",
      approval: "Approved",
      starts: "2026-06-12",
      ends: "2026-07-15"
    },
    {
      id: "PR-2402",
      title: "Parent Referral Drive",
      service: "Tuition",
      region: "Adama",
      admin: "Nahom Tesfaye",
      distributor: "Rift Valley Partners",
      budget: 26000,
      target: 700,
      reached: 214,
      status: "Pending",
      approval: "Review",
      starts: "2026-06-25",
      ends: "2026-08-01"
    },
    {
      id: "PR-2403",
      title: "Digital Enrollment Week",
      service: "Online Learning",
      region: "Bahir Dar",
      admin: "Marta Bekele",
      distributor: "Lake City Agents",
      budget: 31500,
      target: 900,
      reached: 820,
      status: "Active",
      approval: "Approved",
      starts: "2026-06-01",
      ends: "2026-06-29"
    },
    {
      id: "PR-2404",
      title: "Summer Class Awareness",
      service: "Short Courses",
      region: "Hawassa",
      admin: "Selam Alemu",
      distributor: "South Field Crew",
      budget: 18500,
      target: 520,
      reached: 520,
      status: "Completed",
      approval: "Approved",
      starts: "2026-05-10",
      ends: "2026-06-05"
    }
  ],
  admins: [
    { id: "AD-01", name: "Marta Bekele", email: "marta@pba.local", region: "Addis Ababa", status: "Active", promotions: 2 },
    { id: "AD-02", name: "Nahom Tesfaye", email: "nahom@pba.local", region: "Adama", status: "Active", promotions: 1 },
    { id: "AD-03", name: "Selam Alemu", email: "selam@pba.local", region: "Hawassa", status: "Invited", promotions: 1 }
  ],
  distributors: [
    { id: "DS-11", name: "East Route Team", lead: "Amanuel H.", region: "Addis Ababa", status: "Active", completion: 76 },
    { id: "DS-12", name: "Rift Valley Partners", lead: "Liya K.", region: "Adama", status: "Active", completion: 31 },
    { id: "DS-13", name: "Lake City Agents", lead: "Biniam T.", region: "Bahir Dar", status: "Active", completion: 91 },
    { id: "DS-14", name: "South Field Crew", lead: "Kidist M.", region: "Hawassa", status: "Paused", completion: 64 }
  ],
  services: [
    { name: "Admissions", owner: "Student Growth", status: "Enabled" },
    { name: "Tuition", owner: "Finance", status: "Enabled" },
    { name: "Online Learning", owner: "Digital Programs", status: "Enabled" },
    { name: "Short Courses", owner: "Academics", status: "Review" }
  ],
  submissions: [
    { id: "SB-9001", promotion: "Back-to-School Service Bundle", distributor: "East Route Team", quantity: 180, note: "School visits completed in Bole and CMC.", status: "Accepted" },
    { id: "SB-9002", promotion: "Digital Enrollment Week", distributor: "Lake City Agents", quantity: 95, note: "Parent SMS callbacks logged.", status: "Review" }
  ],
  audit: [
    "Super Admin approved PR-2401",
    "Marta Bekele assigned East Route Team",
    "Lake City Agents submitted SB-9002",
    "Nahom Tesfaye drafted PR-2402"
  ]
};

let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? mergeState(seedState, saved) : structuredClone(seedState);
  } catch {
    return structuredClone(seedState);
  }
}

function mergeState(base, saved) {
  return {
    ...structuredClone(base),
    ...saved,
    session: { ...base.session, ...(saved.session || {}) }
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function route() {
  const raw = location.hash.replace(/^#\/?/, "");
  const parts = raw.split("/").filter(Boolean);
  if (!parts.length) return { auth: "login", role: state.session.role, page: "dashboard" };
  if (["login", "register", "forgot-password"].includes(parts[0])) {
    return { auth: parts[0], role: parts[1] || state.session.role, page: "dashboard" };
  }
  const role = roleConfig[parts[0]] ? parts[0] : state.session.role;
  const page = roleConfig[parts[0]] ? parts[1] || "dashboard" : parts[0];
  return { role, page: page || "dashboard" };
}

function navigate(path) {
  location.hash = path;
}

function render() {
  const current = route();
  if (current.auth) {
    renderAuth(current.auth, current.role);
    return;
  }
  state.session.role = current.role;
  saveState();
  renderApp(current.role, current.page);
}

function renderAuth(mode, roleKey) {
  const role = roleConfig[roleConfig[roleKey] ? roleKey : "admin"];
  const titles = {
    login: [role.authTitle, role.authSubtitle],
    register: ["Create your account", "Sign up to get started"],
    "forgot-password": ["Reset password", "We'll send you a link to reset it"]
  };
  const isForgot = mode === "forgot-password";
  const isRegister = mode === "register";
  document.getElementById("app").innerHTML = `
    <main class="auth-shell">
      <section class="auth-brand">
        <div class="brand-row">
          <div class="brand-mark">${role.short}</div>
          <div>
            <strong>${role.brand}</strong>
            <span>${role.tagline}</span>
          </div>
        </div>
        <div>
          <h1>Prime Bridge Academy</h1>
          <p>Coordinate service promotions, distributors, approvals, and field reporting from one role-aware workspace.</p>
        </div>
      </section>
      <section class="auth-card" aria-label="${titles[mode][0]}">
        <h2>${titles[mode][0]}</h2>
        <p class="subtle">${titles[mode][1]}</p>
        ${!isForgot ? `<button class="btn secondary full" data-action="google">Continue with Google</button><div class="divider">OR</div>` : ""}
        <form data-form="${mode}">
          <div class="field">
            <label for="email">Email${isForgot ? " address" : ""}</label>
            <input id="email" type="email" placeholder="you@example.com" required>
          </div>
          ${!isForgot ? `
            <div class="field">
              <label for="password">Password</label>
              <input id="password" type="password" placeholder="••••••••" required minlength="4">
            </div>` : ""}
          ${isRegister ? `
            <div class="field">
              <label for="confirm">Confirm Password</label>
              <input id="confirm" type="password" placeholder="••••••••" required minlength="4">
            </div>` : ""}
          <button class="btn full" type="submit">${isForgot ? "Send reset link" : isRegister ? "Create account" : role.loginButton}</button>
        </form>
        <div class="auth-links">
          ${mode === "login" ? `<a class="link" href="#/forgot-password/${role.portal}">Forgot password?</a><span>Don't have an account? <a class="link" href="#/register/${role.portal}">Create one</a></span>` : ""}
          ${mode === "register" ? `<span>Already have an account? <a class="link" href="#/login/${role.portal}">${role.portal === "superadmin" ? "Log in" : "Sign in"}</a></span>` : ""}
          ${mode === "forgot-password" ? `<a class="link" href="#/login/${role.portal}">Back to ${role.portal === "superadmin" ? "log in" : "sign in"}</a>` : ""}
        </div>
        <div class="field">
          <label for="rolePicker">Preview role</label>
          <select id="rolePicker" data-action="role-preview">
            ${Object.entries(roleConfig).map(([key, item]) => `<option value="${key}" ${item.portal === role.portal ? "selected" : ""}>${item.label}</option>`).join("")}
          </select>
        </div>
      </section>
    </main>`;
}

function renderApp(roleKey, page) {
  const role = roleConfig[roleKey];
  const nav = role.nav.map(([key, label, icon]) => `
    <a class="${key === page ? "active" : ""}" href="#/${roleKey}/${key}">
      <span class="row-icon">${icon}</span>${label}
    </a>`).join("");
  document.getElementById("app").innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand-row">
          <div class="brand-mark">${role.short}</div>
          <div><strong>${role.brand}</strong><span>${role.tagline}</span></div>
        </div>
        <nav class="nav">${nav}</nav>
      </aside>
      <main class="main">
        <header class="topbar">
          <div class="role-badge"><span class="dot ok"></span>${role.label} workspace</div>
          <div class="toolbar-actions">
            <select data-action="switch-role" aria-label="Switch role">
              ${Object.entries(roleConfig).map(([key, item]) => `<option value="${key}" ${key === roleKey ? "selected" : ""}>${item.label}</option>`).join("")}
            </select>
            <button class="btn secondary" data-action="reset-demo">Reset demo</button>
            <button class="btn secondary" data-action="logout">Log out</button>
          </div>
        </header>
        <section class="content">${pageContent(roleKey, page)}</section>
      </main>
    </div>`;
}

function pageContent(roleKey, page) {
  if (page === "dashboard") return dashboard(roleKey);
  if (page === "promotions") return promotionsPage(roleKey);
  if (page === "admins") return peoplePage("admins");
  if (page === "distributors") return peoplePage("distributors");
  if (page === "services") return servicesPage();
  if (page === "reports") return reportsPage(roleKey);
  if (page === "assignments") return assignmentsPage(roleKey);
  if (page === "submissions") return submissionsPage();
  if (page === "profile") return profilePage();
  return dashboard(roleKey);
}

function dashboard(roleKey) {
  const active = state.promotions.filter(item => item.status === "Active").length;
  const pending = state.promotions.filter(item => item.approval === "Review").length;
  const reached = state.promotions.reduce((sum, item) => sum + item.reached, 0);
  const target = state.promotions.reduce((sum, item) => sum + item.target, 0);
  const completion = Math.round((reached / target) * 100);
  return `
    <div class="page-title">
      <div><h1>${roleConfig[roleKey].label} Dashboard</h1><p class="subtle">Live service promotion monitoring across regions and teams.</p></div>
      <button class="btn" data-action="new-promotion">New promotion</button>
    </div>
    <div class="grid metrics">
      ${metric("Active Promotions", active, "P")}
      ${metric("Pending Reviews", pending, "R")}
      ${metric("Field Reach", reached.toLocaleString(), "F")}
      ${metric("Completion", `${completion}%`, "C")}
    </div>
    <div class="grid two" style="margin-top:16px">
      <section class="panel">
        <div class="toolbar"><h2>Promotion Progress</h2><button class="btn secondary" data-action="export">Export CSV</button></div>
        <div class="chart">
          ${state.promotions.map(item => progressBar(item.title, Math.round((item.reached / item.target) * 100))).join("")}
        </div>
      </section>
      <section class="panel">
        <h2>Recent Activity</h2>
        <div class="list" style="margin-top:16px">
          ${state.audit.map((item, index) => `
            <div class="list-row">
              <div class="row-main"><span class="row-icon">${index + 1}</span><div><strong>${item}</strong><span>Updated in workspace</span></div></div>
            </div>`).join("")}
        </div>
      </section>
    </div>`;
}

function metric(label, value, icon) {
  return `<article class="metric card"><div><span>${label}</span><strong>${value}</strong></div><div class="metric-icon">${icon}</div></article>`;
}

function progressBar(label, value) {
  return `
    <div class="bar">
      <span>${label}</span>
      <div class="bar-track"><div class="bar-fill" style="--value:${Math.min(value, 100)}%"></div></div>
      <strong>${value}%</strong>
    </div>`;
}

function promotionsPage(roleKey) {
  const tabs = ["all", "Active", "Pending", "Completed", "Review"];
  const filtered = state.promotions.filter(item => {
    const haystack = `${item.title} ${item.service} ${item.region} ${item.admin} ${item.distributor}`.toLowerCase();
    const matchesSearch = haystack.includes(state.search.toLowerCase());
    const matchesTab = state.activeTab === "all" || item.status === state.activeTab || item.approval === state.activeTab;
    return matchesSearch && matchesTab;
  });
  return `
    <div class="page-title">
      <div><h1>Promotions</h1><p class="subtle">Create, approve, assign, and monitor service promotions.</p></div>
      <button class="btn" data-action="new-promotion">New promotion</button>
    </div>
    <section class="panel">
      <div class="toolbar">
        <input class="search" data-action="search" value="${state.search}" placeholder="Search promotions, services, regions">
        <div class="toolbar-actions"><button class="btn secondary" data-action="export">Export CSV</button></div>
      </div>
      <div class="tabs">
        ${tabs.map(tab => `<button class="tab ${state.activeTab === tab ? "active" : ""}" data-action="tab" data-tab="${tab}">${tab}</button>`).join("")}
      </div>
      ${filtered.length ? promotionsTable(filtered, roleKey) : `<div class="empty">No promotions match the current filters.</div>`}
    </section>`;
}

function promotionsTable(items, roleKey) {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Promotion</th><th>Region</th><th>Owner</th><th>Distributor</th><th>Progress</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.id}</td>
              <td><strong>${item.title}</strong><br><span class="subtle">${item.service}</span></td>
              <td>${item.region}</td>
              <td>${item.admin}</td>
              <td>${item.distributor}</td>
              <td>${Math.round((item.reached / item.target) * 100)}%</td>
              <td>${statusPill(item.status)} ${statusPill(item.approval)}</td>
              <td>
                <button class="btn secondary" data-action="assign" data-id="${item.id}">Assign</button>
                ${roleKey === "superadmin" && item.approval === "Review" ? `<button class="btn" data-action="approve" data-id="${item.id}">Approve</button>` : ""}
                ${roleKey === "distributer" ? `<button class="btn" data-action="submit" data-id="${item.id}">Submit</button>` : ""}
              </td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function statusPill(value) {
  const kind = value === "Active" || value === "Approved" || value === "Accepted" || value === "Enabled" ? "ok" :
    value === "Pending" || value === "Review" || value === "Invited" ? "warn" :
    value === "Paused" ? "danger" : "info";
  return `<span class="pill ${kind}">${value}</span>`;
}

function peoplePage(type) {
  const items = state[type];
  const isAdmin = type === "admins";
  return `
    <div class="page-title">
      <div><h1>${isAdmin ? "Admins" : "Distributors"}</h1><p class="subtle">${isAdmin ? "Manage regional administrators and invitations." : "Manage field teams and promotion coverage."}</p></div>
      <button class="btn" data-action="${isAdmin ? "new-admin" : "new-distributor"}">${isAdmin ? "Invite admin" : "Add distributor"}</button>
    </div>
    <section class="panel">
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>${isAdmin ? "Email" : "Lead"}</th><th>Region</th><th>Status</th><th>${isAdmin ? "Promotions" : "Completion"}</th></tr></thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>${item.id}</td>
                <td><strong>${item.name}</strong></td>
                <td>${isAdmin ? item.email : item.lead}</td>
                <td>${item.region}</td>
                <td>${statusPill(item.status)}</td>
                <td>${isAdmin ? item.promotions : `${item.completion}%`}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>`;
}

function servicesPage() {
  return `
    <div class="page-title">
      <div><h1>Services</h1><p class="subtle">Enable service lines that can be promoted by admins.</p></div>
      <button class="btn" data-action="new-service">Add service</button>
    </div>
    <section class="panel">
      <div class="list">
        ${state.services.map(item => `
          <div class="list-row">
            <div class="row-main"><div class="row-icon">S</div><div><strong>${item.name}</strong><span>${item.owner}</span></div></div>
            ${statusPill(item.status)}
          </div>`).join("")}
      </div>
    </section>`;
}

function reportsPage(roleKey) {
  const rows = state.promotions.map(item => ({
    region: item.region,
    spend: item.budget,
    reach: item.reached,
    roi: Math.max(1.2, (item.reached / item.budget) * 100).toFixed(1)
  }));
  return `
    <div class="page-title">
      <div><h1>Reports</h1><p class="subtle">Budget, reach, and completion summaries for ${roleConfig[roleKey].label.toLowerCase()} review.</p></div>
      <button class="btn secondary" data-action="export">Export CSV</button>
    </div>
    <section class="panel">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Region</th><th>Budget</th><th>Reached</th><th>Efficiency</th></tr></thead>
          <tbody>
            ${rows.map(row => `<tr><td>${row.region}</td><td>${money(row.spend)}</td><td>${row.reach.toLocaleString()}</td><td>${row.roi} pts</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>`;
}

function assignmentsPage(roleKey) {
  const items = roleKey === "distributer" ? state.promotions.filter(item => item.distributor === "East Route Team" || item.status !== "Completed") : state.promotions;
  return `
    <div class="page-title">
      <div><h1>${roleKey === "distributer" ? "My Assignments" : "Assignments"}</h1><p class="subtle">Track field ownership and fulfillment status.</p></div>
      ${roleKey !== "distributer" ? `<button class="btn" data-action="new-promotion">New assignment</button>` : ""}
    </div>
    <section class="panel">${promotionsTable(items, roleKey)}</section>`;
}

function submissionsPage() {
  return `
    <div class="page-title">
      <div><h1>Submissions</h1><p class="subtle">Field reports submitted by distributor teams.</p></div>
      <button class="btn" data-action="submit">New submission</button>
    </div>
    <section class="panel">
      <div class="list">
        ${state.submissions.map(item => `
          <div class="list-row">
            <div class="row-main"><div class="row-icon">S</div><div><strong>${item.promotion}</strong><span>${item.quantity} contacts - ${item.note}</span></div></div>
            ${statusPill(item.status)}
          </div>`).join("")}
      </div>
    </section>`;
}

function profilePage() {
  return `
    <div class="page-title">
      <div><h1>Profile</h1><p class="subtle">Distributor workspace preferences and active territory.</p></div>
    </div>
    <section class="panel">
      <div class="list">
        <div class="list-row"><strong>Team</strong><span>East Route Team</span></div>
        <div class="list-row"><strong>Lead</strong><span>Amanuel H.</span></div>
        <div class="list-row"><strong>Region</strong><span>Addis Ababa</span></div>
        <div class="list-row"><strong>Status</strong>${statusPill("Active")}</div>
      </div>
    </section>`;
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function openModal(title, fields, onSubmitLabel, submitHandler) {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${title}">
      <h2>${title}</h2>
      <form data-modal-form>
        ${fields.map(fieldTemplate).join("")}
        <div class="modal-actions">
          <button type="button" class="btn secondary" data-action="close-modal">Cancel</button>
          <button type="submit" class="btn">${onSubmitLabel}</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(backdrop);
  backdrop.querySelector("form").addEventListener("submit", event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    submitHandler(data);
    backdrop.remove();
    saveState();
    render();
  });
}

function fieldTemplate(field) {
  if (field.type === "select") {
    return `
      <div class="field">
        <label>${field.label}</label>
        <select name="${field.name}" required>${field.options.map(option => `<option ${option === field.value ? "selected" : ""}>${option}</option>`).join("")}</select>
      </div>`;
  }
  if (field.type === "textarea") {
    return `
      <div class="field">
        <label>${field.label}</label>
        <textarea name="${field.name}" required>${field.value || ""}</textarea>
      </div>`;
  }
  return `
    <div class="field">
      <label>${field.label}</label>
      <input name="${field.name}" type="${field.type || "text"}" value="${field.value || ""}" required>
    </div>`;
}

function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  window.setTimeout(() => el.classList.remove("show"), 2400);
}

function exportCsv() {
  const header = ["id", "title", "service", "region", "admin", "distributor", "budget", "target", "reached", "status", "approval"];
  const lines = [header.join(",")].concat(state.promotions.map(item => header.map(key => JSON.stringify(item[key] ?? "")).join(",")));
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "promotion-report.csv";
  link.click();
  URL.revokeObjectURL(link.href);
  toast("CSV report exported");
}

document.addEventListener("submit", event => {
  const form = event.target;
  if (!form.matches("[data-form]")) return;
  event.preventDefault();
  const current = route();
  const role = current.role && roleConfig[current.role] ? current.role : "admin";
  const email = form.querySelector("#email").value;
  if (form.dataset.form === "forgot-password") {
    toast(`Reset link prepared for ${email}`);
    navigate(`/login/${role}`);
    return;
  }
  if (form.dataset.form === "register") {
    const password = form.querySelector("#password").value;
    const confirm = form.querySelector("#confirm").value;
    if (password !== confirm) {
      toast("Passwords must match");
      return;
    }
  }
  state.session = { role, email };
  saveState();
  toast(`Signed in as ${roleConfig[role].label}`);
  navigate(`/${role}/dashboard`);
});

document.addEventListener("input", event => {
  if (event.target.matches("[data-action='search']")) {
    state.search = event.target.value;
    saveState();
  }
});

document.addEventListener("change", event => {
  if (event.target.matches("[data-action='search']")) {
    state.search = event.target.value;
    saveState();
    render();
  }
  if (event.target.matches("[data-action='switch-role']")) {
    state.session.role = event.target.value;
    saveState();
    navigate(`/${event.target.value}/dashboard`);
  }
  if (event.target.matches("[data-action='role-preview']")) {
    navigate(`/${route().auth}/${event.target.value}`);
  }
});

document.addEventListener("click", event => {
  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;
  const action = actionEl.dataset.action;
  const id = actionEl.dataset.id;
  if (action === "google") {
    state.session = { role: route().role, email: "google-user@pba.local" };
    saveState();
    toast("Google sign-in simulated");
    navigate(`/${route().role}/dashboard`);
  }
  if (action === "logout") navigate(`/login/${state.session.role}`);
  if (action === "reset-demo") {
    state = structuredClone(seedState);
    saveState();
    toast("Demo data reset");
    render();
  }
  if (action === "tab") {
    state.activeTab = actionEl.dataset.tab;
    saveState();
    render();
  }
  if (action === "export") exportCsv();
  if (action === "approve") {
    const promo = state.promotions.find(item => item.id === id);
    promo.approval = "Approved";
    promo.status = "Active";
    state.audit.unshift(`Super Admin approved ${id}`);
    saveState();
    toast(`${id} approved`);
    render();
  }
  if (action === "assign") assignModal(id);
  if (action === "new-promotion") promotionModal();
  if (action === "new-admin") adminModal();
  if (action === "new-distributor") distributorModal();
  if (action === "new-service") serviceModal();
  if (action === "submit") submissionModal(id);
  if (action === "close-modal") actionEl.closest(".modal-backdrop").remove();
});

function promotionModal() {
  openModal("New promotion", [
    { label: "Title", name: "title" },
    { label: "Service", name: "service", type: "select", options: state.services.map(item => item.name) },
    { label: "Region", name: "region" },
    { label: "Budget", name: "budget", type: "number", value: "10000" },
    { label: "Target reach", name: "target", type: "number", value: "500" }
  ], "Create promotion", data => {
    const admin = state.admins[0].name;
    const distributor = state.distributors[0].name;
    const id = `PR-${2400 + state.promotions.length + 1}`;
    state.promotions.unshift({
      id,
      title: data.title,
      service: data.service,
      region: data.region,
      admin,
      distributor,
      budget: Number(data.budget),
      target: Number(data.target),
      reached: 0,
      status: "Pending",
      approval: "Review",
      starts: new Date().toISOString().slice(0, 10),
      ends: ""
    });
    state.audit.unshift(`${admin} created ${id}`);
    toast(`${id} created`);
  });
}

function assignModal(id) {
  const promo = state.promotions.find(item => item.id === id);
  openModal(`Assign ${id}`, [
    { label: "Admin", name: "admin", type: "select", options: state.admins.map(item => item.name), value: promo.admin },
    { label: "Distributor", name: "distributor", type: "select", options: state.distributors.map(item => item.name), value: promo.distributor },
    { label: "Status", name: "status", type: "select", options: ["Pending", "Active", "Completed"] }
  ], "Save assignment", data => {
    promo.admin = data.admin;
    promo.distributor = data.distributor;
    promo.status = data.status;
    state.audit.unshift(`${data.admin} assigned ${data.distributor} to ${id}`);
    toast(`${id} assignment saved`);
  });
}

function adminModal() {
  openModal("Invite admin", [
    { label: "Name", name: "name" },
    { label: "Email", name: "email", type: "email" },
    { label: "Region", name: "region" }
  ], "Send invite", data => {
    state.admins.push({ id: `AD-0${state.admins.length + 1}`, name: data.name, email: data.email, region: data.region, status: "Invited", promotions: 0 });
    state.audit.unshift(`Invited admin ${data.name}`);
    toast("Admin invitation added");
  });
}

function distributorModal() {
  openModal("Add distributor", [
    { label: "Team name", name: "name" },
    { label: "Team lead", name: "lead" },
    { label: "Region", name: "region" }
  ], "Add distributor", data => {
    state.distributors.push({ id: `DS-${11 + state.distributors.length}`, name: data.name, lead: data.lead, region: data.region, status: "Active", completion: 0 });
    state.audit.unshift(`Added distributor ${data.name}`);
    toast("Distributor added");
  });
}

function serviceModal() {
  openModal("Add service", [
    { label: "Service name", name: "name" },
    { label: "Owner", name: "owner" },
    { label: "Status", name: "status", type: "select", options: ["Enabled", "Review"] }
  ], "Add service", data => {
    state.services.push({ name: data.name, owner: data.owner, status: data.status });
    state.audit.unshift(`Added service ${data.name}`);
    toast("Service added");
  });
}

function submissionModal(id) {
  const promo = state.promotions.find(item => item.id === id) || state.promotions[0];
  openModal("New field submission", [
    { label: "Promotion", name: "promotion", type: "select", options: state.promotions.map(item => item.title) },
    { label: "Quantity reached", name: "quantity", type: "number", value: "25" },
    { label: "Delivery note", name: "note", type: "textarea" }
  ], "Submit report", data => {
    state.submissions.unshift({
      id: `SB-${9001 + state.submissions.length}`,
      promotion: data.promotion || promo.title,
      distributor: "East Route Team",
      quantity: Number(data.quantity),
      note: data.note,
      status: "Review"
    });
    const match = state.promotions.find(item => item.title === data.promotion);
    if (match) match.reached += Number(data.quantity);
    state.audit.unshift(`East Route Team submitted a report`);
    toast("Submission sent for review");
  });
}

window.addEventListener("hashchange", render);
render();
